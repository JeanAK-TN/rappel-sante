import { Plus, AlertTriangle, Phone, ChevronRight, Bell, Users, MessageSquare, Settings } from "lucide-react";
import { StatusBar } from "../StatusBar";

// Push Notification (lock screen)
export function NotificationScreen() {
  return (
    <div style={{ width: 390, height: 844, background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Lock screen header */}
      <div style={{ padding: "60px 0 30px", textAlign: "center" }}>
        <div style={{ fontSize: 56, fontWeight: 200, color: "#FFFFFF" }}>07:34</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>Lundi 19 mai 2026</div>
      </div>
      {/* Notification card */}
      <div style={{ margin: "0 20px" }}>
        <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(20px)", borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, background: "#1E7D5C", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="white" /></svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>Rappel Santé</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginLeft: "auto" }}>Maintenant</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF", marginBottom: 4 }}>💊 Heure de prise !</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>Metformine 500mg — Dose du midi</div>
          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={{ flex: 1, height: 36, background: "rgba(67,160,71,0.9)", border: "none", borderRadius: 10, color: "#FFFFFF", fontSize: 13, fontWeight: 600 }}>
              ✓ Pris
            </button>
            <button style={{ flex: 1, height: 36, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 500 }}>
              ⏰ Rappeler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Critical Alert Modal
export function CriticalAlertScreen() {
  return (
    <div style={{ width: 390, height: 844, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#FFFFFF", borderRadius: 20, overflow: "hidden", width: "100%" }}>
        {/* Red header */}
        <div style={{ background: "#E53935", padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={28} color="#FFFFFF" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>Valeur inhabituelle détectée</div>
        </div>
        {/* Content */}
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 14, color: "#607D8B", lineHeight: 1.6, textAlign: "center", marginBottom: 20 }}>
            Votre glycémie de <span style={{ color: "#E53935", fontWeight: 700 }}>2.10 g/L</span> est supérieure au seuil critique (1.80 g/L).
            <br /><br />
            Nous recommandons de contacter votre médecin rapidement.
          </div>
          {/* Value badge */}
          <div style={{ background: "#FFEBEE", borderRadius: 12, padding: "12px 16px", textAlign: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: "#E53935" }}>2.10</span>
            <span style={{ fontSize: 16, color: "#E53935" }}> g/L</span>
            <div style={{ fontSize: 12, color: "#607D8B", marginTop: 4 }}>Seuil critique : 1.80 g/L</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button style={{ width: "100%", height: 52, background: "#E53935", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Phone size={18} color="#FFFFFF" />
              Contacter mon médecin
            </button>
            <button style={{ width: "100%", height: 52, background: "transparent", border: "2px solid #E53935", borderRadius: 12, color: "#E53935", fontSize: 15, fontWeight: 600 }}>
              Compris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty State - Medications
export function EmptyStateScreen() {
  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#FFFFFF" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Mes Médicaments</div>
          <div style={{ width: 36, height: 36, background: "#1E7D5C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={20} color="#FFFFFF" />
          </div>
        </div>
      </div>
      {/* Empty content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px", gap: 16 }}>
        {/* Illustration */}
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
        <button style={{ width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Plus size={20} color="#FFFFFF" />
          Ajouter un médicament
        </button>
      </div>
    </div>
  );
}

// Espace Médecin
export function MedecinDashboard() {
  const patients = [
    { name: "Kofi Amewoyi", patho: "Hypertension · Diabète", lastContact: "Hier", alert: true },
    { name: "Afiwa Dossou", patho: "Insuffisance cardiaque", lastContact: "Il y a 3j", alert: false },
    { name: "Yao Kuma", patho: "Asthme", lastContact: "Il y a 5j", alert: false },
  ];

  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Header - different style */}
      <div style={{ background: "#145C40" }}>
        <StatusBar dark />
        <div style={{ padding: "8px 20px 20px" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Espace Médecin</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>Tableau de bord</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Dr. Ayeva Koffi · Lomé, Togo</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Alert section */}
        <div style={{ background: "#FFEBEE", borderRadius: 16, padding: 16, borderLeft: "4px solid #E53935", display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={20} color="#E53935" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A2E3B" }}>1 patient nécessite votre attention</div>
            <div style={{ fontSize: 12, color: "#E53935" }}>Kofi Amewoyi — Glycémie critique ce matin</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 12 }}>
          {[["12", "Patients actifs"], ["3", "Alertes semaine"], ["89%", "Adhérence moy."]].map(([val, label]) => (
            <div key={label} style={{ flex: 1, background: "#FFFFFF", borderRadius: 16, padding: "16px 12px", textAlign: "center", boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#1E7D5C" }}>{val}</div>
              <div style={{ fontSize: 11, color: "#607D8B", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Patients */}
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>MES PATIENTS</div>
          {patients.map((p, i) => (
            <div key={i} style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, background: i === 0 ? "#1E7D5C" : "#D6EFE6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? "#FFFFFF" : "#1E7D5C" }}>
                  {p.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1A2E3B" }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#607D8B" }}>{p.patho}</div>
                <div style={{ fontSize: 11, color: "#B2CEBF", marginTop: 2 }}>Dernier contact : {p.lastContact}</div>
              </div>
              {p.alert && (
                <div style={{ width: 10, height: 10, background: "#E53935", borderRadius: "50%" }} />
              )}
              <ChevronRight size={16} color="#B2CEBF" />
            </div>
          ))}
        </div>
      </div>

      {/* Doctor bottom nav - different */}
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
