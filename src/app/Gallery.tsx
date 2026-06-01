import { useNavigate } from "react-router";
import { ScreenFrame } from "./components/ScreenFrame";
import {
  SplashScreen, OnboardingSlide1, OnboardingSlide2, OnboardingSlide3,
  InscriptionScreen, OTPScreen, ProfilMedicalScreen
} from "./components/screens/OnboardingScreens";
import { DashboardScreen } from "./components/screens/DashboardScreen";
import { MedicationsScreen, MedDetailSheet } from "./components/screens/MedicationsScreen";
import { TrackingScreen, NewEntryModal } from "./components/screens/TrackingScreen";
import { CoachingScreen } from "./components/screens/CoachingScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import {
  NotificationScreen, CriticalAlertScreen, EmptyStateScreen, MedecinDashboard
} from "./components/screens/SpecialStates";

const SCALE = 0.46;

interface FlowSection {
  label: string;
  color: string;
  emoji: string;
  screens: { component: React.ReactNode; label: string }[];
}

const flows: FlowSection[] = [
  {
    label: "Onboarding",
    color: "#1E7D5C",
    emoji: "📱",
    screens: [
      { component: <SplashScreen />, label: "1.1 — Splash" },
      { component: <OnboardingSlide1 />, label: "1.2 — Slide Médicaments" },
      { component: <OnboardingSlide2 />, label: "1.3 — Slide Suivi" },
      { component: <OnboardingSlide3 />, label: "1.4 — Slide Coaching" },
      { component: <InscriptionScreen />, label: "1.5 — Inscription" },
      { component: <OTPScreen />, label: "1.6 — Vérification OTP" },
      { component: <ProfilMedicalScreen />, label: "1.7 — Profil Médical" },
    ],
  },
  {
    label: "Navigation Principale",
    color: "#2196F3",
    emoji: "🏠",
    screens: [
      { component: <DashboardScreen />, label: "2.1 — Accueil" },
      { component: <MedicationsScreen />, label: "2.2 — Mes Médicaments" },
      { component: <MedDetailSheet />, label: "2.3 — Détail Médicament" },
      { component: <TrackingScreen />, label: "2.4 — Mon Suivi" },
      { component: <NewEntryModal />, label: "2.5 — Saisie Valeur" },
      { component: <CoachingScreen />, label: "2.6 — Coaching IA" },
      { component: <ProfileScreen />, label: "2.7 — Mon Profil" },
    ],
  },
  {
    label: "États Spéciaux",
    color: "#E53935",
    emoji: "⚡",
    screens: [
      { component: <NotificationScreen />, label: "3.1 — Notification Push" },
      { component: <CriticalAlertScreen />, label: "3.2 — Alerte Critique" },
      { component: <EmptyStateScreen />, label: "3.3 — État Vide" },
      { component: <MedecinDashboard />, label: "3.4 — Espace Médecin" },
    ],
  },
];

export default function Gallery() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F172A",
      fontFamily: "'Inter', sans-serif",
      overflowX: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "40px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <div style={{
            width: 48, height: 48, background: "#1E7D5C", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="28" height="28" viewBox="0 0 60 60" fill="none">
              <path d="M30 8C30 8 14 18 14 32C14 40.8 21.2 48 30 48C38.8 48 46 40.8 46 32C46 18 30 8 30 8Z" fill="white" opacity="0.9" />
              <path d="M24 32H36M30 26V38" stroke="#1E7D5C" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", margin: 0, letterSpacing: -0.5 }}>
              Rappel Santé
            </h1>
            <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
              Application de gestion des maladies chroniques · Togo
            </p>
          </div>
          <button
            onClick={() => navigate("/welcome")}
            style={{
              marginLeft: "auto", padding: "10px 20px", background: "#1E7D5C", border: "none",
              borderRadius: 10, color: "#FFFFFF", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}
          >
            ▶ Lancer l'application
          </button>
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
          {[
            { val: "18", label: "Écrans" },
            { val: "3", label: "Flux" },
            { val: "390×844", label: "Format mobile" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 16px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>{stat.val}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Flows */}
      {flows.map((flow, fi) => (
        <div key={fi} style={{ marginBottom: 48 }}>
          {/* Section header */}
          <div style={{ padding: "0 40px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 4, height: 32, background: flow.color, borderRadius: 2 }} />
            <div>
              <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600 }}>
                {flow.emoji} FLUX {fi + 1}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF" }}>{flow.label}</div>
            </div>
            <div style={{ marginLeft: "auto", padding: "4px 14px", background: "rgba(255,255,255,0.06)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: 12, color: "#94A3B8" }}>{flow.screens.length} écrans</span>
            </div>
          </div>

          {/* Screens row */}
          <div style={{
            overflowX: "auto",
            paddingInline: 40,
            paddingBottom: 16,
          }}>
            <div style={{ display: "flex", gap: 20, width: "max-content" }}>
              {flow.screens.map((screen, si) => (
                <ScreenFrame key={si} label={screen.label} scale={SCALE}>
                  {screen.component}
                </ScreenFrame>
              ))}
            </div>
          </div>

          {/* Divider */}
          {fi < flows.length - 1 && (
            <div style={{ margin: "0 40px", height: 1, background: "rgba(255,255,255,0.06)", marginTop: 16 }} />
          )}
        </div>
      ))}

      {/* Footer */}
      <div style={{ padding: "16px 40px 40px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: "#475569" }}>
          Rappel Santé · Maquette complète · {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["#1E7D5C", "#2196F3", "#FF9800", "#E53935", "#43A047"].map(color => (
            <div key={color} style={{ width: 14, height: 14, borderRadius: "50%", background: color }} />
          ))}
        </div>
      </div>
    </div>
  );
}
