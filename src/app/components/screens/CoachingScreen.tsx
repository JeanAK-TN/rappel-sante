import { useEffect, useRef, useState } from "react";
import { Play, Pause, AlertTriangle, CheckCircle, X, Dumbbell } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { BottomNav } from "../BottomNav";
import { useStore } from "../../store/AppStore";
import { useToast } from "../../ui/toast";
import { statusOf, formatValue } from "../../store/health";

type Tab = "nutrition" | "sport" | "prevention";
interface Advice { kind: "alert" | "ok"; text: string; }

const EXERCISES = [
  { name: "Marche rapide", duration: "15 min", intensity: "Légère" },
  { name: "Étirements", duration: "8 min", intensity: "Légère" },
  { name: "Renforcement doux", duration: "7 min", intensity: "Modérée" },
];

export function CoachingScreen() {
  const store = useStore();
  const toast = useToast();
  const { profile } = store.state;
  const [tab, setTab] = useState<Tab>("nutrition");
  const [session, setSession] = useState<string | null>(null);

  const hasDiabete = profile.pathologies.some(p => p.toLowerCase().includes("diab"));
  const hasHypertension = profile.pathologies.some(p => p.toLowerCase().includes("hyper") || p.toLowerCase().includes("tension"));

  const glyc = store.measurementsOf("glycemie").at(-1);
  const tens = store.measurementsOf("tension").at(-1);

  const advices: Advice[] = [];
  if (glyc) {
    const s = statusOf("glycemie", glyc.value);
    if (s === "critical") advices.push({ kind: "alert", text: `Votre glycémie (${formatValue(glyc)} g/L) est élevée. Évitez les sucres rapides et contactez votre médecin si cela persiste.` });
    else if (s === "warning") advices.push({ kind: "alert", text: `Votre glycémie (${formatValue(glyc)} g/L) est légèrement élevée. Privilégiez les aliments à index glycémique bas au prochain repas.` });
    else advices.push({ kind: "ok", text: `Votre glycémie (${formatValue(glyc)} g/L) est dans la cible. Continuez ainsi !` });
  }
  if (tens) {
    const s = statusOf("tension", tens.value);
    if (s !== "normal") advices.push({ kind: "alert", text: `Votre tension (${formatValue(tens)} mmHg) est au-dessus de la normale. Réduisez le sel et reposez-vous.` });
    else advices.push({ kind: "ok", text: `Votre tension (${formatValue(tens)} mmHg) est stable. Continuez vos bonnes habitudes !` });
  }
  if (advices.length === 0) advices.push({ kind: "ok", text: "Saisissez vos mesures pour recevoir des conseils personnalisés." });

  const recipes = hasDiabete
    ? [
        { name: "Bouillie de mil", tag: "Diabète adapté", cal: "280 kcal", color: "#E8F5E9" },
        { name: "Sauté de légumes", tag: "Index glycémique bas", cal: "190 kcal", color: "#E3F2FD" },
      ]
    : [
        { name: "Poisson grillé", tag: "Pauvre en sel", cal: "240 kcal", color: "#E8F5E9" },
        { name: "Légumes vapeur", tag: "Riche en potassium", cal: "150 kcal", color: "#E3F2FD" },
      ];

  const tips: { title: string; body: string; tag: string }[] = [];
  if (hasDiabete) tips.push({ title: "Limitez le riz blanc", body: "Remplacez par du riz brun ou du mil pour réduire l'index glycémique.", tag: "Diabète" });
  if (hasHypertension) tips.push({ title: "Réduisez le sel", body: "Limitez le sel ajouté et les bouillons industriels pour protéger votre tension.", tag: "Hypertension" });
  tips.push({ title: "Hydratation", body: "Buvez au moins 1,5 L d'eau par jour. Évitez les sodas et jus sucrés.", tag: "Prévention" });

  const sectionTitle: React.CSSProperties = { fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" };

  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "#FFFFFF" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 0" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Mon Coaching</div>
        </div>
        <div style={{ display: "flex", paddingInline: 20, marginTop: 16, borderBottom: "1px solid #F4F6F7" }}>
          {([["nutrition", "Nutrition"], ["sport", "Sport"], ["prevention", "Prévention"]] as [Tab, string][]).map(([key, label]) => {
            const on = tab === key;
            return (
              <button key={key} onClick={() => setTab(key)} style={{
                paddingInline: 14, paddingBlock: 12, background: "none", cursor: "pointer", border: "none",
                borderBottom: on ? "2px solid #1E7D5C" : "2px solid transparent",
                fontSize: 14, fontWeight: on ? 600 : 400, color: on ? "#1E7D5C" : "#607D8B",
              }}>{label}</button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px", display: "flex", flexDirection: "column", gap: 16 }}>
        {tab === "nutrition" && (<>
          <div style={sectionTitle}>VOTRE PLAN DU JOUR</div>
          <div style={{ display: "flex", gap: 12 }}>
            {recipes.map((recipe, i) => (
              <div key={i} style={{ flex: 1, background: "#FFFFFF", borderRadius: 16, overflow: "hidden", boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
                <div style={{ height: 90, background: recipe.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 2 4 6 4 11c0 4 2.5 7.5 6 9v2h4v-2c3.5-1.5 6-5 6-9 0-5-4-9-8-9z" fill="#1E7D5C" opacity="0.3" stroke="#1E7D5C" strokeWidth="1.5" /></svg>
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1A2E3B" }}>{recipe.name}</div>
                  <div style={{ padding: "2px 8px", background: "#D6EFE6", borderRadius: 10, display: "inline-block", marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: "#1E7D5C", fontWeight: 600 }}>{recipe.tag}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#607D8B", marginTop: 6 }}>{recipe.cal}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={sectionTitle}>CONSEILS ALIMENTAIRES</div>
          {tips.map((tip, i) => (
            <div key={i} style={{ background: "#D6EFE6", borderRadius: 16, padding: 16, borderLeft: "4px solid #1E7D5C" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1A2E3B" }}>{tip.title}</span>
                <div style={{ padding: "2px 8px", background: "#1E7D5C", borderRadius: 10, marginLeft: "auto" }}>
                  <span style={{ fontSize: 10, color: "#FFFFFF", fontWeight: 600 }}>{tip.tag}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#607D8B", lineHeight: 1.5 }}>{tip.body}</div>
            </div>
          ))}
        </>)}

        {tab === "sport" && (<>
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1A2E3B" }}>Programme du jour</div>
                <div style={{ fontSize: 13, color: "#607D8B" }}>30 min · Intensité légère</div>
              </div>
              <div style={{ padding: "6px 14px", background: "#D6EFE6", borderRadius: 20 }}>
                <span style={{ fontSize: 12, color: "#1E7D5C", fontWeight: 600 }}>Adapté</span>
              </div>
            </div>
            <button
              onClick={() => setSession("Programme du jour")}
              style={{ width: "100%", height: 44, background: "#1E7D5C", border: "none", borderRadius: 10, color: "#FFFFFF", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}
            >
              <Play size={16} color="#FFFFFF" /> Commencer la séance
            </button>
          </div>
          <div style={sectionTitle}>EXERCICES</div>
          {EXERCISES.map((ex, i) => (
            <div key={i} style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, background: "#D6EFE6", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Dumbbell size={20} color="#1E7D5C" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1A2E3B" }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: "#607D8B" }}>{ex.duration}</div>
              </div>
              <div style={{ padding: "4px 12px", background: "#F4F6F7", borderRadius: 20 }}>
                <span style={{ fontSize: 11, color: "#607D8B", fontWeight: 600 }}>{ex.intensity}</span>
              </div>
              <button onClick={() => setSession(ex.name)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <Play size={18} color="#1E7D5C" />
              </button>
            </div>
          ))}
        </>)}

        {tab === "prevention" && (<>
          <div style={sectionTitle}>ALERTES & CONSEILS</div>
          {advices.map((a, i) => (
            <div key={i} style={{ background: a.kind === "alert" ? "#FFF3E0" : "#E8F5E9", borderRadius: 16, padding: 16, display: "flex", gap: 12 }}>
              {a.kind === "alert"
                ? <AlertTriangle size={20} color="#FF9800" style={{ flexShrink: 0 }} />
                : <CheckCircle size={20} color="#43A047" style={{ flexShrink: 0 }} />}
              <div style={{ fontSize: 13, color: "#1A2E3B", lineHeight: 1.5 }}>{a.text}</div>
            </div>
          ))}
          <div style={sectionTitle}>RAPPELS SANTÉ DU MOIS</div>
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1A2E3B", marginBottom: 4 }}>Contrôle de tension</div>
            <div style={{ fontSize: 13, color: "#607D8B", lineHeight: 1.5 }}>Pensez à mesurer votre tension au moins une fois par semaine, au calme.</div>
          </div>
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1A2E3B", marginBottom: 4 }}>Activité physique</div>
            <div style={{ fontSize: 13, color: "#607D8B", lineHeight: 1.5 }}>30 minutes de marche par jour aident à réguler la glycémie et la tension.</div>
          </div>
        </>)}
      </div>

      <BottomNav active={3} />

      {session && <SessionOverlay name={session} onClose={() => setSession(null)} onFinish={() => { setSession(null); toast.show("Séance terminée, bravo 💪"); }} />}
    </div>
  );
}

function SessionOverlay({ name, onClose, onFinish }: { name: string; onClose: () => void; onFinish: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      timer.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 30 }}>
      <div style={{ background: "#FFFFFF", borderRadius: 20, padding: 24, width: "100%", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A2E3B" }}>{name}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} color="#607D8B" /></button>
        </div>
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#D6EFE6", display: "flex", alignItems: "center", justifyContent: "center", margin: "8px auto 16px" }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: "#1E7D5C" }}>{mm}:{ss}</span>
        </div>
        <div style={{ fontSize: 13, color: "#607D8B", marginBottom: 20 }}>{running ? "Séance en cours…" : "En pause"}</div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setRunning(r => !r)} style={{ flex: 1, height: 48, background: "transparent", border: "2px solid #1E7D5C", borderRadius: 12, color: "#1E7D5C", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {running ? <><Pause size={16} color="#1E7D5C" /> Pause</> : <><Play size={16} color="#1E7D5C" /> Reprendre</>}
          </button>
          <button onClick={onFinish} style={{ flex: 1, height: 48, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
}
