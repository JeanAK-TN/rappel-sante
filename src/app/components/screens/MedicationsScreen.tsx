import { Plus, Check, Clock, X, ChevronDown, ChevronRight } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { BottomNav } from "../BottomNav";

const meds = [
  { name: "Amlodipine 5mg", time: "08:00", dose: "1 comprimé", status: "confirmed" as const, color: "#43A047" },
  { name: "Metformine 500mg", time: "12:00", dose: "1 comprimé", status: "upcoming" as const, color: "#FF9800" },
  { name: "Losartan 50mg", time: "20:00", dose: "1 comprimé", status: "scheduled" as const, color: "#607D8B" },
];

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const dayStatus = ["normal", "normal", "warning", "critical", "normal", "grey", "grey"];

export function MedicationsScreen() {
  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "#FFFFFF" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Mes Médicaments</div>
          <div style={{ width: 36, height: 36, background: "#1E7D5C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={20} color="#FFFFFF" />
          </div>
        </div>
        {/* Progress */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#607D8B" }}>Prises effectuées aujourd'hui</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1E7D5C" }}>1/3</span>
          </div>
          <div style={{ height: 8, background: "#D6EFE6", borderRadius: 4 }}>
            <div style={{ height: 8, width: "33%", background: "#1E7D5C", borderRadius: 4 }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>AUJOURD'HUI</div>

        {meds.map((med, i) => (
          <div key={i} style={{
            background: "#FFFFFF", borderRadius: 16, padding: 16,
            boxShadow: "0px 2px 12px rgba(0,0,0,0.08)",
            display: "flex", alignItems: "center", gap: 0,
            borderLeft: `4px solid ${med.color}`,
          }}>
            <div style={{ flex: 1, marginLeft: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#1A2E3B" }}>{med.name}</div>
              <div style={{ fontSize: 13, color: "#607D8B", marginTop: 2 }}>{med.dose} · {med.time}</div>
              {med.status === "upcoming" && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <Clock size={12} color="#FF9800" />
                  <span style={{ fontSize: 11, color: "#FF9800", fontWeight: 500 }}>Dans 1h 23min</span>
                </div>
              )}
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: med.status === "confirmed" ? "#43A047" : med.status === "upcoming" ? "#FFF3E0" : "#F4F6F7",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: med.status === "upcoming" ? "2px solid #FF9800" : "none",
            }}>
              {med.status === "confirmed" ? <Check size={18} color="#FFFFFF" /> : med.status === "upcoming" ? <Clock size={16} color="#FF9800" /> : <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #B2CEBF" }} />}
            </div>
          </div>
        ))}

        {/* Cette semaine */}
        <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 8 }}>CETTE SEMAINE</div>
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {days.map((day, i) => {
              const st = dayStatus[i];
              const dot = st === "normal" ? "#43A047" : st === "warning" ? "#FF9800" : st === "critical" ? "#E53935" : "#D1D5DB";
              return (
                <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#607D8B" }}>{day}</span>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />
                  <span style={{ fontSize: 12, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? "#1E7D5C" : "#1A2E3B" }}>
                    {[19, 20, 21, 22, 23, 24, 25][i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav active={1} />
    </div>
  );
}

// Detail Sheet
export function MedDetailSheet() {
  return (
    <div style={{ width: 390, height: 844, background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ background: "#FFFFFF", borderRadius: "24px 24px 0 0", padding: "0 0 32px" }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
        </div>
        <div style={{ padding: "8px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#1A2E3B" }}>Amlodipine 5mg</div>
              <div style={{ display: "inline-block", padding: "4px 12px", background: "#D6EFE6", borderRadius: 20, marginTop: 6 }}>
                <span style={{ fontSize: 12, color: "#1E7D5C", fontWeight: 600 }}>Antihypertenseur</span>
              </div>
            </div>
          </div>
          {/* Info rows */}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 0 }}>
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
          {/* Rappels */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>RAPPELS PROGRAMMÉS</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["08:00", "20:00"].map(t => (
                <div key={t} style={{ padding: "6px 14px", background: "#D6EFE6", borderRadius: 20 }}>
                  <span style={{ fontSize: 13, color: "#1E7D5C", fontWeight: 600 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Notice */}
          <div style={{ marginTop: 16, background: "#F4F6F7", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, marginBottom: 6 }}>NOTICE</div>
            <div style={{ fontSize: 13, color: "#607D8B", lineHeight: 1.5 }}>
              L'amlodipine est un antagoniste calcique utilisé pour traiter l'hypertension...
              <span style={{ color: "#1E7D5C", fontWeight: 600 }}> Lire plus</span>
            </div>
          </div>
          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button style={{ flex: 1, height: 52, background: "transparent", border: "2px solid #1E7D5C", borderRadius: 12, color: "#1E7D5C", fontSize: 15, fontWeight: 600 }}>
              Modifier
            </button>
            <button style={{ flex: 1, height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 15, fontWeight: 600 }}>
              Marquer pris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
