import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Phone, Lock, User, Search } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { useStore } from "../../store/AppStore";

// Splash Screen
export function SplashScreen() {
  const navigate = useNavigate();
  // Avance automatiquement vers l'onboarding après un court instant.
  useEffect(() => {
    const t = setTimeout(() => navigate("/onboarding/1"), 1800);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div
      onClick={() => navigate("/onboarding/1")}
      style={{ width: 390, height: 844, background: "#1E7D5C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 100, height: 100, background: "rgba(255,255,255,0.15)",
          borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M30 8C30 8 14 18 14 32C14 40.8 21.2 48 30 48C38.8 48 46 40.8 46 32C46 18 30 8 30 8Z" fill="white" opacity="0.9" />
            <path d="M24 32H36M30 26V38" stroke="#1E7D5C" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#FFFFFF", letterSpacing: -0.5 }}>Rappel Santé</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>Votre santé, simplifiée.</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 60, display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: i === 0 ? 24 : 8, height: 8, borderRadius: 4, background: i === 0 ? "#FFFFFF" : "rgba(255,255,255,0.4)" }} />
        ))}
      </div>
    </div>
  );
}

// Onboarding Slide
function OnboardingSlide({ active, title, subtitle, illustrationIcon, buttonLabel = "Suivant", showSkip = true, next = "/register", skip = "/register" }: {
  active: number; title: string; subtitle: string; illustrationIcon: React.ReactNode;
  buttonLabel?: string; showSkip?: boolean; next?: string; skip?: string;
}) {
  const navigate = useNavigate();
  return (
    <div style={{ width: 390, height: 844, background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <StatusBar />
      {/* Illustration */}
      <div style={{
        margin: "20px 24px 0", height: 300, background: "#D6EFE6",
        borderRadius: 24, border: "1.5px solid #B2CEBF",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <div style={{ width: 80, height: 80, background: "#1E7D5C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {illustrationIcon}
        </div>
      </div>
      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 4, background: i === active ? "#1E7D5C" : "#D6EFE6" }} />
        ))}
      </div>
      {/* Text */}
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B", lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: 16, color: "#607D8B", marginTop: 12, lineHeight: 1.5 }}>{subtitle}</div>
      </div>
      {/* Buttons */}
      <div style={{ position: "absolute", bottom: 48, left: 24, right: 24 }}>
        <button
          onClick={() => navigate(next)}
          style={{
            width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12,
            color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer",
          }}
        >{buttonLabel}</button>
        {showSkip && (
          <div
            onClick={() => navigate(skip)}
            style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#607D8B", fontWeight: 500, cursor: "pointer" }}
          >Passer</div>
        )}
      </div>
    </div>
  );
}

export function OnboardingSlide1() {
  return <OnboardingSlide active={0} next="/onboarding/2" title="Plus d'oublis de médicaments" subtitle="Des rappels intelligents, adaptés à votre traitement et vos horaires." illustrationIcon={
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="14" y="4" width="12" height="32" rx="6" fill="white" /><rect x="4" y="14" width="32" height="12" rx="6" fill="white" opacity="0.6" /><circle cx="28" cy="28" r="8" fill="#43A047" /><path d="M24.5 28L27 30.5L31.5 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  } />;
}
export function OnboardingSlide2() {
  return <OnboardingSlide active={1} next="/onboarding/3" title="Suivez votre santé au quotidien" subtitle="Tension, glycémie, poids : tout votre historique en un coup d'œil." illustrationIcon={
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><polyline points="6,32 14,20 20,26 28,12 34,18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" /><circle cx="34" cy="18" r="3" fill="#43A047" /></svg>
  } />;
}
export function OnboardingSlide3() {
  return <OnboardingSlide active={2} next="/register" title="Un coaching personnalisé" subtitle="Des conseils adaptés à votre pathologie, votre âge et vos habitudes alimentaires." illustrationIcon={
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="14" r="8" fill="white" /><path d="M6 36c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="white" strokeWidth="3" strokeLinecap="round" /><circle cx="30" cy="10" r="6" fill="#FFD54F" /><path d="M30 7v3M30 13v-1M27 10h3M33 10h-1" stroke="#FF9800" strokeWidth="1.5" strokeLinecap="round" /></svg>
  } buttonLabel="Commencer" showSkip={false} />;
}

// Inscription
export function InscriptionScreen() {
  const navigate = useNavigate();
  const store = useStore();
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const canSubmit = firstName.trim().length > 0 && accepted;

  function submit() {
    if (!canSubmit) return;
    store.updateProfile({ firstName: firstName.trim(), lastName: "", phone: phone.trim() ? `+228 ${phone.trim()}` : "" });
    navigate("/otp");
  }

  const fieldBox = (focused: boolean): React.CSSProperties => ({
    height: 56, background: "#F4F6F7", borderRadius: 8,
    border: `${focused ? 2 : 1.5}px solid ${focused ? "#1E7D5C" : "#B2CEBF"}`,
    display: "flex", alignItems: "center", paddingInline: 16, gap: 12,
  });
  const inputStyle: React.CSSProperties = { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 16, color: "#1A2E3B" };

  return (
    <div style={{ width: 390, height: 844, background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Créer un compte</div>
        <div style={{ fontSize: 14, color: "#607D8B", marginTop: 4 }}>Entrez vos informations de base.</div>
      </div>
      <div style={{ padding: "32px 24px 0", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: "#1E7D5C", fontWeight: 500, marginBottom: 4 }}>Prénom</div>
          <div style={fieldBox(firstName.length > 0)}>
            <User size={18} color="#1E7D5C" />
            <input style={inputStyle} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Votre prénom" autoFocus />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 500, marginBottom: 4 }}>Numéro de téléphone</div>
          <div style={fieldBox(false)}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingRight: 12, borderRight: "1px solid #B2CEBF" }}>
              <span style={{ fontSize: 18 }}>🇹🇬</span>
              <span style={{ fontSize: 14, color: "#1A2E3B", fontWeight: 500 }}>+228</span>
            </div>
            <Phone size={16} color="#607D8B" />
            <input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} placeholder="XX XX XX XX" inputMode="tel" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 500, marginBottom: 4 }}>Mot de passe</div>
          <div style={fieldBox(false)}>
            <Lock size={18} color="#607D8B" />
            <input style={inputStyle} type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            <button onClick={() => setShowPwd(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              {showPwd ? <EyeOff size={18} color="#607D8B" /> : <Eye size={18} color="#607D8B" />}
            </button>
          </div>
        </div>
        <div onClick={() => setAccepted(v => !v)} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, cursor: "pointer" }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: accepted ? "#1E7D5C" : "#F4F6F7", border: accepted ? "none" : "1.5px solid #B2CEBF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {accepted && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </div>
          <span style={{ fontSize: 14, color: "#607D8B" }}>J'accepte les <span style={{ color: "#1E7D5C" }}>conditions d'utilisation</span></span>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 48, left: 24, right: 24 }}>
        <button
          onClick={submit}
          disabled={!canSubmit}
          style={{ width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: canSubmit ? "pointer" : "not-allowed", opacity: canSubmit ? 1 : 0.4 }}
        >
          Créer mon compte
        </button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#607D8B" }}>
          Déjà inscrit ? <span onClick={() => navigate("/home")} style={{ color: "#1E7D5C", fontWeight: 600, cursor: "pointer" }}>Se connecter</span>
        </div>
      </div>
    </div>
  );
}

// OTP Screen
export function OTPScreen() {
  const navigate = useNavigate();
  const store = useStore();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const phone = store.state.profile.phone || "+228 90 23 45 67";
  const complete = digits.every(d => d !== "");

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1); // garde le dernier chiffre saisi
    setDigits(cur => cur.map((x, j) => (j === i ? d : x)));
    if (d && i < 5) refs.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  return (
    <div style={{ width: 390, height: 844, background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Vérification</div>
        <div style={{ fontSize: 14, color: "#607D8B", marginTop: 8, lineHeight: 1.5 }}>
          Un code à 6 chiffres a été envoyé au<br />
          <span style={{ color: "#1E7D5C", fontWeight: 600 }}>{phone}</span>
        </div>
      </div>
      {/* OTP boxes */}
      <div style={{ padding: "48px 24px 0", display: "flex", justifyContent: "center", gap: 10 }}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            value={digit}
            onChange={e => setDigit(i, e.target.value)}
            onKeyDown={e => onKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            autoFocus={i === 0}
            style={{
              width: 48, height: 56, background: "#F4F6F7", borderRadius: 8,
              border: `2px solid ${digit ? "#1E7D5C" : "#B2CEBF"}`,
              textAlign: "center", fontSize: 24, fontWeight: 700, color: "#1A2E3B", outline: "none",
            }}
          />
        ))}
      </div>
      <div style={{ padding: "32px 24px 0" }}>
        <button
          onClick={() => complete && navigate("/setup-profile")}
          disabled={!complete}
          style={{ width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: complete ? "pointer" : "not-allowed", opacity: complete ? 1 : 0.4 }}
        >
          Confirmer
        </button>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#607D8B" }}>
          <span style={{ color: "#1E7D5C", cursor: "pointer" }}>Renvoyer le code</span> (57s)
        </div>
      </div>
    </div>
  );
}

// Profil Médical Setup
const PATHOLOGIES = ["Hypertension", "Diabète", "Insuff. cardiaque", "Asthme", "Autre"];

export function ProfilMedicalScreen() {
  const navigate = useNavigate();
  const store = useStore();
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("Homme");
  const [selected, setSelected] = useState<string[]>([]);
  const [doctor, setDoctor] = useState("");

  function togglePatho(p: string) {
    setSelected(cur => cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p]);
  }

  function finish(save: boolean) {
    if (save) store.updateProfile({ age: age.trim() || "—", sex, pathologies: selected, doctor: doctor.trim() || undefined });
    navigate("/home");
  }

  return (
    <div style={{ width: 390, height: 844, background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Votre profil de santé</div>
        <div style={{ fontSize: 14, color: "#607D8B", marginTop: 4 }}>Ces informations personnalisent vos rappels.</div>
      </div>
      <div style={{ padding: "24px 24px 140px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto", flex: 1 }}>
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>Âge</div>
          <div style={{ height: 56, background: "#F4F6F7", borderRadius: 8, border: `${age ? 2 : 1.5}px solid ${age ? "#1E7D5C" : "#B2CEBF"}`, display: "flex", alignItems: "center", paddingInline: 16 }}>
            <input style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 16, color: "#1A2E3B", fontWeight: 500 }} value={age} onChange={e => setAge(e.target.value.replace(/\D/g, ""))} placeholder="Votre âge" inputMode="numeric" autoFocus />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Sexe</div>
          <div style={{ display: "flex", gap: 12 }}>
            {["Homme", "Femme"].map(s => {
              const on = s === sex;
              return (
                <button key={s} onClick={() => setSex(s)} style={{
                  flex: 1, height: 44, borderRadius: 20, cursor: "pointer",
                  background: on ? "#1E7D5C" : "#F4F6F7",
                  border: on ? "none" : "1.5px solid #B2CEBF",
                  color: on ? "#FFFFFF" : "#607D8B", fontWeight: 500, fontSize: 14,
                }}>{s}</button>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Mes pathologies</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PATHOLOGIES.map(p => {
              const on = selected.includes(p);
              return (
                <button key={p} onClick={() => togglePatho(p)} style={{
                  paddingInline: 16, height: 36, borderRadius: 20, cursor: "pointer", border: "none",
                  background: on ? "#1E7D5C" : "#D6EFE6",
                  color: on ? "#FFFFFF" : "#1E7D5C", fontWeight: 500, fontSize: 13,
                }}>{p}</button>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>Médecin traitant (optionnel)</div>
          <div style={{ height: 56, background: "#F4F6F7", borderRadius: 8, border: "1.5px solid #B2CEBF", display: "flex", alignItems: "center", paddingInline: 16, gap: 12 }}>
            <Search size={18} color="#607D8B" />
            <input style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 16, color: "#1A2E3B" }} value={doctor} onChange={e => setDoctor(e.target.value)} placeholder="Rechercher un médecin..." />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 40, left: 24, right: 24, background: "#FFFFFF" }}>
        <button
          onClick={() => finish(true)}
          style={{ width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
        >
          Continuer
        </button>
        <div
          onClick={() => finish(false)}
          style={{ textAlign: "center", marginTop: 14, fontSize: 14, color: "#607D8B", cursor: "pointer" }}
        >Passer pour l'instant</div>
      </div>
    </div>
  );
}
