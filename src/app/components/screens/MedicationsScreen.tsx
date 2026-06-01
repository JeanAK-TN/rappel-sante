import { useState, useEffect } from "react";
import { Plus, Check, Clock, X, Pencil, Trash2 } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { BottomNav } from "../BottomNav";
import { useStore } from "../../store/AppStore";
import { useToast } from "../../ui/toast";
import { dayCompletion, frequencyLabel, durationLabel } from "../../store/health";
import { syncMedicationReminders } from "../../notifications";
import type { Medication } from "../../store/types";

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function MedicationsScreen() {
  const store = useStore();
  const toast = useToast();
  const { medications } = store.state;
  const [addOpen, setAddOpen] = useState(false);
  const [editMed, setEditMed] = useState<Medication | null>(null);
  const [detail, setDetail] = useState<Medication | null>(null);

  // Replanifie les rappels quand les médicaments ou la préférence changent (natif uniquement).
  const remindersEnabled = store.state.profile.notifications.rappels;
  useEffect(() => {
    syncMedicationReminders(medications, remindersEnabled);
  }, [medications, remindersEnabled]);

  function toggleWithToast(medId: string, time: string) {
    const wasTaken = store.isTaken(medId, time);
    store.toggleIntake(medId, time);
    toast.show(wasTaken ? "Prise annulée" : "Bravo, prise enregistrée 👍", wasTaken ? "info" : "success");
  }

  const { done, total } = store.takenCountToday();
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Une ligne par (médicament, horaire).
  const rows = medications.flatMap(med =>
    med.times.map(time => ({ med, time, taken: store.isTaken(med.id, time) }))
  );
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const untaken = rows.filter(r => !r.taken);
  const futureUntaken = untaken.filter(r => toMinutes(r.time) >= nowMin);
  const pool = futureUntaken.length ? futureUntaken : untaken;
  const soonest = pool.length
    ? pool.reduce((a, b) => (toMinutes(a.time) <= toMinutes(b.time) ? a : b))
    : null;

  function countdown(time: string): string {
    const diff = toMinutes(time) - nowMin;
    if (diff < 0) return "En retard";
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return h > 0 ? `Dans ${h}h ${m}min` : `Dans ${m}min`;
  }

  // Pastilles de la semaine : vert si toutes prises, orange si partiel, gris sinon.
  const todayDow = (new Date().getDay() + 6) % 7; // 0 = lundi
  const monday = new Date();
  monday.setDate(monday.getDate() - todayDow);
  const weekDays = days.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
  const dotColor: Record<string, string> = { full: "#43A047", partial: "#FF9800", none: "#D1D5DB" };

  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "#FFFFFF" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Mes Médicaments</div>
          <button
            onClick={() => setAddOpen(true)}
            style={{ width: 36, height: 36, background: "#1E7D5C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
          >
            <Plus size={20} color="#FFFFFF" />
          </button>
        </div>
        {medications.length > 0 && (
          <div style={{ padding: "0 20px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#607D8B" }}>Prises effectuées aujourd'hui</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1E7D5C" }}>{done}/{total}</span>
            </div>
            <div style={{ height: 8, background: "#D6EFE6", borderRadius: 4 }}>
              <div style={{ height: 8, width: `${pct}%`, background: "#1E7D5C", borderRadius: 4, transition: "width 0.3s" }} />
            </div>
          </div>
        )}
      </div>

      {medications.length === 0 ? (
        <EmptyState onAdd={() => setAddOpen(true)} />
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>AUJOURD'HUI</div>

          {rows.map(({ med, time, taken }) => {
            const isSoonest = soonest && soonest.med.id === med.id && soonest.time === time;
            const status = taken ? "confirmed" : isSoonest ? "upcoming" : "scheduled";
            return (
              <div
                key={`${med.id}@${time}`}
                onClick={() => setDetail(med)}
                style={{
                  background: "#FFFFFF", borderRadius: 16, padding: 16,
                  boxShadow: "0px 2px 12px rgba(0,0,0,0.08)",
                  display: "flex", alignItems: "center", cursor: "pointer",
                  borderLeft: `4px solid ${med.color}`,
                }}
              >
                <div style={{ flex: 1, marginLeft: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#1A2E3B" }}>{med.name}</div>
                  <div style={{ fontSize: 13, color: "#607D8B", marginTop: 2 }}>{med.dose} · {time}</div>
                  {status === "upcoming" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                      <Clock size={12} color="#FF9800" />
                      <span style={{ fontSize: 11, color: "#FF9800", fontWeight: 500 }}>{countdown(time)}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWithToast(med.id, time); }}
                  title={taken ? "Annuler la prise" : "Marquer comme pris"}
                  style={{
                    width: 36, height: 36, borderRadius: "50%", cursor: "pointer", padding: 0,
                    background: status === "confirmed" ? "#43A047" : status === "upcoming" ? "#FFF3E0" : "#F4F6F7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: status === "upcoming" ? "2px solid #FF9800" : "none",
                  }}
                >
                  {status === "confirmed" ? <Check size={18} color="#FFFFFF" /> : status === "upcoming" ? <Clock size={16} color="#FF9800" /> : <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #B2CEBF" }} />}
                </button>
              </div>
            );
          })}

          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 8 }}>CETTE SEMAINE</div>
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {days.map((day, i) => {
                const isToday = i === todayDow;
                const d = weekDays[i];
                const isFuture = d.getTime() > Date.now() && !isToday;
                const dot = isFuture ? "#D1D5DB" : dotColor[dayCompletion(store.state.intakeLog, d, total)];
                return (
                  <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "#607D8B" }}>{day}</span>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />
                    <span style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? "#1E7D5C" : "#1A2E3B" }}>
                      {d.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <BottomNav active={1} />

      {addOpen && (
        <MedicationSheet
          onClose={() => setAddOpen(false)}
          onSave={(m) => { store.addMedication(m); setAddOpen(false); toast.show("Médicament ajouté ✅"); }}
        />
      )}
      {editMed && (
        <MedicationSheet
          initial={editMed}
          onClose={() => setEditMed(null)}
          onSave={(m) => { store.updateMedication(editMed.id, m); setEditMed(null); toast.show("Médicament modifié ✅"); }}
        />
      )}
      {detail && (
        <MedDetailSheetLive
          med={detail}
          onClose={() => setDetail(null)}
          onToggle={toggleWithToast}
          onEdit={(m) => { setDetail(null); setEditMed(m); }}
          onDelete={(m) => { setDetail(null); store.removeMedication(m.id); toast.show("Médicament supprimé", "info"); }}
        />
      )}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px", gap: 16 }}>
      <div style={{ width: 120, height: 120, background: "#D6EFE6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <rect x="20" y="8" width="20" height="44" rx="10" fill="#1E7D5C" opacity="0.3" />
          <rect x="8" y="20" width="44" height="20" rx="10" fill="#1E7D5C" opacity="0.3" />
          <circle cx="44" cy="16" r="6" fill="#43A047" />
          <path d="M41 16L43.5 18.5L47 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#1A2E3B", marginBottom: 10 }}>Aucun traitement enregistré</div>
        <div style={{ fontSize: 14, color: "#607D8B", lineHeight: 1.6 }}>
          Ajoutez vos médicaments pour recevoir des rappels personnalisés et ne plus oublier une prise.
        </div>
      </div>
      <button onClick={onAdd} style={{ width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
        <Plus size={20} color="#FFFFFF" />
        Ajouter un médicament
      </button>
    </div>
  );
}

const COLORS = ["#1E7D5C", "#2196F3", "#FF9800", "#43A047", "#E53935"];

export function MedicationSheet({ initial, onClose, onSave }: { initial?: Medication; onClose: () => void; onSave: (m: Omit<Medication, "id">) => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [dose, setDose] = useState(initial?.dose ?? "1 comprimé");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [times, setTimes] = useState<string[]>(initial?.times?.length ? [...initial.times] : ["08:00"]);
  const [color, setColor] = useState(initial?.color ?? COLORS[0]);
  const [frequencyUnit, setFrequencyUnit] = useState<"jour" | "semaine" | "mois">(initial?.frequencyUnit ?? "jour");
  const [lifelong, setLifelong] = useState<boolean>(initial?.lifelong ?? false);
  const [durationValue, setDurationValue] = useState(initial?.durationValue ? String(initial.durationValue) : "");
  const [durationUnit, setDurationUnit] = useState<"jours" | "semaines" | "mois">(initial?.durationUnit ?? "mois");
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");

  const canSave = name.trim().length > 0;

  function submit() {
    if (!canSave) return;
    onSave({
      name: name.trim(), dose: dose.trim() || "1 comprimé",
      category: category.trim() || "Médicament", color,
      times: Array.from(new Set(times)).sort(),
      frequencyUnit,
      lifelong,
      durationValue: lifelong ? undefined : parseInt(durationValue, 10) || undefined,
      durationUnit: lifelong ? undefined : durationUnit,
      instructions: instructions.trim() || undefined,
      prescriber: initial?.prescriber, since: initial?.since, notice: initial?.notice,
    });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 48, background: "#F4F6F7", borderRadius: 8, border: "1.5px solid #B2CEBF",
    paddingInline: 14, fontSize: 15, color: "#1A2E3B", outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, color: "#607D8B", fontWeight: 600, marginBottom: 6 };
  const chipStyle = (on: boolean): React.CSSProperties => ({
    flex: 1, height: 42, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: on ? 600 : 400,
    background: on ? "#1E7D5C" : "#F4F6F7", color: on ? "#FFFFFF" : "#607D8B", border: on ? "none" : "1.5px solid #B2CEBF",
  });

  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1A2E3B" }}>{initial ? "Modifier le médicament" : "Ajouter un médicament"}</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} color="#607D8B" /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={labelStyle}>Nom du médicament</div>
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Ex. Amlodipine 5mg" autoFocus />
        </div>
        <div>
          <div style={labelStyle}>Dose</div>
          <input style={inputStyle} value={dose} onChange={e => setDose(e.target.value)} placeholder="1 comprimé" />
        </div>
        <div>
          <div style={labelStyle}>Fréquence</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {(["jour", "semaine", "mois"] as const).map(u => (
              <button key={u} onClick={() => setFrequencyUnit(u)} style={chipStyle(frequencyUnit === u)}>par {u}</button>
            ))}
          </div>
          <div style={labelStyle}>Horaires de prise · {times.length} fois par {frequencyUnit}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {times.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input style={{ ...inputStyle, flex: 1 }} type="time" value={t}
                  onChange={e => setTimes(ts => ts.map((x, j) => (j === i ? e.target.value : x)))} />
                {times.length > 1 && (
                  <button onClick={() => setTimes(ts => ts.filter((_, j) => j !== i))} title="Retirer"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
                    <X size={18} color="#E53935" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setTimes(ts => [...ts, "12:00"])}
              style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#1E7D5C", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0" }}>
              <Plus size={16} color="#1E7D5C" /> Ajouter un horaire
            </button>
          </div>
        </div>
        <div>
          <div style={labelStyle}>Durée du traitement</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setLifelong(false)} style={chipStyle(!lifelong)}>Durée limitée</button>
            <button onClick={() => setLifelong(true)} style={chipStyle(lifelong)}>À vie</button>
          </div>
          {!lifelong && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input style={{ ...inputStyle, flex: 1 }} value={durationValue} onChange={e => setDurationValue(e.target.value.replace(/\D/g, ""))} placeholder="Ex. 6" inputMode="numeric" />
              <select style={{ ...inputStyle, flex: 1 }} value={durationUnit} onChange={e => setDurationUnit(e.target.value as "jours" | "semaines" | "mois")}>
                <option value="jours">jours</option>
                <option value="semaines">semaines</option>
                <option value="mois">mois</option>
              </select>
            </div>
          )}
        </div>
        <div>
          <div style={labelStyle}>Catégorie</div>
          <input style={inputStyle} value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex. Antihypertenseur" />
        </div>
        <div>
          <div style={labelStyle}>Consignes (optionnel)</div>
          <input style={inputStyle} value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Ex. À prendre pendant le repas" />
        </div>
        <div>
          <div style={labelStyle}>Couleur</div>
          <div style={{ display: "flex", gap: 10 }}>
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)} style={{
                width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer",
                border: color === c ? "3px solid #1A2E3B" : "3px solid transparent",
              }} />
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={submit}
        disabled={!canSave}
        style={{ width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, marginTop: 24, cursor: canSave ? "pointer" : "not-allowed", opacity: canSave ? 1 : 0.4 }}
      >
        Enregistrer
      </button>
    </Overlay>
  );
}

function MedDetailSheetLive({ med, onClose, onToggle, onEdit, onDelete }: {
  med: Medication; onClose: () => void;
  onToggle: (medId: string, time: string) => void;
  onEdit: (m: Medication) => void;
  onDelete: (m: Medication) => void;
}) {
  const store = useStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const firstTime = med.times[0];
  const taken = store.isTaken(med.id, firstTime);
  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1A2E3B" }}>{med.name}</div>
          <div style={{ display: "inline-block", padding: "4px 12px", background: "#D6EFE6", borderRadius: 20, marginTop: 6 }}>
            <span style={{ fontSize: 12, color: "#1E7D5C", fontWeight: 600 }}>{med.category}</span>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} color="#607D8B" /></button>
      </div>
      <div style={{ marginTop: 20 }}>
        {[
          ["Dosage", med.dose],
          ["Fréquence", frequencyLabel(med)],
          ["Durée", durationLabel(med)],
          ["Depuis", med.since ?? "—"],
          ["Prescripteur", med.prescriber ?? "—"],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBlock: 12, borderBottom: "1px solid #F4F6F7" }}>
            <span style={{ fontSize: 14, color: "#607D8B" }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#1A2E3B" }}>{val}</span>
          </div>
        ))}
      </div>
      {med.instructions && (
        <div style={{ marginTop: 14, background: "#D6EFE6", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 12, color: "#1E7D5C", fontWeight: 700, marginBottom: 4 }}>CONSIGNES DU MÉDECIN</div>
          <div style={{ fontSize: 13, color: "#1A2E3B", lineHeight: 1.5 }}>{med.instructions}</div>
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>RAPPELS PROGRAMMÉS</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {med.times.map(t => (
            <div key={t} style={{ padding: "6px 14px", background: "#D6EFE6", borderRadius: 20 }}>
              <span style={{ fontSize: 13, color: "#1E7D5C", fontWeight: 600 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      {med.notice && (
        <div style={{ marginTop: 16, background: "#F4F6F7", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, marginBottom: 6 }}>NOTICE</div>
          <div style={{ fontSize: 13, color: "#607D8B", lineHeight: 1.5 }}>{med.notice}</div>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button
          onClick={() => onEdit(med)}
          style={{ flex: 1, height: 52, background: "transparent", border: "2px solid #1E7D5C", borderRadius: 12, color: "#1E7D5C", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <Pencil size={16} color="#1E7D5C" /> Modifier
        </button>
        <button
          onClick={() => { onToggle(med.id, firstTime); onClose(); }}
          style={{ flex: 1, height: 52, background: taken ? "#607D8B" : "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
        >
          {taken ? "Annuler la prise" : "Marquer pris"}
        </button>
      </div>

      {confirmDelete ? (
        <div style={{ marginTop: 12, background: "#FFEBEE", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 13, color: "#1A2E3B", marginBottom: 10 }}>Supprimer définitivement « {med.name} » ?</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, height: 44, background: "transparent", border: "1.5px solid #B2CEBF", borderRadius: 10, color: "#607D8B", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Annuler</button>
            <button onClick={() => onDelete(med)} style={{ flex: 1, height: 44, background: "#E53935", border: "none", borderRadius: 10, color: "#FFFFFF", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Supprimer</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          style={{ width: "100%", height: 44, marginTop: 12, background: "transparent", border: "none", color: "#E53935", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <Trash2 size={16} color="#E53935" /> Supprimer le médicament
        </button>
      )}
    </Overlay>
  );
}

/** Feuille modale glissant depuis le bas. */
function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 10 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#FFFFFF", borderRadius: "24px 24px 0 0", padding: "0 20px 28px", maxHeight: "85%", overflowY: "auto" }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 16px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
        </div>
        {children}
      </div>
    </div>
  );
}

// Maquette statique conservée pour la galerie (route /gallery).
export function MedDetailSheet() {
  return (
    <div style={{ width: 390, height: 844, background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ background: "#FFFFFF", borderRadius: "24px 24px 0 0", padding: "0 0 32px" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
        </div>
        <div style={{ padding: "8px 20px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1A2E3B" }}>Amlodipine 5mg</div>
          <div style={{ display: "inline-block", padding: "4px 12px", background: "#D6EFE6", borderRadius: 20, marginTop: 6 }}>
            <span style={{ fontSize: 12, color: "#1E7D5C", fontWeight: 600 }}>Antihypertenseur</span>
          </div>
          <div style={{ marginTop: 20 }}>
            {[
              ["Dosage", "5mg par prise"],
              ["Fréquence", "1 fois par jour"],
              ["Depuis", "12 janv. 2025"],
              ["Prescripteur", "Dr. Ayeva Koffi"],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBlock: 12, borderBottom: "1px solid #F4F6F7" }}>
                <span style={{ fontSize: 14, color: "#607D8B" }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#1A2E3B" }}>{val}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button style={{ flex: 1, height: 52, background: "transparent", border: "2px solid #1E7D5C", borderRadius: 12, color: "#1E7D5C", fontSize: 15, fontWeight: 600 }}>Modifier</button>
            <button style={{ flex: 1, height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 15, fontWeight: 600 }}>Marquer pris</button>
          </div>
        </div>
      </div>
    </div>
  );
}
