// Seuils médicaux, statuts colorés et utilitaires de présentation.
import type { MeasureType, Measurement, IntakeLog, Medication } from "./types";

/** Libellé de fréquence, ex. "2 fois par jour" / "1 fois par mois". */
export function frequencyLabel(med: Pick<Medication, "times" | "frequencyUnit">): string {
  const n = Math.max(1, med.times.length);
  const unit = med.frequencyUnit ?? "jour";
  return `${n} fois par ${unit}`;
}

/** Libellé de durée, ex. "À vie" / "Pendant 6 mois" / "Non précisée". */
export function durationLabel(med: Pick<Medication, "lifelong" | "durationValue" | "durationUnit">): string {
  if (med.lifelong) return "À vie";
  if (med.durationValue && med.durationUnit) return `Pendant ${med.durationValue} ${med.durationUnit}`;
  return "Non précisée";
}

export type HealthStatus = "normal" | "warning" | "critical";

export const STATUS_COLOR: Record<HealthStatus, string> = {
  normal: "#43A047",
  warning: "#FF9800",
  critical: "#E53935",
};

export const MEASURE_META: Record<MeasureType, { label: string; unit: string; criticalHigh: number }> = {
  glycemie: { label: "Glycémie", unit: "g/L", criticalHigh: 1.8 },
  tension: { label: "Tension", unit: "mmHg", criticalHigh: 160 },
  poids: { label: "Poids", unit: "kg", criticalHigh: Infinity },
};

/** Statut coloré d'une mesure selon son type. */
export function statusOf(type: MeasureType, value: number): HealthStatus {
  if (type === "glycemie") {
    if (value > 1.6) return "critical";
    if (value > 1.1 || value < 0.7) return "warning";
    return "normal";
  }
  if (type === "tension") {
    // value = systolique
    if (value >= 160) return "critical";
    if (value >= 130) return "warning";
    return "normal";
  }
  return "normal"; // poids : pas de seuil
}

/** Une mesure dépasse-t-elle le seuil critique (déclenche l'alerte) ? */
export function isCritical(type: MeasureType, value: number): boolean {
  return value >= MEASURE_META[type].criticalHigh;
}

/** Affichage d'une valeur de mesure (gère la tension systolique/diastolique). */
export function formatValue(m: Pick<Measurement, "type" | "value" | "diastolic">): string {
  if (m.type === "tension") return `${m.value}/${m.diastolic ?? "-"}`;
  if (m.type === "glycemie") return m.value.toFixed(2);
  return String(m.value);
}

/** Clé de date locale au format YYYY-MM-DD. */
export function dateKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Libellé relatif "Aujourd'hui, 07:30" / "Hier, 20:00" / "Lun 19 mai, 07:30". */
export function relativeLabel(at: number): string {
  const d = new Date(at);
  const heure = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const today = dateKey();
  const yesterday = dateKey(new Date(Date.now() - 86400000));
  if (dateKey(d) === today) return `Aujourd'hui, ${heure}`;
  if (dateKey(d) === yesterday) return `Hier, ${heure}`;
  const court = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  return `${court}, ${heure}`;
}

/** Nombre de jours consécutifs (jusqu'à aujourd'hui) avec au moins une prise. */
export function computeStreak(log: IntakeLog): number {
  let streak = 0;
  const cursor = new Date();
  // Si aujourd'hui n'a aucune prise, on compte à partir d'hier.
  if (!(log[dateKey(cursor)]?.length)) cursor.setDate(cursor.getDate() - 1);
  while ((log[dateKey(cursor)]?.length ?? 0) > 0) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export type DayCompletion = "full" | "partial" | "none";

/** Complétude des prises pour une date donnée. */
export function dayCompletion(log: IntakeLog, day: Date, totalPerDay: number): DayCompletion {
  const count = log[dateKey(day)]?.length ?? 0;
  if (totalPerDay > 0 && count >= totalPerDay) return "full";
  if (count > 0) return "partial";
  return "none";
}

/** Min / moyenne / max d'une série de valeurs. */
export function minAvgMax(values: number[]): { min: number; avg: number; max: number } {
  if (values.length === 0) return { min: 0, avg: 0, max: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return { min, avg, max };
}
