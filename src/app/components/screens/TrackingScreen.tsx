import { useState } from "react";
import { Download, Plus, X, AlertTriangle, Phone } from "lucide-react";
import { CartesianGrid, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Area, AreaChart } from "recharts";
import { StatusBar } from "../StatusBar";
import { BottomNav } from "../BottomNav";
import { useStore } from "../../store/AppStore";
import { MEASURE_META, STATUS_COLOR, statusOf, isCritical, formatValue, relativeLabel, minAvgMax } from "../../store/health";
import type { MeasureType, Measurement } from "../../store/types";

const TABS: { type: MeasureType; label: string }[] = [
  { type: "glycemie", label: "Glycémie" },
  { type: "tension", label: "Tension" },
  { type: "poids", label: "Poids" },
];

const PERIODS: { label: string; days: number }[] = [
  { label: "7J", days: 7 },
  { label: "30J", days: 30 },
  { label: "3M", days: 90 },
];

const DAY = 86400000;

export function TrackingScreen() {
  const store = useStore();
  const [type, setType] = useState<MeasureType>("glycemie");
  const [periodIdx, setPeriodIdx] = useState(0);
  const [entryOpen, setEntryOpen] = useState(false);
  const [critical, setCritical] = useState<Measurement | null>(null);

  const meta = MEASURE_META[type];
  const accent = type === "glycemie" ? "#FF9800" : type === "tension" ? "#2196F3" : "#43A047";

  const all = store.measurementsOf(type); // trié par date croissante
  const cutoff = Date.now() - PERIODS[periodIdx].days * DAY;
  const series = all.filter(m => m.at >= cutoff);

  const latest = all[all.length - 1];
  const previous = all[all.length - 2];
  const latestStatus = latest ? statusOf(type, latest.value) : "normal";
  const diff = latest && previous ? latest.value - previous.value : null;

  const chartData = series.map(m => ({
    label: new Date(m.at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    val: m.value,
  }));
  const stats = minAvgMax(series.map(m => m.value));

  function onSaved(m: Measurement) {
    setEntryOpen(false);
    if (isCritical(m.type, m.value)) setCritical(m);
  }

  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "#FFFFFF" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Mon Suivi</div>
          <Download size={22} color="#607D8B" />
        </div>
        <div style={{ display: "flex", paddingInline: 20, marginTop: 16, borderBottom: "1px solid #F4F6F7" }}>
          {TABS.map(tab => {
            const on = tab.type === type;
            return (
              <button
                key={tab.type}
                onClick={() => setType(tab.type)}
                style={{
                  paddingInline: 16, paddingBlock: 12, background: "none", cursor: "pointer",
                  border: "none", borderBottom: on ? "2px solid #1E7D5C" : "2px solid transparent",
                  fontSize: 14, fontWeight: on ? 600 : 400, color: on ? "#1E7D5C" : "#607D8B",
                }}
              >{tab.label}</button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 20, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
          {latest ? (
            <>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: STATUS_COLOR[latestStatus] }}>{formatValue(latest)}</span>
                <span style={{ fontSize: 18, color: "#607D8B" }}>{meta.unit}</span>
              </div>
              {diff !== null && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: diff > 0 ? "#FF9800" : diff < 0 ? "#43A047" : "#607D8B" }}>
                    {diff > 0 ? "↑ +" : diff < 0 ? "↓ " : ""}{diff !== 0 ? Math.abs(diff).toFixed(type === "glycemie" ? 2 : 1) : "stable"} {diff !== 0 ? "vs précédent" : ""}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div style={{ fontSize: 14, color: "#607D8B" }}>Aucune mesure. Appuyez sur + pour commencer.</div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {PERIODS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setPeriodIdx(i)}
                style={{
                  paddingInline: 14, height: 30, borderRadius: 20, border: "none", cursor: "pointer",
                  background: i === periodIdx ? "#1E7D5C" : "#F4F6F7",
                  color: i === periodIdx ? "#FFFFFF" : "#607D8B", fontSize: 13, fontWeight: 500,
                }}
              >{p.label}</button>
            ))}
          </div>

          <div style={{ marginTop: 16, height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accent} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F6F7" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#607D8B" }} axisLine={false} tickLine={false} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fill: "#607D8B" }} axisLine={false} tickLine={false} />
                {type === "glycemie" && <ReferenceLine y={1.6} stroke="#E53935" strokeDasharray="3 3" strokeWidth={1} />}
                {type === "glycemie" && <ReferenceLine y={1.1} stroke="#43A047" strokeDasharray="3 3" strokeWidth={1} />}
                {type === "tension" && <ReferenceLine y={130} stroke="#FF9800" strokeDasharray="3 3" strokeWidth={1} />}
                <Area type="monotone" dataKey="val" stroke={accent} strokeWidth={2} fill="url(#grad)" dot={{ r: 3, fill: accent }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "flex", marginTop: 12 }}>
            {[["Min", stats.min, "#43A047"], ["Moy", stats.avg, "#FF9800"], ["Max", stats.max, "#E53935"]].map(([label, val, color], i) => (
              <div key={label as string} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid #F4F6F7" : "none" }}>
                <div style={{ fontSize: 11, color: "#607D8B" }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: color as string, marginTop: 4 }}>
                  {series.length ? (val as number).toFixed(type === "glycemie" ? 2 : 1) : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>DERNIÈRES MESURES</div>
          {[...all].reverse().slice(0, 6).map(m => {
            const c = STATUS_COLOR[statusOf(type, m.value)];
            return (
              <div key={m.id} style={{ background: "#FFFFFF", borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0px 2px 8px rgba(0,0,0,0.06)" }}>
                <div>
                  <div style={{ fontSize: 13, color: "#607D8B" }}>{relativeLabel(m.at)}</div>
                  {m.context && <div style={{ fontSize: 12, color: "#B2CEBF", marginTop: 2 }}>{m.context}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: c }}>{formatValue(m)} {meta.unit}</span>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                </div>
              </div>
            );
          })}
          {all.length === 0 && <div style={{ fontSize: 13, color: "#B2CEBF" }}>Aucune mesure enregistrée.</div>}
        </div>
      </div>

      <button
        onClick={() => setEntryOpen(true)}
        style={{
          position: "absolute", bottom: 96, right: 24, border: "none", cursor: "pointer",
          width: 56, height: 56, background: "#1E7D5C", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0px 4px 16px rgba(30,125,92,0.35)",
        }}
      >
        <Plus size={24} color="#FFFFFF" />
      </button>

      <BottomNav active={2} />

      {entryOpen && <NewEntrySheet type={type} onClose={() => setEntryOpen(false)} onSaved={onSaved} />}
      {critical && <CriticalAlert m={critical} onClose={() => setCritical(null)} />}
    </div>
  );
}

const CONTEXTS = ["À jeun", "Après repas", "Autre"];

function NewEntrySheet({ type, onClose, onSaved }: { type: MeasureType; onClose: () => void; onSaved: (m: Measurement) => void }) {
  const store = useStore();
  const meta = MEASURE_META[type];
  const [value, setValue] = useState(type === "glycemie" ? "1.20" : type === "tension" ? "120" : "74.0");
  const [diastolic, setDiastolic] = useState("80");
  const [context, setContext] = useState(CONTEXTS[0]);

  const num = parseFloat(value.replace(",", "."));
  const valid = !isNaN(num) && num > 0;

  function submit() {
    if (!valid) return;
    const m = store.addMeasurement({
      type,
      value: num,
      diastolic: type === "tension" ? parseInt(diastolic, 10) || undefined : undefined,
      context: type === "glycemie" ? context : undefined,
      at: Date.now(),
    });
    onSaved(m);
  }

  const bigInput: React.CSSProperties = {
    fontSize: 56, fontWeight: 700, color: "#1A2E3B", textAlign: "center",
    border: "none", outline: "none", width: type === "tension" ? 110 : 180, background: "transparent",
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1A2E3B" }}>Saisir une {meta.label.toLowerCase()}</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} color="#607D8B" /></button>
      </div>

      <div style={{ textAlign: "center", padding: "16px 0", display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
        <input style={bigInput} value={value} onChange={e => setValue(e.target.value)} inputMode="decimal" autoFocus />
        {type === "tension" && (
          <>
            <span style={{ fontSize: 40, fontWeight: 700, color: "#B2CEBF" }}>/</span>
            <input style={{ ...bigInput, width: 110 }} value={diastolic} onChange={e => setDiastolic(e.target.value)} inputMode="decimal" />
          </>
        )}
        <span style={{ fontSize: 22, color: "#607D8B" }}>{meta.unit}</span>
      </div>

      {type === "glycemie" && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 500, marginBottom: 10 }}>Contexte</div>
          <div style={{ display: "flex", gap: 8 }}>
            {CONTEXTS.map(c => {
              const on = c === context;
              return (
                <button key={c} onClick={() => setContext(c)} style={{
                  padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: on ? "#1E7D5C" : "#F4F6F7", color: on ? "#FFFFFF" : "#607D8B",
                  fontSize: 13, fontWeight: on ? 600 : 400,
                }}>{c}</button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", background: "#F4F6F7", borderRadius: 12 }}>
        <span style={{ fontSize: 14, color: "#1A2E3B" }}>Maintenant · {new Date().toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}, {String(new Date().getHours()).padStart(2, "0")}:{String(new Date().getMinutes()).padStart(2, "0")}</span>
      </div>

      <button
        onClick={submit}
        disabled={!valid}
        style={{ width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, marginTop: 20, cursor: valid ? "pointer" : "not-allowed", opacity: valid ? 1 : 0.4 }}
      >
        Enregistrer
      </button>
    </Overlay>
  );
}

function CriticalAlert({ m, onClose }: { m: Measurement; onClose: () => void }) {
  const meta = MEASURE_META[m.type];
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 20 }}>
      <div style={{ background: "#FFFFFF", borderRadius: 20, overflow: "hidden", width: "100%" }}>
        <div style={{ background: "#E53935", padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={28} color="#FFFFFF" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>Valeur inhabituelle détectée</div>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 14, color: "#607D8B", lineHeight: 1.6, textAlign: "center", marginBottom: 20 }}>
            Votre {meta.label.toLowerCase()} de <span style={{ color: "#E53935", fontWeight: 700 }}>{formatValue(m)} {meta.unit}</span> dépasse le seuil critique ({meta.criticalHigh} {meta.unit}).
            <br /><br />
            Nous recommandons de contacter votre médecin rapidement.
          </div>
          <div style={{ background: "#FFEBEE", borderRadius: 12, padding: "12px 16px", textAlign: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: "#E53935" }}>{formatValue(m)}</span>
            <span style={{ fontSize: 16, color: "#E53935" }}> {meta.unit}</span>
            <div style={{ fontSize: 12, color: "#607D8B", marginTop: 4 }}>Seuil critique : {meta.criticalHigh} {meta.unit}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button style={{ width: "100%", height: 52, background: "#E53935", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
              <Phone size={18} color="#FFFFFF" />
              Contacter mon médecin
            </button>
            <button onClick={onClose} style={{ width: "100%", height: 52, background: "transparent", border: "2px solid #E53935", borderRadius: 12, color: "#E53935", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              Compris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
export function NewEntryModal() {
  return (
    <div style={{ width: 390, height: 844, background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ background: "#FFFFFF", borderRadius: "24px 24px 0 0", padding: "0 0 40px" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
        </div>
        <div style={{ padding: "8px 20px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A2E3B", marginBottom: 24 }}>Saisir une glycémie</div>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12 }}>
              <span style={{ fontSize: 64, fontWeight: 700, color: "#1A2E3B" }}>1.45</span>
              <span style={{ fontSize: 22, color: "#607D8B" }}>g/L</span>
            </div>
          </div>
          <button style={{ width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, marginTop: 24 }}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
