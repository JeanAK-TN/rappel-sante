// Données de départ : reproduisent les maquettes pour une première ouverture réaliste.
import type { AppState, Measurement } from "./types";
import { dateKey } from "./health";

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
      doctor: "Dr. Ayeva Koffi",
      dataSharing: true,
      offlineMode: false,
    },
    medications: [
      {
        id: "med-amlodipine", name: "Amlodipine 5mg", dose: "1 comprimé", category: "Antihypertenseur",
        color: "#1E7D5C", times: ["08:00"], prescriber: "Dr. Ayeva Koffi", since: "12 janv. 2025",
        notice: "L'amlodipine est un antagoniste calcique utilisé pour traiter l'hypertension artérielle et l'angine de poitrine.",
      },
      {
        id: "med-metformine", name: "Metformine 500mg", dose: "1 comprimé", category: "Antidiabétique",
        color: "#2196F3", times: ["12:00"], prescriber: "Dr. Ayeva Koffi", since: "03 mars 2025",
        notice: "La metformine réduit la production de glucose par le foie et améliore la sensibilité à l'insuline.",
      },
      {
        id: "med-losartan", name: "Losartan 50mg", dose: "1 comprimé", category: "Antihypertenseur",
        color: "#FF9800", times: ["20:00"], prescriber: "Dr. Ayeva Koffi", since: "12 janv. 2025",
        notice: "Le losartan est un antagoniste des récepteurs de l'angiotensine II, utilisé contre l'hypertension.",
      },
    ],
    // Historique des prises : 6 jours complets derrière + aujourd'hui partiel (1/3).
    // Donne un streak de 7 jours consécutifs.
    intakeLog: buildIntakeHistory(),
    measurements: [...glyc, ...tension, ...poids],
  };
}
