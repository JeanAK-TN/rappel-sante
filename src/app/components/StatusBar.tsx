import { Wifi, Battery, Signal } from "lucide-react";

export function StatusBar({ dark = false }: { dark?: boolean }) {
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
