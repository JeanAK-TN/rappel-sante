// Modèle de données de Rappel Santé.

export interface Medication {
  id: string;
  name: string;        // ex. "Amlodipine 5mg"
  dose: string;        // ex. "1 comprimé"
  category: string;    // ex. "Antihypertenseur"
  color: string;       // couleur de la barre latérale
  times: string[];     // horaires de prise, ex. ["08:00", "20:00"]
  prescriber?: string; // ex. "Dr. Ayeva Koffi"
  since?: string;      // ex. "12 janv. 2025"
  notice?: string;     // texte de la notice
}

export type MeasureType = "glycemie" | "tension" | "poids";

export interface Measurement {
  id: string;
  type: MeasureType;
  value: number;        // glycémie (g/L), poids (kg), ou tension systolique (mmHg)
  diastolic?: number;   // tension diastolique (mmHg)
  context?: string;     // ex. "À jeun"
  at: number;           // horodatage (ms)
}

// Journal des prises : pour chaque date (YYYY-MM-DD), la liste des "medId@HH:MM" pris.
export interface IntakeLog {
  [dateKey: string]: string[];
}

export interface NotificationPrefs {
  rappels: boolean;
  alertes: boolean;
  conseils: boolean;
}

export interface Profile {
  firstName: string;
  lastName: string;
  age: string;
  phone: string;
  sex: string;
  pathologies: string[];
  doctor?: string;
  doctorPhone?: string;
  dataSharing: boolean;
  offlineMode: boolean;
  language: string;
  notifications: NotificationPrefs;
}

export interface AppState {
  profile: Profile;
  medications: Medication[];
  intakeLog: IntakeLog;
  measurements: Measurement[];
}

/** État racine : plusieurs utilisateurs, chacun avec ses propres données. */
export interface RootState {
  currentUserId: string | null;
  users: Record<string, AppState>;
}
