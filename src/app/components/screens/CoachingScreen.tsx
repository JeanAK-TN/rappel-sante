import { Play, AlertTriangle, CheckCircle } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { BottomNav } from "../BottomNav";

export function CoachingScreen() {
  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "#FFFFFF" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 0" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Mon Coaching</div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", paddingInline: 20, marginTop: 16, borderBottom: "1px solid #F4F6F7" }}>
          {["Nutrition", "Sport", "Prévention"].map((tab, i) => (
            <div key={tab} style={{
              paddingInline: 14, paddingBlock: 12,
              borderBottom: i === 0 ? "2px solid #1E7D5C" : "2px solid transparent",
              fontSize: 14, fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? "#1E7D5C" : "#607D8B",
            }}>{tab}</div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Plan du jour */}
        <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>VOTRE PLAN DU JOUR</div>

        {/* Recipe cards */}
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { name: "Bouillie de mil", tag: "Diabète adapté", cal: "280 kcal", color: "#E8F5E9" },
            { name: "Sauté de légumes", tag: "Faible index glycémique", cal: "190 kcal", color: "#E3F2FD" },
          ].map((recipe, i) => (
            <div key={i} style={{ flex: 1, background: "#FFFFFF", borderRadius: 16, overflow: "hidden", boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
              <div style={{ height: 90, background: recipe.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 2 4 6 4 11c0 4 2.5 7.5 6 9v2h4v-2c3.5-1.5 6-5 6-9 0-5-4-9-8-9z" fill="#1E7D5C" opacity="0.3" stroke="#1E7D5C" strokeWidth="1.5" /></svg>
              </div>
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A2E3B" }}>{recipe.name}</div>
                <div style={{ padding: "2px 8px", background: "#D6EFE6", borderRadius: 10, display: "inline-block", marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: "#1E7D5C", fontWeight: 600 }}>{recipe.tag}</span>
                </div>
                <div style={{ fontSize: 11, color: "#607D8B", marginTop: 6 }}>{recipe.cal}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Conseils */}
        <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>CONSEILS ALIMENTAIRES</div>
        {[
          { title: "Limitez le riz blanc", body: "Remplacez par du riz brun ou du mil pour réduire l'index glycémique.", tag: "Nutrition" },
          { title: "Hydratation", body: "Buvez au moins 1.5L d'eau par jour. Évitez les sodas et jus sucrés.", tag: "Prévention" },
        ].map((tip, i) => (
          <div key={i} style={{ background: "#D6EFE6", borderRadius: 16, padding: 16, borderLeft: "4px solid #1E7D5C", display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1A2E3B" }}>{tip.title}</span>
                <div style={{ padding: "2px 8px", background: "#1E7D5C", borderRadius: 10, marginLeft: "auto" }}>
                  <span style={{ fontSize: 10, color: "#FFFFFF", fontWeight: 600 }}>{tip.tag}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#607D8B", lineHeight: 1.5 }}>{tip.body}</div>
            </div>
          </div>
        ))}

        {/* Programme sport */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 16, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1A2E3B" }}>Programme du jour</div>
              <div style={{ fontSize: 13, color: "#607D8B" }}>30 min · Intensité légère</div>
            </div>
            <div style={{ padding: "6px 14px", background: "#D6EFE6", borderRadius: 20 }}>
              <span style={{ fontSize: 12, color: "#1E7D5C", fontWeight: 600 }}>Légère</span>
            </div>
          </div>
          <button style={{ width: "100%", height: 44, background: "#1E7D5C", border: "none", borderRadius: 10, color: "#FFFFFF", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Play size={16} color="#FFFFFF" />
            Commencer la séance
          </button>
        </div>

        {/* Alertes prévention */}
        <div style={{ fontSize: 12, color: "#607D8B", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>ALERTES & CONSEILS</div>
        <div style={{ background: "#FFF3E0", borderRadius: 16, padding: 16, display: "flex", gap: 12 }}>
          <AlertTriangle size={20} color="#FF9800" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "#1A2E3B", lineHeight: 1.5 }}>Votre glycémie est légèrement élevée ce matin. Évitez les sucres rapides au déjeuner.</div>
        </div>
        <div style={{ background: "#E8F5E9", borderRadius: 16, padding: 16, display: "flex", gap: 12 }}>
          <CheckCircle size={20} color="#43A047" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "#1A2E3B", lineHeight: 1.5 }}>Votre tension est stable depuis 5 jours. Continuez ainsi !</div>
        </div>
      </div>

      <BottomNav active={3} />
    </div>
  );
}
