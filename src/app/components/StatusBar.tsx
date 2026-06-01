import { Wifi, Battery, Signal } from "lucide-react";
import { Capacitor } from "@capacitor/core";

export function StatusBar({ dark = false }: { dark?: boolean }) {
  // Sur un vrai téléphone (app native), Android/iOS affiche déjà sa propre
  // barre de statut : on n'affiche pas la fausse pour éviter le doublon/chevauchement.
  // On garde un petit espace de sécurité (zone d'encoche) à la place.
  if (Capacitor.isNativePlatform()) {
    return <div style={{ height: "env(safe-area-inset-top, 0px)" }} />;
  }

  const color = dark ? "#FFFFFF" : "#1A2E3B";
  return (
    <div style={{
      height: 44, paddingInline: 20, display: "flex", alignItems: "center",
      justifyContent: "space-between", background: "transparent",
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color }}>9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Signal size={14} color={color} />
        <Wifi size={14} color={color} />
        <Battery size={14} color={color} />
      </div>
    </div>
  );
}
