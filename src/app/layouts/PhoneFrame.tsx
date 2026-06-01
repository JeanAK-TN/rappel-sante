import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ToastViewport } from "../ui/toast";

const TOOLBAR_H = 48;
const MARGIN = 20;
const MOBILE_MAX = 640;

/**
 * Affiche un écran applicatif (toujours dessiné en 390x844).
 * - Desktop : dans un cadre façon téléphone, sur fond décoré, avec retour au site.
 * - Mobile (écran étroit) : plein écran, sans bezel, comme une vraie application,
 *   avec un petit bouton flottant de retour à la landing.
 * L'écran 390x844 a quasiment le ratio d'un téléphone : il remplit donc l'écran.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function compute() {
      const w = window.innerWidth;
      setVw(w);
      if (w <= MOBILE_MAX) {
        setScale(w / 390); // remplit la largeur
      } else {
        const available = window.innerHeight - TOOLBAR_H - MARGIN;
        setScale(Math.min(1, available / 844));
      }
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const isMobile = vw <= MOBILE_MAX;

  // ---- Mode mobile : plein écran ----
  if (isMobile) {
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: "#F4F6F7", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
        <button
          onClick={() => navigate("/")}
          aria-label="Retour au site"
          style={{
            position: "fixed", top: 10, left: 10, zIndex: 100, width: 36, height: 36, borderRadius: "50%",
            background: "rgba(15,23,42,0.55)", border: "1px solid rgba(255,255,255,0.18)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)",
          }}
        >
          <ArrowLeft size={18} color="#FFFFFF" />
        </button>
        <div style={{ width: 390 * scale, height: 844 * scale, margin: "0 auto" }}>
          <div style={{ width: 390, height: 844, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative", overflow: "hidden", background: "#F4F6F7" }}>
            {children}
            <ToastViewport />
          </div>
        </div>
      </div>
    );
  }

  // ---- Mode desktop : cadre téléphone décoré ----
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(160deg, #0B1220 0%, #0F172A 55%, #0C1A16 100%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{BACKDROP_CSS}</style>

      {/* Décor : halos médicaux + grille numérique + particules (non interactif) */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background:
            "radial-gradient(820px 520px at 14% 8%, rgba(30,125,92,0.28), transparent 60%)," +
            "radial-gradient(680px 520px at 88% 92%, rgba(33,150,243,0.16), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(circle at 50% 40%, #000 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 40%, #000 0%, transparent 75%)",
        }}
      />
      {[
        { t: "16%", l: "9%", s: 8, d: 0 }, { t: "72%", l: "12%", s: 5, d: 1.4 },
        { t: "26%", l: "90%", s: 7, d: 0.7 }, { t: "80%", l: "86%", s: 9, d: 2 },
        { t: "50%", l: "6%", s: 4, d: 1.1 }, { t: "60%", l: "94%", s: 5, d: 0.4 },
      ].map((p, i) => (
        <span key={i} aria-hidden style={{
          position: "absolute", top: p.t, left: p.l, width: p.s, height: p.s, borderRadius: "50%",
          background: "rgba(120,200,170,0.5)", boxShadow: "0 0 10px rgba(120,200,170,0.5)",
          zIndex: 0, pointerEvents: "none", animation: `pf-float 7s ease-in-out ${p.d}s infinite`,
        }} />
      ))}

      {/* Barre : retour au site */}
      <div style={{ height: TOOLBAR_H, flexShrink: 0, display: "flex", alignItems: "center", paddingInline: 12, position: "relative", zIndex: 2 }}>
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
      <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
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

const BACKDROP_CSS = `@keyframes pf-float { 0%,100% { transform: translateY(0); opacity:.55; } 50% { transform: translateY(-14px); opacity:1; } }`;
