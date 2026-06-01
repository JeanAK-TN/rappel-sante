// Données de départ : reproduisent les maquettes pour une première ouverture réaliste.
import type { AppState, Measurement, Medication, Profile, RootState } from "./types";
import { dateKey } from "./health";

export const DEMO_USER_ID = "demo-kofi";

const DAY = 86400000;

/** Construit un horodatage à J-`daysAgo`, à l'heure HH:MM. */
function at(daysAgo: number, hh: number, mm: number): number {
  const d = new Date(Date.now() - daysAgo * DAY);
  d.setHours(hh, mm, 0, 0);
  return d.getTime();
}

let seq = 0;
const id = () => `seed-${seq++}`;

// Série de glycémie sur la semaine (g/L) terminant aujourd'hui.
const glyc: Measurement[] = [
  { daysAgo: 6, v: 1.38, ctx: "À jeun", h: 7, m: 30 },
  { daysAgo: 5, v: 1.22, ctx: "À jeun", h: 7, m: 30 },
  { daysAgo: 4, v: 1.55, ctx: "Après repas", h: 13, m: 0 },
  { daysAgo: 3, v: 1.45, ctx: "À jeun", h: 7, m: 30 },
  { daysAgo: 2, v: 1.72, ctx: "Après repas", h: 20, m: 0 },
  { daysAgo: 1, v: 1.22, ctx: "À jeun", h: 7, m: 30 },
  { daysAgo: 1, v: 1.72, ctx: "Après repas", h: 20, m: 0 },
  { daysAgo: 0, v: 1.45, ctx: "À jeun", h: 7, m: 30 },
].map(e => ({ id: id(), type: "glycemie" as const, value: e.v, context: e.ctx, at: at(e.daysAgo, e.h, e.m) }));

const tension: Measurement[] = [
  { id: id(), type: "tension", value: 132, diastolic: 85, context: "Matin", at: at(2, 8, 0) },
  { id: id(), type: "tension", value: 128, diastolic: 82, context: "Matin", at: at(0, 8, 0) },
];

const poids: Measurement[] = [
  { id: id(), type: "poids", value: 75.2, at: at(7, 7, 0) },
  { id: id(), type: "poids", value: 74.5, at: at(0, 7, 0) },
];

// Tous les médicaments pris, pour un jour donné.
const ALL_TAGS = ["med-amlodipine@08:00", "med-metformine@12:00", "med-losartan@20:00"];

function buildIntakeHistory(): Record<string, string[]> {
  const log: Record<string, string[]> = {};
  for (let d = 6; d >= 1; d--) {
    log[dateKey(new Date(Date.now() - d * DAY))] = [...ALL_TAGS];
  }
  log[dateKey()] = ["med-amlodipine@08:00"]; // aujourd'hui : partiel
  return log;
}

export function initialState(): AppState {
  return {
    profile: {
      firstName: "Kofi",
      lastName: "Amewoyi",
      age: "42",
      phone: "+228 90 23 45 67",
      sex: "Homme",
      pathologies: ["Hypertension", "Diabète type 2"],
      diseaseDetail: "Hypertension artérielle essentielle, diabète de type 2",
      doctor: "Dr. Ayeva Koffi",
      doctorFirstName: "Ayeva",
      doctorLastName: "Koffi",
      doctorProfession: "Cardiologue",
      doctorPhone: "+228 90 11 22 33",
      dataSharing: true,
      offlineMode: false,
      language: "Français",
      notifications: { rappels: true, alertes: true, conseils: true },
    },
    medications: [
      {
        id: "med-amlodipine", name: "Amlodipine 5mg", dose: "1 comprimé", category: "Antihypertenseur",
        color: "#1E7D5C", times: ["08:00"], prescriber: "Dr. Ayeva Koffi", since: "12 janv. 2025",
        frequencyUnit: "jour", lifelong: true,
        notice: "L'amlodipine est un antagoniste calcique utilisé pour traiter l'hypertension artérielle et l'angine de poitrine.",
      },
      {
        id: "med-metformine", name: "Metformine 500mg", dose: "1 comprimé", category: "Antidiabétique",
        color: "#2196F3", times: ["12:00"], prescriber: "Dr. Ayeva Koffi", since: "03 mars 2025",
        frequencyUnit: "jour", lifelong: true, instructions: "À prendre pendant le repas.",
        notice: "La metformine réduit la production de glucose par le foie et améliore la sensibilité à l'insuline.",
      },
      {
        id: "med-losartan", name: "Losartan 50mg", dose: "1 comprimé", category: "Antihypertenseur",
        color: "#FF9800", times: ["20:00"], prescriber: "Dr. Ayeva Koffi", since: "12 janv. 2025",
        frequencyUnit: "jour", lifelong: true,
        notice: "Le losartan est un antagoniste des récepteurs de l'angiotensine II, utilisé contre l'hypertension.",
      },
    ],
    // Historique des prises : 6 jours complets derrière + aujourd'hui partiel (1/3).
    // Donne un streak de 7 jours consécutifs.
    intakeLog: buildIntakeHistory(),
    measurements: [...glyc, ...tension, ...poids],
  };
}

/** Profil vierge pour un nouvel utilisateur, avec quelques valeurs par défaut. */
export function blankProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    firstName: "", lastName: "", age: "", phone: "", sex: "Homme",
    pathologies: [], doctor: undefined, dataSharing: true, offlineMode: false,
    language: "Français", notifications: { rappels: true, alertes: true, conseils: true },
    ...overrides,
  };
}

/** Nouvel utilisateur sans aucune donnée (médicaments/mesures vides). */
export function blankUser(overrides: Partial<Profile> = {}): AppState {
  return { profile: blankProfile(overrides), medications: [], intakeLog: {}, measurements: [] };
}

// ---- Patients de démonstration supplémentaires (pour l'espace médecin) ----
const MED_COLORS = ["#1E7D5C", "#2196F3", "#FF9800", "#43A047", "#E53935"];

interface PatientSpec {
  id: string; first: string; last: string; sex: string; age: string; phone: string;
  pathologies: string[]; disease?: string;
  glyc?: number; sys?: number; dia?: number; poids?: number;
  meds: [name: string, dose: string, category: string, time: string][];
  takenToday?: number;
}

const PATIENT_SPECS: PatientSpec[] = [
  { id: "p-afiwa", first: "Afiwa", last: "Dossou", sex: "Femme", age: "58", phone: "+228 90 12 34 56", pathologies: ["Hypertension"], sys: 132, dia: 85, poids: 68, meds: [["Amlodipine 5mg", "1 comprimé", "Antihypertenseur", "08:00"]], takenToday: 1 },
  { id: "p-yao", first: "Yao", last: "Kuma", sex: "Homme", age: "64", phone: "+228 91 22 33 44", pathologies: ["Diabète"], glyc: 1.95, poids: 80, meds: [["Metformine 500mg", "1 comprimé", "Antidiabétique", "12:00"], ["Glibenclamide 5mg", "1 comprimé", "Antidiabétique", "08:00"]], takenToday: 0 },
  { id: "p-ama", first: "Ama", last: "Mensah", sex: "Femme", age: "45", phone: "+228 90 55 66 77", pathologies: ["Hypertension", "Diabète"], sys: 145, dia: 92, glyc: 1.40, poids: 72, meds: [["Losartan 50mg", "1 comprimé", "Antihypertenseur", "20:00"], ["Metformine 500mg", "1 comprimé", "Antidiabétique", "12:00"]], takenToday: 1 },
  { id: "p-kossi", first: "Kossi", last: "Adjogah", sex: "Homme", age: "70", phone: "+228 92 11 00 22", pathologies: ["Hypertension"], sys: 162, dia: 100, poids: 75, meds: [["Amlodipine 5mg", "1 comprimé", "Antihypertenseur", "08:00"]], takenToday: 0 },
  { id: "p-akossiwa", first: "Akossiwa", last: "Lawson", sex: "Femme", age: "52", phone: "+228 90 33 22 11", pathologies: ["Diabète"], glyc: 1.35, poids: 64, meds: [["Metformine 500mg", "1 comprimé", "Antidiabétique", "12:00"]], takenToday: 1 },
  { id: "p-komla", first: "Komla", last: "Agbeko", sex: "Homme", age: "39", phone: "+228 93 44 55 66", pathologies: ["VIH"], poids: 70, meds: [["Ténofovir/Emtricitabine", "1 comprimé", "Antirétroviral", "20:00"]], takenToday: 1 },
  { id: "p-edem", first: "Edem", last: "Tamakloe", sex: "Homme", age: "61", phone: "+228 90 77 88 99", pathologies: ["Diabète"], glyc: 1.05, poids: 78, meds: [["Metformine 500mg", "1 comprimé", "Antidiabétique", "12:00"]], takenToday: 1 },
  { id: "p-sena", first: "Sena", last: "Bedi", sex: "Femme", age: "48", phone: "+228 91 00 11 22", pathologies: ["Tuberculose"], disease: "Tuberculose pulmonaire", poids: 60, meds: [["Rifampicine 150mg", "2 comprimés", "Antituberculeux", "08:00"]], takenToday: 0 },
  { id: "p-delali", first: "Délali", last: "Akakpo", sex: "Femme", age: "55", phone: "+228 90 66 55 44", pathologies: ["Hypertension"], sys: 128, dia: 80, poids: 66, meds: [["Amlodipine 5mg", "1 comprimé", "Antihypertenseur", "08:00"]], takenToday: 1 },
  { id: "p-mawuli", first: "Mawuli", last: "Sodji", sex: "Homme", age: "67", phone: "+228 92 33 44 55", pathologies: ["Hypertension", "Diabète"], sys: 138, dia: 88, glyc: 1.50, poids: 82, meds: [["Losartan 50mg", "1 comprimé", "Antihypertenseur", "20:00"], ["Metformine 500mg", "1 comprimé", "Antidiabétique", "12:00"]], takenToday: 2 },
];

function makePatient(s: PatientSpec): AppState {
  const meds: Medication[] = s.meds.map(([name, dose, category, time], i) => ({
    id: `${s.id}-med${i}`, name, dose, category, color: MED_COLORS[i % MED_COLORS.length],
    times: [time], frequencyUnit: "jour", lifelong: true, prescriber: "Dr. Ayeva Koffi",
  }));

  let mid = 0;
  const mkId = () => `${s.id}-m${mid++}`;
  const measurements: Measurement[] = [];
  if (s.glyc != null) {
    measurements.push({ id: mkId(), type: "glycemie", value: s.glyc, context: "À jeun", at: at(1, 7, 30) });
    measurements.push({ id: mkId(), type: "glycemie", value: s.glyc, context: "À jeun", at: at(0, 7, 30) });
  }
  if (s.sys != null) measurements.push({ id: mkId(), type: "tension", value: s.sys, diastolic: s.dia, context: "Matin", at: at(0, 8, 0) });
  if (s.poids != null) measurements.push({ id: mkId(), type: "poids", value: s.poids, at: at(0, 7, 0) });

  const intakeLog: Record<string, string[]> = {};
  if (s.takenToday && meds.length) {
    const tags = meds.flatMap(m => m.times.map(t => `${m.id}@${t}`));
    intakeLog[dateKey()] = tags.slice(0, s.takenToday);
  }

  return {
    profile: {
      firstName: s.first, lastName: s.last, age: s.age, phone: s.phone, sex: s.sex,
      pathologies: s.pathologies, diseaseDetail: s.disease,
      doctor: "Dr. Ayeva Koffi", doctorFirstName: "Ayeva", doctorLastName: "Koffi",
      doctorProfession: "Cardiologue", doctorPhone: "+228 90 11 22 33",
      dataSharing: true, offlineMode: false, language: "Français",
      notifications: { rappels: true, alertes: true, conseils: true },
    },
    medications: meds,
    intakeLog,
    measurements,
  };
}

/** État racine initial : compte démo Kofi + une dizaine de patients pour l'espace médecin. */
export function initialRoot(): RootState {
  const users: Record<string, AppState> = { [DEMO_USER_ID]: initialState() };
  for (const s of PATIENT_SPECS) users[s.id] = makePatient(s);
  return { currentUserId: DEMO_USER_ID, users };
}
