import { createContext, useContext, useEffect, useState } from "react";
import type { AppState, Medication, Measurement, Profile } from "./types";
import { dateKey } from "./health";
import { initialState } from "./seed";

const STORAGE_KEY = "rappel-sante:v1";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    // stockage illisible : on repart des données de départ
  }
  return initialState();
}

interface StoreApi {
  state: AppState;
  // Médicaments
  addMedication(input: Omit<Medication, "id">): void;
  toggleIntake(medId: string, time: string): void;
  isTaken(medId: string, time: string): boolean;
  takenCountToday(): { done: number; total: number };
  // Mesures
  addMeasurement(input: Omit<Measurement, "id">): Measurement;
  measurementsOf(type: Measurement["type"]): Measurement[];
  // Profil
  updateProfile(patch: Partial<Profile>): void;
  // Divers
  resetAll(): void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  // Persiste à chaque changement.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // quota dépassé ou mode privé : on ignore
    }
  }, [state]);

  const api: StoreApi = {
    state,

    addMedication(input) {
      const med: Medication = { ...input, id: `med-${Date.now()}` };
      setState(s => ({ ...s, medications: [...s.medications, med] }));
    },

    toggleIntake(medId, time) {
      const key = dateKey();
      const tag = `${medId}@${time}`;
      setState(s => {
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
      const m: Measurement = { ...input, id: `m-${Date.now()}` };
      setState(s => ({ ...s, measurements: [...s.measurements, m] }));
      return m;
    },

    measurementsOf(type) {
      return state.measurements
        .filter(m => m.type === type)
        .sort((a, b) => a.at - b.at);
    },

    updateProfile(patch) {
      setState(s => ({ ...s, profile: { ...s.profile, ...patch } }));
    },

    resetAll() {
      setState(initialState());
    },
  };

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore doit être utilisé dans <AppStoreProvider>");
  return ctx;
}
