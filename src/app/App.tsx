import { BrowserRouter, Routes, Route } from "react-router";
import { AppStoreProvider } from "./store/AppStore";
import { ToastProvider } from "./ui/toast";
import { PhoneFrame } from "./layouts/PhoneFrame";
import Gallery from "./Gallery";
import {
  SplashScreen, OnboardingSlide1, OnboardingSlide2, OnboardingSlide3,
  InscriptionScreen, OTPScreen, ProfilMedicalScreen, LoginScreen
} from "./components/screens/OnboardingScreens";
import { DashboardScreen } from "./components/screens/DashboardScreen";
import { MedicationsScreen } from "./components/screens/MedicationsScreen";
import { TrackingScreen } from "./components/screens/TrackingScreen";
import { CoachingScreen } from "./components/screens/CoachingScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import {
  InfoPersoScreen, PathologiesScreen, DoctorScreen, LanguageScreen,
  NotificationsScreen, HelpScreen, AboutScreen
} from "./components/screens/ProfileSubpages";
import { MedecinDashboard, NotificationScreen } from "./components/screens/SpecialStates";

/** Enveloppe un écran applicatif dans le cadre téléphone. */
function Phone({ children }: { children: React.ReactNode }) {
  return <PhoneFrame>{children}</PhoneFrame>;
}

export default function App() {
  return (
    <AppStoreProvider>
    <ToastProvider>
    <BrowserRouter>
      <Routes>
        {/* Vue d'ensemble (toutes les maquettes) — utile pour la présentation */}
        <Route path="/gallery" element={<Gallery />} />

        {/* Flux 1 — Onboarding */}
        <Route path="/" element={<Phone><SplashScreen /></Phone>} />
        <Route path="/onboarding/1" element={<Phone><OnboardingSlide1 /></Phone>} />
        <Route path="/onboarding/2" element={<Phone><OnboardingSlide2 /></Phone>} />
        <Route path="/onboarding/3" element={<Phone><OnboardingSlide3 /></Phone>} />
        <Route path="/register" element={<Phone><InscriptionScreen /></Phone>} />
        <Route path="/login" element={<Phone><LoginScreen /></Phone>} />
        <Route path="/otp" element={<Phone><OTPScreen /></Phone>} />
        <Route path="/setup-profile" element={<Phone><ProfilMedicalScreen /></Phone>} />

        {/* Flux 2 — Navigation principale (onglets) */}
        <Route path="/home" element={<Phone><DashboardScreen /></Phone>} />
        <Route path="/medications" element={<Phone><MedicationsScreen /></Phone>} />
        <Route path="/tracking" element={<Phone><TrackingScreen /></Phone>} />
        <Route path="/coaching" element={<Phone><CoachingScreen /></Phone>} />
        <Route path="/profile" element={<Phone><ProfileScreen /></Phone>} />
        <Route path="/profile/info" element={<Phone><InfoPersoScreen /></Phone>} />
        <Route path="/profile/pathologies" element={<Phone><PathologiesScreen /></Phone>} />
        <Route path="/profile/doctor" element={<Phone><DoctorScreen /></Phone>} />
        <Route path="/profile/language" element={<Phone><LanguageScreen /></Phone>} />
        <Route path="/profile/notifications" element={<Phone><NotificationsScreen /></Phone>} />
        <Route path="/profile/help" element={<Phone><HelpScreen /></Phone>} />
        <Route path="/profile/about" element={<Phone><AboutScreen /></Phone>} />
        <Route path="/medecin" element={<Phone><MedecinDashboard /></Phone>} />
        <Route path="/notification" element={<Phone><NotificationScreen /></Phone>} />
      </Routes>
    </BrowserRouter>
    </ToastProvider>
    </AppStoreProvider>
  );
}
