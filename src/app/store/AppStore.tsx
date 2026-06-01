import { createContext, useContext, useEffect, useState } from "react";
import type { AppState, RootState, Medication, Measurement, Profile } from "./types";
import { dateKey } from "./health";
import { initialRoot, blankUser } from "./seed";

const STORAGE_KEY = "rappel-sante:v2";

function loadRoot(): RootState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as RootState;
  } catch {
    // stockage illisible : on repart des données de départ
  }
  return initialRoot();
}

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface StoreApi {
  state: AppState;            // données de l'utilisateur courant
  currentUserId: string | null;
  // Comptes
  usersList(): UserSummary[];
  createUser(profile: Partial<Profile>): string;
  switchUser(id: string): void;
  logout(): void;
  // Médicaments
  addMedication(input: Omit<Medication, "id">): void;
  updateMedication(id: string, patch: Partial<Omit<Medication, "id">>): void;
  removeMedication(id: string): void;
  toggleIntake(medId: string, time: string): void;
  isTaken(medId: string, time: string): boolean;
  takenCountToday(): { done: number; total: number };
  // Mesures
  addMeasurement(input: Omit<Measurement, "id">): Measurement;
  removeMeasurement(id: string): void;
  measurementsOf(type: Measurement["type"]): Measurement[];
  // Profil
  updateProfile(patch: Partial<Profile>): void;
  // Côté médecin : agit sur un patient précis
  getUser(id: string): AppState | undefined;
  addMedicationFor(userId: string, input: Omit<Medication, "id">): void;
  removeMedicationFor(userId: string, id: string): void;
  measurementsForUser(userId: string, type: Measurement["type"]): Measurement[];
  takenCountFor(userId: string): { done: number; total: number };
  // Divers
  resetAll(): void;
}

const StoreContext = createContext<StoreApi | null>(null);

const EMPTY: AppState = blankUser();

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [root, setRoot] = useState<RootState>(loadRoot);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
    } catch {
      // quota dépassé ou mode privé : on ignore
    }
  }, [root]);

  const uid = root.currentUserId;
  const state: AppState = (uid && root.users[uid]) ? root.users[uid] : EMPTY;

  // Applique une transformation aux données de l'utilisateur courant.
  function updateCurrent(fn: (s: AppState) => AppState) {
    setRoot(r => {
      if (!r.currentUserId) return r;
      const cur = r.users[r.currentUserId];
      if (!cur) return r;
      return { ...r, users: { ...r.users, [r.currentUserId]: fn(cur) } };
    });
  }

  // Applique une transformation aux données d'un patient précis (côté médecin).
  function updateUser(userId: string, fn: (s: AppState) => AppState) {
    setRoot(r => {
      const u = r.users[userId];
      if (!u) return r;
      return { ...r, users: { ...r.users, [userId]: fn(u) } };
    });
  }

  const api: StoreApi = {
    state,
    currentUserId: uid,

    usersList() {
      return Object.entries(root.users).map(([id, s]) => ({
        id, firstName: s.profile.firstName, lastName: s.profile.lastName, phone: s.profile.phone,
      }));
    },

    createUser(profile) {
      const id = `user-${Date.now()}`;
      setRoot(r => ({ ...r, currentUserId: id, users: { ...r.users, [id]: blankUser(profile) } }));
      return id;
    },

    switchUser(id) {
      setRoot(r => (r.users[id] ? { ...r, currentUserId: id } : r));
    },

    logout() {
      setRoot(r => ({ ...r, currentUserId: null }));
    },

    addMedication(input) {
      const med: Medication = { ...input, id: `med-${Date.now()}` };
      updateCurrent(s => ({ ...s, medications: [...s.medications, med] }));
    },

    updateMedication(id, patch) {
      updateCurrent(s => ({ ...s, medications: s.medications.map(m => m.id === id ? { ...m, ...patch } : m) }));
    },

    removeMedication(id) {
      updateCurrent(s => ({ ...s, medications: s.medications.filter(m => m.id !== id) }));
    },

    toggleIntake(medId, time) {
      const key = dateKey();
      const tag = `${medId}@${time}`;
      updateCurrent(s => {
        const today = s.intakeLog[key] ?? [];
        const next = today.includes(tag) ? today.filter(t => t !== tag) : [...today, tag];
        return { ...s, intakeLog: { ...s.intakeLog, [key]: next } };
      });
    },

    isTaken(medId, time) {
      const today = state.intakeLog[dateKey()] ?? [];
      return today.includes(`${medId}@${time}`);
    },

    takenCountToday() {
      const today = state.intakeLog[dateKey()] ?? [];
      const total = state.medications.reduce((n, m) => n + m.times.length, 0);
      return { done: today.length, total };
    },

    addMeasurement(input) {
      const m: Measurement = { ...input, id: `m-${Date.now()}-${Math.round(Math.random() * 1000)}` };
      updateCurrent(s => ({ ...s, measurements: [...s.measurements, m] }));
      return m;
    },

    removeMeasurement(id) {
      updateCurrent(s => ({ ...s, measurements: s.measurements.filter(m => m.id !== id) }));
    },

    measurementsOf(type) {
      return state.measurements.filter(m => m.type === type).sort((a, b) => a.at - b.at);
    },

    updateProfile(patch) {
      updateCurrent(s => ({ ...s, profile: { ...s.profile, ...patch } }));
    },

    getUser(id) {
      return root.users[id];
    },

    addMedicationFor(userId, input) {
      const med: Medication = { ...input, id: `med-${Date.now()}` };
      updateUser(userId, s => ({ ...s, medications: [...s.medications, med] }));
    },

    removeMedicationFor(userId, id) {
      updateUser(userId, s => ({ ...s, medications: s.medications.filter(m => m.id !== id) }));
    },

    measurementsForUser(userId, type) {
      const u = root.users[userId];
      if (!u) return [];
      return u.measurements.filter(m => m.type === type).sort((a, b) => a.at - b.at);
    },

    takenCountFor(userId) {
      const u = root.users[userId];
      if (!u) return { done: 0, total: 0 };
      const today = u.intakeLog[dateKey()] ?? [];
      const total = u.medications.reduce((n, m) => n + m.times.length, 0);
      return { done: today.length, total };
    },

    resetAll() {
      setRoot(initialRoot());
    },
  };

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore doit être utilisé dans <AppStoreProvider>");
  return ctx;
}
