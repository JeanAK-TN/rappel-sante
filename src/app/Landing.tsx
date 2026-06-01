import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Pill, Activity, BellRing, Salad, Stethoscope, WifiOff, Languages, Smartphone, ShieldCheck, ArrowRight, HeartPulse } from "lucide-react";
import { ScreenFrame } from "./components/ScreenFrame";
import { DashboardScreen } from "./components/screens/DashboardScreen";
import { MedicationsScreen } from "./components/screens/MedicationsScreen";
import { TrackingScreen } from "./components/screens/TrackingScreen";

// Palette de marque
const C = {
  primary: "#1E7D5C",
  primaryDark: "#145C40",
  light: "#D6EFE6",
  blue: "#2196F3",
  orange: "#FF9800",
  red: "#E53935",
  ink: "#1A2E3B",
  sub: "#607D8B",
  bg: "#F4F6F7",
};

const FONT = "'Inter', system-ui, sans-serif";

// Apparition au défilement
function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ ...style, opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(28px)", transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.2,.7,.2,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

// Compteur animé (format français)
function Counter({ to, decimals = 0, prefix = "", suffix = "", duration = 1700 }: { to: number; decimals?: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(to * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{prefix}{val.toFixed(decimals).replace(".", ",")}{suffix}</span>;
}

// Tracé ECG répété sur la largeur
function ecgPath(width: number, mid: number): string {
  let d = `M0,${mid}`;
  let x = 0;
  const unit = 150;
  while (x < width) {
    d += ` L${x + 45},${mid} L${x + 58},${mid} L${x + 64},${mid - 7} L${x + 72},${mid + 9} L${x + 82},${mid - 32} L${x + 92},${mid + 20} L${x + 100},${mid} L${x + 125},${mid} L${x + unit},${mid}`;
    x += unit;
  }
  return d;
}

const features = [
  { icon: Pill, color: C.primary, title: "Rappels de médicaments", desc: "Des notifications intelligentes adaptées à vos horaires et dosages. Fini les oublis." },
  { icon: Activity, color: C.blue, title: "Suivi de santé", desc: "Glycémie, tension, poids : enregistrez et visualisez l'évolution en un coup d'œil." },
  { icon: BellRing, color: C.orange, title: "Alertes préventives", desc: "Une valeur anormale ? L'application vous alerte avant que la situation ne s'aggrave." },
  { icon: Salad, color: C.primary, title: "Coaching nutrition & sport", desc: "Des conseils adaptés à votre pathologie et à la cuisine locale togolaise." },
  { icon: Stethoscope, color: C.blue, title: "Connexion médecin", desc: "Partagez vos données en toute sécurité avec votre médecin pour un suivi à distance." },
];

const local = [
  { icon: Smartphone, title: "Smartphones d'entrée de gamme", desc: "Optimisée pour les appareils Android économiques." },
  { icon: WifiOff, title: "Mode hors-ligne", desc: "Fonctionne même sans connexion, avec synchronisation différée." },
  { icon: Languages, title: "Langues locales", desc: "Disponible en français, puis en Éwé et Kabiyè." },
  { icon: ShieldCheck, title: "Données protégées", desc: "Conforme à la loi togolaise sur les données de santé." },
];

const team = [
  "M'BOUEKE Kevin", "ZATO Alim", "COMBEY Clétus", "ADJAYI Rosalie", "GNAKADE Cyrus",
  "GAGOU David", "KODIO Jean", "AWANYA Gracia", "AMEGNAGLO Scyana", "LAYIBO Belinda",
];

function initials(name: string) {
  const parts = name.replace("'", " ").split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function Logo({ size = 40, ring = "rgba(255,255,255,0.18)" }: { size?: number; ring?: string }) {
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: size * 0.32, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 60 60" fill="none">
          <path d="M30 8C30 8 14 18 14 32C14 40.8 21.2 48 30 48C38.8 48 46 40.8 46 32C46 18 30 8 30 8Z" fill="white" opacity="0.95" />
          <path d="M24 32H36M30 26V38" stroke={C.primary} strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <span style={{ position: "absolute", inset: -6, borderRadius: 16, border: `2px solid ${ring}` }} />
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const goto = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: FONT, background: "#FFFFFF", color: C.ink, overflowX: "hidden" }}>
      <style>{KEYFRAMES}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(10px)", background: "rgba(255,255,255,0.8)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <Logo size={36} ring="rgba(30,125,92,0.25)" />
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>Rappel Santé</span>
          <div className="rs-navlinks" style={{ marginLeft: "auto", display: "flex", gap: 26, alignItems: "center" }}>
            {[["Le défi", "probleme"], ["Fonctionnalités", "features"], ["L'app", "apercu"], ["Équipe", "equipe"]].map(([label, id]) => (
              <button key={id} onClick={() => goto(id)} style={navLink}>{label}</button>
            ))}
          </div>
          <button onClick={() => navigate("/welcome")} style={{ ...btnPrimary, padding: "10px 18px", marginLeft: 8 }}>
            Essayer la démo
          </button>
        </div>
      </nav>

      {/* HERO */}
      <header style={{ position: "relative", background: `linear-gradient(135deg, ${C.primaryDark} 0%, ${C.primary} 55%, #2a9b73 100%)`, color: "#FFFFFF", overflow: "hidden" }}>
        {/* nœuds numériques flottants */}
        {[
          { t: "12%", l: "8%", s: 10, d: 0 }, { t: "70%", l: "14%", s: 6, d: 1.2 }, { t: "30%", l: "88%", s: 8, d: 0.6 },
          { t: "78%", l: "82%", s: 12, d: 1.8 }, { t: "20%", l: "60%", s: 5, d: 0.9 }, { t: "85%", l: "45%", s: 7, d: 2.2 },
        ].map((p, i) => (
          <span key={i} style={{ position: "absolute", top: p.t, left: p.l, width: p.s, height: p.s, borderRadius: "50%", background: "rgba(255,255,255,0.35)", animation: `rs-float 6s ease-in-out ${p.d}s infinite`, boxShadow: "0 0 12px rgba(255,255,255,0.4)" }} />
        ))}

        {/* ligne ECG animée */}
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: 120, opacity: 0.9 }}>
          <path d={ecgPath(1200, 60)} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
          <path d={ecgPath(1200, 60)} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9))", strokeDasharray: "80 4000", animation: "rs-ecg 3.2s linear infinite" }} />
        </svg>

        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "84px 24px 150px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <span style={{ padding: "6px 14px", borderRadius: 999, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", fontSize: 13, fontWeight: 600 }}>
              🇹🇬 Santé numérique · Togo
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, margin: 0, maxWidth: 780 }}>
            Votre santé,<br />enfin <span style={{ position: "relative", whiteSpace: "nowrap" }}>simplifiée.
              <span style={{ position: "absolute", left: 0, right: 0, bottom: 6, height: 10, background: "rgba(255,255,255,0.25)", borderRadius: 6, zIndex: -1 }} />
            </span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.2vw, 20px)", lineHeight: 1.6, opacity: 0.92, maxWidth: 620, marginTop: 22 }}>
            L'assistant médical personnel qui aide les Togolais atteints de maladies chroniques à
            ne plus oublier leurs traitements, suivre leur santé et être alertés à temps.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 34 }}>
            <button onClick={() => navigate("/welcome")} style={{ ...btnLight, display: "inline-flex", alignItems: "center", gap: 10 }}>
              Essayer la démo <ArrowRight size={18} />
            </button>
            <button onClick={() => goto("features")} style={btnGhost}>Découvrir les fonctionnalités</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 28, fontSize: 14, opacity: 0.85 }}>
            <HeartPulse size={18} /> Conçue pour les smartphones d'entrée de gamme · fonctionne hors-ligne
          </div>
        </div>
      </header>

      {/* STATS */}
      <section style={{ background: C.bg }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {[
            { v: <Counter to={1.4} decimals={1} suffix=" M" />, label: "Togolais hypertendus", color: C.primary },
            { v: <Counter to={88.5} decimals={1} prefix="+" suffix=" %" />, label: "de diabète depuis 2010", color: C.orange },
            { v: <Counter to={8.6} decimals={1} suffix=" M" />, label: "d'abonnés mobiles", color: C.blue },
            { v: <Counter to={90} suffix=" %" />, label: "n'ont jamais testé leur glycémie", color: C.red },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div style={{ background: "#FFFFFF", borderRadius: 18, padding: "26px 22px", boxShadow: "0 4px 24px rgba(0,0,0,0.05)", textAlign: "center" }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: s.color, letterSpacing: -1 }}>{s.v}</div>
                <div style={{ fontSize: 14, color: C.sub, marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROBLÈME */}
      <section id="probleme" style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px" }}>
        <Reveal>
          <SectionLabel>Le défi</SectionLabel>
          <h2 style={h2}>Une urgence sanitaire silencieuse</h2>
          <p style={{ ...lead, maxWidth: 760 }}>
            Le Togo vit une transition épidémiologique majeure : les maladies chroniques explosent,
            mais le sous-diagnostic et la mauvaise observance des traitements provoquent complications,
            hospitalisations évitables et décès prématurés.
          </p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginTop: 36 }}>
          {[
            { t: "Oublis de médicaments", d: "Sans rappel, les prises quotidiennes sont irrégulières.", c: C.orange },
            { t: "Suivi inexistant", d: "Tension et glycémie rarement mesurées et notées.", c: C.red },
            { t: "Manque d'accompagnement", d: "Peu de conseils adaptés au quotidien des patients.", c: C.blue },
          ].map((b, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)", borderLeft: `4px solid ${b.c}`, borderRadius: 16, padding: 22, height: "100%" }}>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{b.t}</div>
                <div style={{ color: C.sub, fontSize: 14, lineHeight: 1.6 }}>{b.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section id="features" style={{ background: C.bg }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px" }}>
          <Reveal>
            <SectionLabel>La solution</SectionLabel>
            <h2 style={h2}>Tout ce qu'il faut pour bien se soigner</h2>
            <p style={{ ...lead, maxWidth: 700 }}>Cinq piliers réunis dans une seule application simple et rassurante.</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginTop: 40 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 80}>
                  <div className="rs-card" style={{ background: "#FFFFFF", borderRadius: 20, padding: 26, boxShadow: "0 4px 24px rgba(0,0,0,0.05)", height: "100%", transition: "transform .25s ease, box-shadow .25s ease" }}>
                    <div style={{ width: 54, height: 54, borderRadius: 16, background: `${f.color}1A`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                      <Icon size={26} color={f.color} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{f.title}</div>
                    <div style={{ color: C.sub, fontSize: 14.5, lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                </Reveal>
              );
            })}
            <Reveal delay={features.length * 80}>
              <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, borderRadius: 20, padding: 26, color: "#FFFFFF", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Et bien plus encore</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.6, opacity: 0.92, marginBottom: 18 }}>Streak de régularité, historique, profil de santé personnalisé…</div>
                <button onClick={() => navigate("/welcome")} style={{ ...btnLight, alignSelf: "flex-start", padding: "10px 18px" }}>Tester maintenant</button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* APERÇU APP */}
      <section id="apercu" style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px" }}>
        <Reveal>
          <SectionLabel>L'application</SectionLabel>
          <h2 style={h2}>Simple, claire, rassurante</h2>
          <p style={{ ...lead, maxWidth: 700 }}>Voici quelques écrans de la maquette fonctionnelle, en conditions réelles.</p>
        </Reveal>
        <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap", marginTop: 44 }}>
          {[
            { node: <DashboardScreen />, label: "Accueil", d: 0 },
            { node: <MedicationsScreen />, label: "Médicaments", d: 150 },
            { node: <TrackingScreen />, label: "Suivi", d: 300 },
          ].map((s, i) => (
            <Reveal key={i} delay={s.d}>
              <div style={{ animation: `rs-floaty 5s ease-in-out ${i * 0.5}s infinite` }}>
                <ScreenFrame label={s.label} scale={0.52}>{s.node}</ScreenFrame>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ANCRAGE LOCAL */}
      <section style={{ background: C.primaryDark, color: "#FFFFFF" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px" }}>
          <Reveal>
            <SectionLabel light>Pensée pour le Togo</SectionLabel>
            <h2 style={{ ...h2, color: "#FFFFFF" }}>Un ancrage local profond</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20, marginTop: 36 }}>
            {local.map((l, i) => {
              const Icon = l.icon;
              return (
                <Reveal key={i} delay={i * 90}>
                  <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 18, padding: 24, height: "100%" }}>
                    <Icon size={28} color={C.light} />
                    <div style={{ fontWeight: 700, fontSize: 17, margin: "14px 0 8px" }}>{l.title}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>{l.desc}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      <section id="equipe" style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px" }}>
        <Reveal>
          <SectionLabel>L'équipe</SectionLabel>
          <h2 style={h2}>Groupe 20 · Projet Intégrateur 2026</h2>
          <p style={{ ...lead, maxWidth: 700 }}>Dix étudiants réunis autour d'un projet à fort impact social.</p>
        </Reveal>
        <Reveal style={{ marginTop: 36 }}>
          <div className="rs-marquee" style={{ position: "relative", overflow: "hidden", paddingBlock: 8 }}>
            <div className="rs-track" style={{ display: "flex", gap: 18, width: "max-content" }}>
              {[...team, ...team].map((name, i) => {
                const colors = [C.primary, C.blue, "#43A047", "#7E57C2", "#FF7043"];
                const c = colors[i % colors.length];
                return (
                  <div key={i} className="rs-mq-card" style={{ width: 230, flexShrink: 0, background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 18, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10 }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: `${c}1A`, color: c, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, border: `2px solid ${c}33` }}>
                      {initials(name)}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{name}</div>
                    <div style={{ fontSize: 12, color: C.sub }}>Groupe 20 · PI 2026</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: C.sub, marginTop: 16 }}>Passez la souris sur une carte pour mettre le défilement en pause.</div>
        </Reveal>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "0 24px 80px" }}>
        <Reveal>
          <div style={{ maxWidth: 1120, margin: "0 auto", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, borderRadius: 28, padding: "60px 32px", textAlign: "center", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
            <span style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ position: "absolute", bottom: -50, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: -1, margin: 0 }}>Prêt à reprendre votre santé en main ?</h2>
            <p style={{ fontSize: 17, opacity: 0.9, marginTop: 14 }}>Découvrez l'application Rappel Santé en quelques secondes.</p>
            <button onClick={() => navigate("/welcome")} style={{ ...btnLight, marginTop: 28, display: "inline-flex", alignItems: "center", gap: 10, fontSize: 17 }}>
              Lancer la démo <ArrowRight size={18} />
            </button>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "28px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo size={30} ring="rgba(30,125,92,0.25)" />
            <span style={{ fontWeight: 700 }}>Rappel Santé</span>
          </div>
          <div style={{ fontSize: 13, color: C.sub }}>© {new Date().getFullYear()} · Groupe 20 · Projet Intégrateur PI 2026 · Togo</div>
          <button onClick={() => navigate("/gallery")} style={navLink}>Voir tous les écrans →</button>
        </div>
      </footer>
    </div>
  );
}

function SectionLabel({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: light ? C.light : C.primary, marginBottom: 14 }}>
      <span style={{ width: 22, height: 2, background: light ? C.light : C.primary, borderRadius: 2 }} />
      {children}
    </div>
  );
}

const h2: React.CSSProperties = { fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: -1, margin: "0 0 14px", lineHeight: 1.1 };
const lead: React.CSSProperties = { fontSize: 17, color: C.sub, lineHeight: 1.7, margin: 0 };
const navLink: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", fontSize: 14.5, fontWeight: 600, color: C.ink, fontFamily: FONT };
const btnPrimary: React.CSSProperties = { background: C.primary, color: "#FFFFFF", border: "none", borderRadius: 12, padding: "12px 22px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT };
const btnLight: React.CSSProperties = { background: "#FFFFFF", color: C.primary, border: "none", borderRadius: 12, padding: "14px 26px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" };
const btnGhost: React.CSSProperties = { background: "rgba(255,255,255,0.12)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "14px 26px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: FONT };

const KEYFRAMES = `
html { scroll-behavior: smooth; }
@keyframes rs-ecg { from { stroke-dashoffset: 4080; } to { stroke-dashoffset: 0; } }
@keyframes rs-float { 0%,100% { transform: translateY(0); opacity:.6; } 50% { transform: translateY(-16px); opacity:1; } }
@keyframes rs-floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes rs-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.rs-card:hover { transform: translateY(-6px); box-shadow: 0 14px 38px rgba(0,0,0,0.12) !important; }
.rs-marquee { -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
.rs-track { animation: rs-marquee 34s linear infinite; }
.rs-track:hover { animation-play-state: paused; }
.rs-mq-card { transition: transform .25s ease, box-shadow .25s ease; }
.rs-mq-card:hover { transform: translateY(-6px); box-shadow: 0 14px 34px rgba(0,0,0,0.12); }
@media (max-width: 720px) { .rs-navlinks { display: none !important; } }
`;
