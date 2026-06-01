import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, ChevronRight, AlertTriangle, Users, Bell, MessageSquare, Settings, Plus, Trash2, Phone, Search } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { useStore } from "../../store/AppStore";
import { useToast } from "../../ui/toast";
import { statusOf, formatValue, STATUS_COLOR, MEASURE_META, frequencyLabel, durationLabel, type HealthStatus } from "../../store/health";
import { MedicationSheet } from "./MedicationsScreen";
import type { MeasureType } from "../../store/types";

const RANK: Record<HealthStatus, number> = { normal: 0, warning: 1, critical: 2 };

function initials(first: string, last: string) {
  return ((first[0] ?? "") + (last[0] ?? "")).toUpperCase() || "?";
}

// Statut le plus préoccupant d'un patient (glycémie + tension).
function worstStatus(store: ReturnType<typeof useStore>, userId: string): HealthStatus {
  let worst: HealthStatus = "normal";
  for (const type of ["glycemie", "tension"] as MeasureType[]) {
    const last = store.measurementsForUser(userId, type).at(-1);
    if (last) {
      const s = statusOf(type, last.value);
      if (RANK[s] > RANK[worst]) worst = s;
    }
  }
  return worst;
}

// ---- Tableau de bord médecin ----
export function MedecinDashboard() {
  const navigate = useNavigate();
  const store = useStore();
  const [query, setQuery] = useState("");
  const patients = store.usersList();

  const withStatus = patients.map(p => ({ ...p, status: worstStatus(store, p.id) }));
  const alertes = withStatus.filter(p => p.status === "critical");
  const q = query.trim().toLowerCase();
  const filtered = q ? withStatus.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)) : withStatus;

  // Adhérence moyenne du jour (patients ayant un traitement).
  const adh = patients
    .map(p => store.takenCountFor(p.id))
    .filter(c => c.total > 0)
    .map(c => c.done / c.total);
  const adherence = adh.length ? Math.round((adh.reduce((a, b) => a + b, 0) / adh.length) * 100) : null;

  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "#145C40" }}>
        <StatusBar dark />
        <div style={{ padding: "8px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <button onClick={() => navigate("/")} title="Retour" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
              <ChevronLeft size={20} color="rgba(255,255,255,0.85)" />
            </button>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: 1, textTransform: "uppercase" }}>Espace Médecin</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>Tableau de bord</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Dr. Ayeva Koffi · Lomé, Togo</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px", display: "flex", flexDirection: "column", gap: 16 }}>
        {alertes.length > 0 && (
          <div style={{ background: "#FFEBEE", borderRadius: 16, padding: 16, borderLeft: "4px solid #E53935", display: "flex", alignItems: "center", gap: 12 }}>
            <AlertTriangle size={20} color="#E53935" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A2E3B" }}>{alertes.length} patient{alertes.length > 1 ? "s" : ""} nécessite{alertes.length > 1 ? "nt" : ""} votre attention</div>
              <div style={{ fontSize: 12, color: "#E53935" }}>{alertes.map(a => a.firstName).join(", ")} · valeur critique</div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          {[
            [String(patients.length), "Patients"],
            [String(alertes.length), "Alertes"],
            [adherence === null ? "—" : `${adherence}%`, "Adhérence"],
          ].map(([val, label]) => (
            <div key={label} style={{ flex: 1, background: "#FFFFFF", borderRadius: 16, padding: "16px 12px", textAlign: "center", boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#1E7D5C" }}>{val}</div>
              <div style={{ fontSize: 11, color: "#607D8B", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>MES PATIENTS</div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#FFFFFF", borderRadius: 12, padding: "10px 14px", marginBottom: 12, boxShadow: "0px 2px 8px rgba(0,0,0,0.06)" }}>
            <Search size={18} color="#607D8B" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un patient..."
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#1A2E3B" }}
            />
          </div>

          {withStatus.length === 0 && (
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 24, textAlign: "center", color: "#607D8B", fontSize: 14 }}>
              Aucun patient enregistré pour l'instant.
            </div>
          )}
          {withStatus.length > 0 && filtered.length === 0 && (
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 24, textAlign: "center", color: "#607D8B", fontSize: 14 }}>
              Aucun patient ne correspond à « {query} ».
            </div>
          )}
          {filtered.map(p => {
            const user = store.getUser(p.id);
            const patho = user?.profile.pathologies.join(" · ") || "—";
            const nbMeds = user?.medications.length ?? 0;
            const dot = STATUS_COLOR[p.status];
            return (
              <div key={p.id} onClick={() => navigate(`/medecin/patient/${p.id}`)} style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, background: "#D6EFE6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1E7D5C" }}>{initials(p.firstName, p.lastName)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A2E3B" }}>{p.firstName} {p.lastName}</div>
                  <div style={{ fontSize: 12, color: "#607D8B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{patho}</div>
                  <div style={{ fontSize: 11, color: "#B2CEBF", marginTop: 2 }}>{nbMeds} médicament{nbMeds > 1 ? "s" : ""}</div>
                </div>
                <div style={{ width: 10, height: 10, background: dot, borderRadius: "50%" }} />
                <ChevronRight size={16} color="#B2CEBF" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation médecin (décorative) */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "#FFFFFF", borderTop: "1px solid #E0E0E0", display: "flex", alignItems: "center", justifyContent: "space-around", paddingBottom: 8 }}>
        {[
          { icon: <Users size={22} color="#1E7D5C" />, label: "Patients", active: true },
          { icon: <Bell size={22} color="#607D8B" />, label: "Alertes" },
          { icon: <MessageSquare size={22} color="#607D8B" />, label: "Messages" },
          { icon: <Settings size={22} color="#607D8B" />, label: "Paramètres" },
        ].map((tab, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            {tab.active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1E7D5C", marginBottom: 2 }} />}
            {tab.icon}
            <span style={{ fontSize: 11, color: tab.active ? "#1E7D5C" : "#607D8B", fontWeight: tab.active ? 600 : 400 }}>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Fiche patient (côté médecin) ----
export function MedecinPatient() {
  const navigate = useNavigate();
  const store = useStore();
  const toast = useToast();
  const { id = "" } = useParams();
  const [addOpen, setAddOpen] = useState(false);

  const user = store.getUser(id);

  if (!user) {
    return (
      <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
        <div style={{ fontSize: 16, color: "#607D8B" }}>Patient introuvable.</div>
        <button onClick={() => navigate("/medecin")} style={{ height: 48, paddingInline: 20, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontWeight: 600, cursor: "pointer" }}>Retour</button>
      </div>
    );
  }

  const p = user.profile;
  const meds = user.medications;

  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "#145C40" }}>
        <StatusBar dark />
        <div style={{ padding: "8px 16px 18px", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => navigate("/medecin")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </button>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>Fiche patient</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Identité */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, background: "#1E7D5C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>{initials(p.firstName, p.lastName)}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1A2E3B" }}>{p.firstName} {p.lastName}</div>
            <div style={{ fontSize: 13, color: "#607D8B" }}>{p.age ? `${p.age} ans · ` : ""}{p.sex}</div>
            {p.phone && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#607D8B", marginTop: 2 }}><Phone size={12} color="#607D8B" />{p.phone}</div>}
          </div>
        </div>

        {p.pathologies.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {p.pathologies.map(path => (
              <div key={path} style={{ padding: "4px 12px", background: "#D6EFE6", borderRadius: 20 }}>
                <span style={{ fontSize: 12, color: "#1E7D5C", fontWeight: 600 }}>{path}</span>
              </div>
            ))}
          </div>
        )}
        {p.diseaseDetail && (
          <div style={{ background: "#FFFFFF", borderRadius: 12, padding: "12px 14px", boxShadow: "0px 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 12, color: "#607D8B", fontWeight: 600 }}>Maladie : </span>
            <span style={{ fontSize: 13, color: "#1A2E3B" }}>{p.diseaseDetail}</span>
          </div>
        )}

        {/* Indicateurs */}
        <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Indicateurs récents</div>
        <div style={{ display: "flex", gap: 12 }}>
          {(["glycemie", "tension", "poids"] as MeasureType[]).map(type => {
            const last = store.measurementsForUser(id, type).at(-1);
            const color = last ? STATUS_COLOR[statusOf(type, last.value)] : "#B2CEBF";
            return (
              <div key={type} style={{ flex: 1, background: "#FFFFFF", borderRadius: 14, padding: 14, boxShadow: "0px 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 11, color: "#607D8B" }}>{MEASURE_META[type].label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color, marginTop: 4 }}>{last ? formatValue(last) : "—"}</div>
                <div style={{ fontSize: 10, color: "#B2CEBF" }}>{MEASURE_META[type].unit}</div>
              </div>
            );
          })}
        </div>

        {/* Traitement */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Traitement</div>
          <button onClick={() => setAddOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1E7D5C", border: "none", borderRadius: 20, padding: "6px 14px", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Plus size={16} color="#FFFFFF" /> Attribuer
          </button>
        </div>

        {meds.length === 0 ? (
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 24, textAlign: "center", color: "#607D8B", fontSize: 14 }}>
            Aucun médicament attribué. Touchez « Attribuer » pour en ajouter un.
          </div>
        ) : (
          meds.map(med => (
            <div key={med.id} style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 12, borderLeft: `4px solid ${med.color}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1A2E3B" }}>{med.name}</div>
                <div style={{ fontSize: 12, color: "#607D8B", marginTop: 2 }}>{med.dose} · {med.times.join(", ")}</div>
                <div style={{ fontSize: 11, color: "#1E7D5C", fontWeight: 600, marginTop: 2 }}>{frequencyLabel(med)} · {durationLabel(med)}</div>
                {med.instructions && <div style={{ fontSize: 11, color: "#B2CEBF", marginTop: 2, fontStyle: "italic" }}>{med.instructions}</div>}
              </div>
              <button
                onClick={() => { store.removeMedicationFor(id, med.id); toast.show("Médicament retiré", "info"); }}
                title="Retirer"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}
              >
                <Trash2 size={18} color="#E53935" />
              </button>
            </div>
          ))
        )}
      </div>

      {addOpen && (
        <MedicationSheet
          onClose={() => setAddOpen(false)}
          onSave={(m) => {
            store.addMedicationFor(id, { ...m, prescriber: p.firstName ? "Dr. Ayeva Koffi" : m.prescriber });
            setAddOpen(false);
            toast.show("Médicament attribué ✅");
          }}
        />
      )}
    </div>
  );
}
