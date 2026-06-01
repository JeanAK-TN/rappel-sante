import { useEffect, useState } from "react";
import { ToastViewport } from "../ui/toast";

/**
 * Affiche un écran applicatif (toujours dessiné en 390x844) dans un cadre
 * façon téléphone. Sur desktop : cadre centré avec une légère bordure.
 * Sur petit écran : on réduit l'échelle pour que le téléphone tienne en hauteur.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function computeScale() {
      // marge verticale pour respirer autour du téléphone
      const available = window.innerHeight - 32;
      const next = Math.min(1, available / 844);
      setScale(next);
    }
    computeScale();
    window.addEventListener("resize", computeScale);
    return () => window.removeEventListener("resize", computeScale);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0F172A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 390 * scale,
          height: 844 * scale,
        }}
      >
        <div
          style={{
            width: 390,
            height: 844,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            borderRadius: 36,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
            border: "2px solid #1e293b",
            background: "#F4F6F7",
          }}
        >
          {children}
          <ToastViewport />
        </div>
      </div>
    </div>
  );
}
