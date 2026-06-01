import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ToastViewport } from "../ui/toast";

const TOOLBAR_H = 48;
const MARGIN = 20;

/**
 * Affiche un écran applicatif (toujours dessiné en 390x844) dans un cadre
 * façon téléphone, avec une barre permettant de revenir à la landing page.
 * L'échelle s'ajuste pour que le téléphone tienne toujours à l'écran (mobile inclus).
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function computeScale() {
      const available = window.innerHeight - TOOLBAR_H - MARGIN;
      setScale(Math.min(1, available / 844));
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
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Barre : retour au site */}
      <div style={{ height: TOOLBAR_H, flexShrink: 0, display: "flex", alignItems: "center", paddingInline: 12 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
            color: "#E2E8F0", borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <ArrowLeft size={16} color="#E2E8F0" />
          Retour au site
        </button>
      </div>

      {/* Téléphone centré */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 390 * scale, height: 844 * scale }}>
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
    </div>
  );
}
