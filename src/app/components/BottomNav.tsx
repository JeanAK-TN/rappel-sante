import { Home, Pill, LineChart, Brain, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

const tabs = [
  { icon: Home, label: "Accueil", path: "/home" },
  { icon: Pill, label: "Médicaments", path: "/medications" },
  { icon: LineChart, label: "Suivi", path: "/tracking" },
  { icon: Brain, label: "Coaching", path: "/coaching" },
  { icon: User, label: "Profil", path: "/profile" },
];

export function BottomNav({ active }: { active?: number }) {
  const navigate = useNavigate();
  const location = useLocation();

  // L'onglet actif est déduit de l'URL ; `active` reste un repli (galerie figée).
  const routeActive = tabs.findIndex(t => location.pathname.startsWith(t.path));
  const activeIndex = routeActive >= 0 ? routeActive : (active ?? 0);

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
      background: "#FFFFFF", borderTop: "1px solid #E0E0E0",
      display: "flex", alignItems: "center", justifyContent: "space-around",
      paddingBottom: 8,
    }}>
      {tabs.map((tab, i) => {
        const Icon = tab.icon;
        const isActive = i === activeIndex;
        return (
          <button
            key={i}
            onClick={() => navigate(tab.path)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              background: "none", border: "none", cursor: "pointer", padding: "4px 8px",
            }}
          >
            {isActive && (
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1E7D5C", marginBottom: 2 }} />
            )}
            <Icon size={22} color={isActive ? "#1E7D5C" : "#607D8B"} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{ fontSize: 11, color: isActive ? "#1E7D5C" : "#607D8B", fontWeight: isActive ? 600 : 400 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
