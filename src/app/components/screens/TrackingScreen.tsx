import { Download, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart } from "recharts";
import { StatusBar } from "../StatusBar";
import { BottomNav } from "../BottomNav";

const data = [
  { day: "L", val: 1.38 }, { day: "M", val: 1.22 }, { day: "Me", val: 1.55 },
  { day: "J", val: 1.45 }, { day: "V", val: 1.72 }, { day: "S", val: 1.30 }, { day: "D", val: 1.45 },
];

const entries = [
  { date: "Aujourd'hui, 07:30", label: "À jeun", value: "1.45 g/L", color: "#FF9800" },
  { date: "Hier, 20:00", label: "Après repas", value: "1.72 g/L", color: "#E53935" },
  { date: "Hier, 07:30", label: "À jeun", value: "1.22 g/L", color: "#43A047" },
];

export function TrackingScreen() {
  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "#FFFFFF" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Mon Suivi</div>
          <Download size={22} color="#607D8B" />
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", paddingInline: 20, marginTop: 16, borderBottom: "1px solid #F4F6F7" }}>
          {["Glycémie", "Tension", "Poids"].map((tab, i) => (
            <div key={tab} style={{
              paddingInline: 16, paddingBlock: 12,
              borderBottom: i === 0 ? "2px solid #1E7D5C" : "2px solid transparent",
              fontSize: 14, fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? "#1E7D5C" : "#607D8B",
            }}>{tab}</div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Value display */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 20, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: "#FF9800" }}>1.45</span>
            <span style={{ fontSize: 18, color: "#607D8B" }}>g/L</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M7 2L3 6M7 2l4 4" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" /></svg>
            <span style={{ fontSize: 12, color: "#FF9800" }}>+0.12 vs hier</span>
          </div>
          {/* Period selector */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {["7J", "30J", "3M"].map((p, i) => (
              <div key={p} style={{
                paddingInline: 14, height: 30, borderRadius: 20, display: "flex", alignItems: "center",
                background: i === 0 ? "#1E7D5C" : "#F4F6F7",
                color: i === 0 ? "#FFFFFF" : "#607D8B", fontSize: 13, fontWeight: 500,
              }}>{p}</div>
            ))}
          </div>
          {/* Chart */}
          <div style={{ marginTop: 16, height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="glycGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9800" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF9800" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F6F7" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#607D8B" }} axisLine={false} tickLine={false} />
                <YAxis domain={[1.0, 1.9]} tick={{ fontSize: 10, fill: "#607D8B" }} axisLine={false} tickLine={false} />
                <ReferenceLine y={1.6} stroke="#E53935" strokeDasharray="3 3" strokeWidth={1} />
                <ReferenceLine y={1.1} stroke="#43A047" strokeDasharray="3 3" strokeWidth={1} />
                <Area type="monotone" dataKey="val" stroke="#FF9800" strokeWidth={2} fill="url(#glycGrad)" dot={{ r: 3, fill: "#FF9800" }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", marginTop: 12, gap: 0 }}>
            {[["Min", "1.10", "#43A047"], ["Moy", "1.38", "#FF9800"], ["Max", "1.72", "#E53935"]].map(([label, val, color]) => (
              <div key={label} style={{ flex: 1, textAlign: "center", borderRight: label !== "Max" ? "1px solid #F4F6F7" : "none" }}>
                <div style={{ fontSize: 11, color: "#607D8B" }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: color as string, marginTop: 4 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières mesures */}
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>DERNIÈRES MESURES</div>
          {entries.map((e, i) => (
            <div key={i} style={{ background: "#FFFFFF", borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0px 2px 8px rgba(0,0,0,0.06)" }}>
              <div>
                <div style={{ fontSize: 13, color: "#607D8B" }}>{e.date}</div>
                <div style={{ fontSize: 12, color: "#B2CEBF", marginTop: 2 }}>{e.label}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: e.color }}>{e.value}</span>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} />
              </div>
            </div>
          ))}
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

      <BottomNav active={2} />
    </div>
  );
}

// New Entry Modal
export function NewEntryModal() {
  return (
    <div style={{ width: 390, height: 844, background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ background: "#FFFFFF", borderRadius: "24px 24px 0 0", padding: "0 0 40px" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
        </div>
        <div style={{ padding: "8px 20px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A2E3B", marginBottom: 24 }}>Saisir une glycémie</div>
          {/* Number input */}
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12 }}>
              <span style={{ fontSize: 64, fontWeight: 700, color: "#1A2E3B" }}>1.45</span>
              <span style={{ fontSize: 22, color: "#607D8B" }}>g/L</span>
            </div>
          </div>
          {/* Slider */}
          <div style={{ marginTop: 8 }}>
            <div style={{ position: "relative", height: 8, background: "linear-gradient(to right, #43A047 0%, #43A047 30%, #FF9800 30%, #FF9800 65%, #E53935 65%, #E53935 100%)", borderRadius: 4 }}>
              <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 22, height: 22, background: "#FFFFFF", borderRadius: "50%", border: "3px solid #1E7D5C", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: "#607D8B" }}>0.5 g/L</span>
              <span style={{ fontSize: 11, color: "#607D8B" }}>3.0 g/L</span>
            </div>
          </div>
          {/* Context */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 500, marginBottom: 10 }}>Contexte</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["À jeun", "Après repas", "Autre"].map((c, i) => (
                <div key={c} style={{ padding: "6px 14px", borderRadius: 20, background: i === 0 ? "#1E7D5C" : "#F4F6F7", color: i === 0 ? "#FFFFFF" : "#607D8B", fontSize: 13, fontWeight: i === 0 ? 600 : 400 }}>{c}</div>
              ))}
            </div>
          </div>
          {/* Date */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", background: "#F4F6F7", borderRadius: 12 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="#607D8B" strokeWidth="1.5" /><path d="M5 1v2M11 1v2M2 7h12" stroke="#607D8B" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span style={{ fontSize: 14, color: "#1A2E3B" }}>Maintenant · Lun 19 mai, 07:34</span>
          </div>
          <button style={{ width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, marginTop: 24 }}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
