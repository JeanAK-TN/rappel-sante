import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, Phone, Lock, User, ChevronLeft, Stethoscope } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { useStore } from "../../store/AppStore";

// Splash Screen
export function SplashScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  // Avance automatiquement vers l'onboarding, mais seulement quand on est
  // réellement sur l'écran de démarrage (pas dans la galerie qui l'affiche aussi).
  useEffect(() => {
    if (location.pathname !== "/welcome") return;
    const t = setTimeout(() => navigate("/onboarding/1"), 1800);
    return () => clearTimeout(t);
  }, [navigate, location.pathname]);
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
    // Crée un nouveau compte dédié (données isolées).
    store.createUser({ firstName: firstName.trim(), lastName: "", phone: phone.trim() ? `+228 ${phone.trim()}` : "" });
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
          Déjà inscrit ? <span onClick={() => navigate("/login")} style={{ color: "#1E7D5C", fontWeight: 600, cursor: "pointer" }}>Se connecter</span>
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
const PATHOLOGIES = ["Hypertension", "Diabète", "VIH", "Tuberculose", "Autre"];

export function ProfilMedicalScreen() {
  const navigate = useNavigate();
  const store = useStore();
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("Homme");
  const [selected, setSelected] = useState<string[]>([]);
  const [diseaseDetail, setDiseaseDetail] = useState("");
  const [docFirst, setDocFirst] = useState("");
  const [docLast, setDocLast] = useState("");
  const [docProfession, setDocProfession] = useState("");
  const [glyc, setGlyc] = useState("");
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [weight, setWeight] = useState("");

  function togglePatho(p: string) {
    setSelected(cur => cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p]);
  }

  function finish() {
    const docName = [docFirst.trim(), docLast.trim()].filter(Boolean).join(" ");
    store.updateProfile({
      age: age.trim() || "—",
      sex,
      pathologies: selected,
      diseaseDetail: diseaseDetail.trim() || undefined,
      doctorFirstName: docFirst.trim() || undefined,
      doctorLastName: docLast.trim() || undefined,
      doctorProfession: docProfession.trim() || undefined,
      doctor: docName ? `Dr. ${docName}` : undefined,
    });
    // Mesures initiales : seules les valeurs renseignées sont enregistrées.
    const now = Date.now();
    const g = parseFloat(glyc.replace(",", "."));
    if (!isNaN(g) && g > 0) store.addMeasurement({ type: "glycemie", value: g, context: "À jeun", at: now });
    const s = parseInt(sys, 10), d = parseInt(dia, 10);
    if (s > 0) store.addMeasurement({ type: "tension", value: s, diastolic: d > 0 ? d : undefined, context: "Matin", at: now });
    const w = parseFloat(weight.replace(",", "."));
    if (!isNaN(w) && w > 0) store.addMeasurement({ type: "poids", value: w, at: now });
    navigate("/home");
  }

  const numInput: React.CSSProperties = { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 16, color: "#1A2E3B" };
  const numBox: React.CSSProperties = { height: 56, background: "#F4F6F7", borderRadius: 8, border: "1.5px solid #B2CEBF", display: "flex", alignItems: "center", paddingInline: 16, gap: 8 };
  const docInput: React.CSSProperties = { height: 52, background: "#F4F6F7", borderRadius: 8, border: "1.5px solid #B2CEBF", paddingInline: 14, fontSize: 15, color: "#1A2E3B", outline: "none", boxSizing: "border-box", width: "100%" };

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
          {selected.includes("Autre") && (
            <input style={{ ...docInput, marginTop: 12 }} value={diseaseDetail} onChange={e => setDiseaseDetail(e.target.value)} placeholder="Précisez la maladie" />
          )}
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>Votre médecin traitant</div>
          <div style={{ fontSize: 12, color: "#B2CEBF", marginBottom: 8 }}>Idéalement renseigné avec votre médecin.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <input style={docInput} value={docFirst} onChange={e => setDocFirst(e.target.value)} placeholder="Prénom" />
              <input style={docInput} value={docLast} onChange={e => setDocLast(e.target.value)} placeholder="Nom" />
            </div>
            <input style={docInput} value={docProfession} onChange={e => setDocProfession(e.target.value)} placeholder="Profession (ex. Cardiologue)" />
          </div>
        </div>

        {/* Valeurs de santé initiales (optionnelles) */}
        <div>
          <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Vos dernières valeurs (optionnel)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={numBox}>
              <span style={{ fontSize: 14, color: "#607D8B", width: 90 }}>Glycémie</span>
              <input style={numInput} value={glyc} onChange={e => setGlyc(e.target.value.replace(/[^\d.,]/g, ""))} placeholder="ex. 1.20" inputMode="decimal" />
              <span style={{ fontSize: 13, color: "#B2CEBF" }}>g/L</span>
            </div>
            <div style={numBox}>
              <span style={{ fontSize: 14, color: "#607D8B", width: 90 }}>Tension</span>
              <input style={{ ...numInput, flex: "none", width: 56, textAlign: "center" }} value={sys} onChange={e => setSys(e.target.value.replace(/\D/g, ""))} placeholder="120" inputMode="numeric" />
              <span style={{ fontSize: 18, color: "#B2CEBF" }}>/</span>
              <input style={{ ...numInput, flex: 1, width: 56 }} value={dia} onChange={e => setDia(e.target.value.replace(/\D/g, ""))} placeholder="80" inputMode="numeric" />
              <span style={{ fontSize: 13, color: "#B2CEBF" }}>mmHg</span>
            </div>
            <div style={numBox}>
              <span style={{ fontSize: 14, color: "#607D8B", width: 90 }}>Poids</span>
              <input style={numInput} value={weight} onChange={e => setWeight(e.target.value.replace(/[^\d.,]/g, ""))} placeholder="ex. 74.5" inputMode="decimal" />
              <span style={{ fontSize: 13, color: "#B2CEBF" }}>kg</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 40, left: 24, right: 24, background: "#FFFFFF" }}>
        <button
          onClick={finish}
          style={{ width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}

// Connexion : choisir un compte enregistré sur l'appareil
export function LoginScreen() {
  const navigate = useNavigate();
  const store = useStore();
  const users = store.usersList();

  function connect(id: string) {
    store.switchUser(id);
    navigate("/home");
  }

  return (
    <div style={{ width: 390, height: 844, background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <div style={{ padding: "8px 16px 0" }}>
        <button onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "6px 4px", color: "#607D8B", fontSize: 14, fontWeight: 500 }}>
          <ChevronLeft size={20} color="#607D8B" /> Accueil
        </button>
      </div>
      <div style={{ padding: "8px 24px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Se connecter</div>
        <div style={{ fontSize: 14, color: "#607D8B", marginTop: 4 }}>Choisissez votre compte.</div>
      </div>
      <div style={{ padding: "24px 24px 0", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", flex: 1 }}>
        {users.length === 0 && (
          <div style={{ fontSize: 14, color: "#607D8B", textAlign: "center", marginTop: 40 }}>
            Aucun compte enregistré sur cet appareil.
          </div>
        )}
        {users.map(u => {
          const initials = `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase() || "?";
          return (
            <button key={u.id} onClick={() => connect(u.id)} style={{
              background: "#F4F6F7", border: "1.5px solid #B2CEBF", borderRadius: 12, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left",
            }}>
              <div style={{ width: 44, height: 44, background: "#1E7D5C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>{initials}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1A2E3B" }}>{u.firstName || "Utilisateur"} {u.lastName}</div>
                <div style={{ fontSize: 13, color: "#607D8B" }}>{u.phone || "—"}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 32, left: 24, right: 24 }}>
        <button
          onClick={() => navigate("/register")}
          style={{ width: "100%", height: 52, background: "transparent", border: "2px solid #1E7D5C", borderRadius: 12, color: "#1E7D5C", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
        >
          Créer un nouveau compte
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#E0E0E0" }} />
          <span style={{ fontSize: 12, color: "#B2CEBF" }}>ou</span>
          <div style={{ flex: 1, height: 1, background: "#E0E0E0" }} />
        </div>
        <button
          onClick={() => navigate("/medecin")}
          style={{ width: "100%", height: 48, background: "#145C40", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <Stethoscope size={18} color="#FFFFFF" /> Espace médecin
        </button>
      </div>
    </div>
  );
}
