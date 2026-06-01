import { Bell, Plus, TrendingUp, TrendingDown, Minus, ChevronRight, Utensils, Stethoscope, PenLine } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { BottomNav } from "../BottomNav";

function MetricCard({ icon, label, value, unit, trend, status, half = false }: {
  icon: React.ReactNode; label: string; value: string; unit: string;
  trend: "up" | "down" | "stable"; status: "normal" | "warning" | "critical"; half?: boolean;
}) {
  const statusColor = status === "normal" ? "#43A047" : status === "warning" ? "#FF9800" : "#E53935";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  return (
    <div style={{
      background: "#FFFFFF", borderRadius: 16, padding: 16,
      boxShadow: "0px 2px 12px rgba(0,0,0,0.08)",
      flex: half ? "0 0 calc(50% - 6px)" : "1 1 100%",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 32, height: 32, background: "#D6EFE6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <span style={{ fontSize: 12, color: "#607D8B", fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 28, fontWeight: 700, color: statusColor }}>{value}</span>
          <span style={{ fontSize: 13, color: "#607D8B", marginLeft: 4 }}>{unit}</span>
        </div>
        <TrendIcon size={16} color={statusColor} />
      </div>
    </div>
  );
}

export function DashboardScreen() {
  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "#FFFFFF" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Bonjour, Kofi 👋</div>
            <div style={{ fontSize: 14, color: "#607D8B", marginTop: 2 }}>Lundi 19 mai 2026</div>
          </div>
          <div style={{ width: 40, height: 40, background: "#1E7D5C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>KA</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Alert card */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", borderLeft: "4px solid #FF9800", display: "flex", alignItems: "center", gap: 12 }}>
          <Bell size={20} color="#FF9800" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1A2E3B" }}>Prochaine prise : Amlodipine 5mg</div>
            <div style={{ fontSize: 12, color: "#FF9800" }}>Dans 45 minutes · 08h00</div>
          </div>
        </div>

        {/* Mes indicateurs */}
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>MES INDICATEURS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <MetricCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#1E7D5C" /></svg>} label="Tension artérielle" value="128/82" unit="mmHg" trend="stable" status="normal" half={true} />
            <MetricCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#FF9800" strokeWidth="2" /><path d="M12 6v6l4 2" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" /></svg>} label="Glycémie" value="1.45" unit="g/L" trend="up" status="warning" half={true} />
            <MetricCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="#43A047" strokeWidth="2" strokeLinecap="round" /></svg>} label="Poids" value="74.5" unit="kg" trend="down" status="normal" half={false} />
          </div>
        </div>

        {/* Streak */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#D6EFE6", borderRadius: 20, paddingInline: 16, height: 36, alignSelf: "flex-start" }}>
          <span style={{ fontSize: 16 }}>🔥</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1E7D5C" }}>7 jours consécutifs</span>
        </div>

        {/* Accès rapide */}
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>ACCÈS RAPIDE</div>
          <div style={{ display: "flex", gap: 20, justifyContent: "flex-start" }}>
            {[
              { icon: <PenLine size={22} color="#1E7D5C" />, label: "Saisir valeur" },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="8" y="3" width="8" height="18" rx="4" fill="#1E7D5C" /><rect x="3" y="8" width="18" height="8" rx="4" fill="#1E7D5C" opacity="0.4" /></svg>, label: "Médicament" },
              { icon: <Stethoscope size={22} color="#1E7D5C" />, label: "Médecin" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 64, height: 64, background: "#FFFFFF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: 11, color: "#1A2E3B", fontWeight: 500, textAlign: "center" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conseil du Jour */}
        <div style={{ background: "#D6EFE6", borderRadius: 16, padding: 16, borderLeft: "4px solid #1E7D5C", display: "flex", gap: 12 }}>
          <Utensils size={20} color="#1E7D5C" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#1E7D5C", letterSpacing: 0.5 }}>CONSEIL NUTRITION</span>
              <div style={{ padding: "2px 8px", background: "#1E7D5C", borderRadius: 10 }}>
                <span style={{ fontSize: 10, color: "#FFFFFF", fontWeight: 600 }}>Nutrition</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#1A2E3B", lineHeight: 1.5 }}>
              L'akpan est riche en fibres. Idéal pour équilibrer votre glycémie tout au long de la journée.
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <div style={{
        position: "absolute", bottom: 96, right: 24,
        width: 56, height: 56, background: "#1E7D5C", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0px 4px 16px rgba(30,125,92,0.35)",
      }}>
        <Plus size={24} color="#FFFFFF" />
      </div>

      <BottomNav active={0} />
    </div>
  );
}
