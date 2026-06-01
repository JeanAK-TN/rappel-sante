import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Check, Phone } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { useStore } from "../../store/AppStore";
import { useToast } from "../../ui/toast";

const PATHOLOGIES = ["Hypertension", "Diabète", "Autre"];
const LANGUAGES = ["Français", "Éwé", "Kabiyè"];

/** Gabarit commun : en-tête avec retour + contenu défilant + bouton bas optionnel. */
function SubPage({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "#FFFFFF" }}>
        <StatusBar />
        <div style={{ padding: "8px 16px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <ChevronLeft size={26} color="#1A2E3B" />
          </button>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1A2E3B" }}>{title}</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </div>
      {footer && <div style={{ padding: "12px 20px 28px", background: "#F4F6F7" }}>{footer}</div>}
    </div>
  );
}

const field: React.CSSProperties = {
  width: "100%", height: 52, background: "#FFFFFF", borderRadius: 10, border: "1.5px solid #B2CEBF",
  paddingInline: 14, fontSize: 15, color: "#1A2E3B", outline: "none", boxSizing: "border-box",
};
const label: React.CSSProperties = { fontSize: 12, color: "#607D8B", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 };
const primaryBtn: React.CSSProperties = { width: "100%", height: 52, background: "#1E7D5C", border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer" };

// Mes informations personnelles
export function InfoPersoScreen() {
  const store = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const p = store.state.profile;
  const [firstName, setFirstName] = useState(p.firstName);
  const [lastName, setLastName] = useState(p.lastName);
  const [age, setAge] = useState(p.age);
  const [phone, setPhone] = useState(p.phone);

  function save() {
    store.updateProfile({ firstName, lastName, age, phone });
    toast.show("Informations enregistrées ✅");
    navigate("/profile");
  }

  return (
    <SubPage title="Mes informations" footer={<button style={primaryBtn} onClick={save}>Enregistrer</button>}>
      <div><div style={label}>Prénom</div><input style={field} value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
      <div><div style={label}>Nom</div><input style={field} value={lastName} onChange={e => setLastName(e.target.value)} /></div>
      <div><div style={label}>Âge</div><input style={field} value={age} onChange={e => setAge(e.target.value.replace(/\D/g, ""))} inputMode="numeric" /></div>
      <div><div style={label}>Téléphone</div><input style={field} value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" /></div>
    </SubPage>
  );
}

// Mes pathologies
export function PathologiesScreen() {
  const store = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(store.state.profile.pathologies);
  const [diseaseDetail, setDiseaseDetail] = useState(store.state.profile.diseaseDetail ?? "");

  function toggle(p: string) {
    setSelected(cur => cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p]);
  }
  function save() {
    store.updateProfile({ pathologies: selected, diseaseDetail: diseaseDetail.trim() || undefined });
    toast.show("Pathologies mises à jour ✅");
    navigate("/profile");
  }

  return (
    <SubPage title="Mes pathologies" footer={<button style={primaryBtn} onClick={save}>Enregistrer</button>}>
      <div style={{ fontSize: 13, color: "#607D8B" }}>Sélectionnez vos pathologies pour adapter le coaching.</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {PATHOLOGIES.map(p => {
          const on = selected.includes(p);
          return (
            <button key={p} onClick={() => toggle(p)} style={{
              paddingInline: 16, height: 40, borderRadius: 20, cursor: "pointer", border: "none",
              background: on ? "#1E7D5C" : "#D6EFE6", color: on ? "#FFFFFF" : "#1E7D5C", fontWeight: 500, fontSize: 14,
            }}>{p}</button>
          );
        })}
      </div>
      <div>
        <div style={label}>Préciser une autre maladie</div>
        <input style={field} value={diseaseDetail} onChange={e => setDiseaseDetail(e.target.value)} placeholder="Ex. Insuffisance rénale chronique" />
      </div>
    </SubPage>
  );
}

// Mon médecin traitant
export function DoctorScreen() {
  const store = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const p0 = store.state.profile;
  const [firstName, setFirstName] = useState(p0.doctorFirstName ?? "");
  const [lastName, setLastName] = useState(p0.doctorLastName ?? "");
  const [profession, setProfession] = useState(p0.doctorProfession ?? "");
  const [phone, setPhone] = useState(p0.doctorPhone ?? "");

  function save() {
    const docName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    store.updateProfile({
      doctorFirstName: firstName.trim() || undefined,
      doctorLastName: lastName.trim() || undefined,
      doctorProfession: profession.trim() || undefined,
      doctor: docName ? `Dr. ${docName}` : undefined,
      doctorPhone: phone.trim() || undefined,
    });
    toast.show("Médecin enregistré ✅");
    navigate("/profile");
  }

  const tel = phone.replace(/[^\d+]/g, "");

  return (
    <SubPage title="Mon médecin traitant" footer={<button style={primaryBtn} onClick={save}>Enregistrer</button>}>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><div style={label}>Prénom</div><input style={field} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" /></div>
        <div style={{ flex: 1 }}><div style={label}>Nom</div><input style={field} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" /></div>
      </div>
      <div><div style={label}>Profession</div><input style={field} value={profession} onChange={e => setProfession(e.target.value)} placeholder="Ex. Cardiologue" /></div>
      <div><div style={label}>Téléphone</div><input style={field} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+228 ..." inputMode="tel" /></div>
      {tel.length >= 6 && (
        <a href={`tel:${tel}`} style={{ textDecoration: "none" }}>
          <div style={{ width: "100%", height: 52, background: "#43A047", borderRadius: 12, color: "#FFFFFF", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Phone size={18} color="#FFFFFF" /> Appeler le médecin
          </div>
        </a>
      )}
      <div style={{ fontSize: 13, color: "#607D8B", lineHeight: 1.5 }}>
        Votre médecin pourra suivre vos données si vous activez le partage dans votre profil.
      </div>
    </SubPage>
  );
}

// Langue
export function LanguageScreen() {
  const store = useStore();
  const toast = useToast();
  const lang = store.state.profile.language;

  return (
    <SubPage title="Langue">
      {LANGUAGES.map(l => {
        const on = l === lang;
        return (
          <button key={l} onClick={() => { store.updateProfile({ language: l }); toast.show(`Langue : ${l}`, "info"); }} style={{
            background: "#FFFFFF", border: `1.5px solid ${on ? "#1E7D5C" : "#B2CEBF"}`, borderRadius: 12,
            padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
          }}>
            <span style={{ fontSize: 15, fontWeight: on ? 600 : 400, color: "#1A2E3B" }}>{l}</span>
            {on && <Check size={20} color="#1E7D5C" />}
          </button>
        );
      })}
      <div style={{ fontSize: 12, color: "#B2CEBF" }}>Les langues locales (Éwé, Kabiyè) seront enrichies progressivement.</div>
    </SubPage>
  );
}

// Notifications
export function NotificationsScreen() {
  const store = useStore();
  const navigate = useNavigate();
  const prefs = store.state.profile.notifications;
  const items: { key: keyof typeof prefs; label: string; desc: string }[] = [
    { key: "rappels", label: "Rappels de prise", desc: "Être notifié à l'heure de chaque médicament" },
    { key: "alertes", label: "Alertes santé", desc: "Recevoir une alerte en cas de valeur critique" },
    { key: "conseils", label: "Conseils du jour", desc: "Astuces nutrition et prévention" },
  ];

  return (
    <SubPage title="Notifications">
      {items.map(it => {
        const on = prefs[it.key];
        return (
          <div key={it.key} style={{ background: "#FFFFFF", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#1A2E3B" }}>{it.label}</div>
              <div style={{ fontSize: 12, color: "#607D8B", marginTop: 2 }}>{it.desc}</div>
            </div>
            <div
              onClick={() => store.updateProfile({ notifications: { ...prefs, [it.key]: !on } })}
              style={{ width: 44, height: 24, borderRadius: 12, background: on ? "#1E7D5C" : "#D1D5DB", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}
            >
              <div style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#FFFFFF", transition: "left 0.2s" }} />
            </div>
          </div>
        );
      })}
      <button
        onClick={() => navigate("/notification")}
        style={{ width: "100%", height: 48, marginTop: 4, background: "transparent", border: "1.5px solid #1E7D5C", borderRadius: 12, color: "#1E7D5C", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
      >
        Voir un exemple de rappel
      </button>
    </SubPage>
  );
}

// Aide & Support
export function HelpScreen() {
  const faqs = [
    { q: "Comment ajouter un médicament ?", a: "Onglet Médicaments, puis le bouton + en haut à droite." },
    { q: "Comment enregistrer une mesure ?", a: "Onglet Suivi, choisissez le type, puis le bouton + en bas à droite." },
    { q: "Mes données sont-elles privées ?", a: "Oui. Elles restent sur votre appareil ; le partage avec un médecin est désactivable dans le profil." },
  ];
  return (
    <SubPage title="Aide & Support">
      {faqs.map((f, i) => (
        <div key={i} style={{ background: "#FFFFFF", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1A2E3B", marginBottom: 6 }}>{f.q}</div>
          <div style={{ fontSize: 13, color: "#607D8B", lineHeight: 1.5 }}>{f.a}</div>
        </div>
      ))}
      <div style={{ background: "#D6EFE6", borderRadius: 12, padding: 16, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#1A2E3B" }}>Besoin d'aide ? Écrivez-nous à</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1E7D5C", marginTop: 4 }}>support@rappelsante.tg</div>
      </div>
    </SubPage>
  );
}

// À propos
export function AboutScreen() {
  return (
    <SubPage title="À propos">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 8 }}>
        <div style={{ width: 72, height: 72, background: "#1E7D5C", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
            <path d="M30 8C30 8 14 18 14 32C14 40.8 21.2 48 30 48C38.8 48 46 40.8 46 32C46 18 30 8 30 8Z" fill="white" opacity="0.9" />
            <path d="M24 32H36M30 26V38" stroke="#1E7D5C" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#1A2E3B" }}>Rappel Santé</div>
        <div style={{ fontSize: 13, color: "#607D8B" }}>Version 1.0 · Démo</div>
      </div>
      <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 16, fontSize: 13, color: "#607D8B", lineHeight: 1.6 }}>
        Rappel Santé aide les personnes atteintes de maladies chroniques au Togo à gérer leurs
        médicaments et leur suivi de santé au quotidien : rappels, mesures, coaching et alertes préventives.
      </div>
      <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Projet Innovation · Groupe 20, PI 2026</div>
        <div style={{ fontSize: 13, color: "#1A2E3B", lineHeight: 1.6 }}>
          M'BOUEKE Kevin · ZATO Alim · COMBEY Clétus · ADJAYI Rosalie · GNAKADE Cyrus · GAGOU David · KODIO Jean · AWANYA Gracia · AMEGNAGLO Scyana · LAYIBO Belinda
        </div>
      </div>
    </SubPage>
  );
}
