// Planification des rappels de prise via les notifications locales (natif uniquement).
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import type { Medication } from "./store/types";

/**
 * Synchronise les rappels quotidiens avec la liste des médicaments.
 * - Une notification par horaire de prise, répétée chaque jour.
 * - Sur le web (aperçu), ne fait rien : la planification en arrière-plan
 *   n'est possible que dans l'application installée.
 */
export async function syncMedicationReminders(meds: Medication[], enabled: boolean): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== "granted") return;

    // Annule les rappels précédemment programmés.
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length) {
      await LocalNotifications.cancel({ notifications: pending.notifications.map(n => ({ id: n.id })) });
    }
    if (!enabled) return;

    let id = 1;
    const notifications = meds.flatMap(med =>
      med.times.map(time => {
        const [hour, minute] = time.split(":").map(Number);
        return {
          id: id++,
          title: "💊 Heure de prise !",
          body: `${med.name} — ${med.dose}`,
          schedule: { on: { hour, minute }, repeats: true },
          smallIcon: "ic_stat_icon_config_sample",
        };
      })
    );

    if (notifications.length) {
      await LocalNotifications.schedule({ notifications });
    }
  } catch {
    // Échec silencieux : ne jamais bloquer l'application à cause des notifications.
  }
}
