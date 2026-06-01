import { Settings, ChevronRight, Globe, Bell, Wifi, LogOut, HelpCircle, Info, Share2 } from "lucide-react";
import { useNavigate } from "react-router";
import { StatusBar } from "../StatusBar";
import { BottomNav } from "../BottomNav";
import { useStore } from "../../store/AppStore";

const menuItems = [
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#607D8B" strokeWidth="1.8" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#607D8B" strokeWidth="1.8" strokeLinecap="round" /></svg>, label: "Mes informations personnelles" },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#607D8B" /></svg>, label: "Mes pathologies" },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#607D8B" strokeWidth="1.8" /><path d="M12 8v4l3 3" stroke="#607D8B" strokeWidth="1.8" strokeLinecap="round" /></svg>, label: "Mon médecin traitant" },
  { icon: <Share2 size={18} color="#607D8B" />, label: "Partage de données", toggleKey: "dataSharing" as const },
  { icon: <Bell size={18} color="#607D8B" />, label: "Notifications" },
  { icon: <Globe size={18} color="#607D8B" />, label: "Langue", value: "Français" },
  { icon: <Wifi size={18} color="#607D8B" />, label: "Mode hors ligne", toggleKey: "offlineMode" as const },
  { icon: <HelpCircle size={18} color="#607D8B" />, label: "Aide & Support" },
  { icon: <Info size={18} color="#607D8B" />, label: "À propos de Rappel Santé" },
];

export function ProfileScreen() {
  const store = useStore();
  const navigate = useNavigate();
  const { profile } = store.state;
  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div style={{ width: 390, height: 844, background: "#F4F6F7", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "#FFFFFF" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1A2E3B" }}>Mon Profil</div>
          <Settings size={22} color="#607D8B" />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 90 }}>
        {/* Profile card */}
        <div style={{ background: "#FFFFFF", padding: "20px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, background: "#1E7D5C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>{initials}</span>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1A2E3B" }}>{profile.firstName} {profile.lastName}</div>
            <div style={{ fontSize: 13, color: "#607D8B", marginBottom: 8 }}>{profile.age} ans · {profile.phone}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {profile.pathologies.map(p => (
                <div key={p} style={{ padding: "3px 10px", background: "#D6EFE6", borderRadius: 20 }}>
                  <span style={{ fontSize: 11, color: "#1E7D5C", fontWeight: 600 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div style={{ margin: "16px 0" }}>
          <div style={{ background: "#FFFFFF", borderRadius: 16, marginInline: 20, overflow: "hidden", boxShadow: "0px 2px 12px rgba(0,0,0,0.06)" }}>
            {menuItems.map((item, i) => {
              const toggleOn = item.toggleKey ? profile[item.toggleKey] : false;
              return (
                <div key={i} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, borderBottom: i < menuItems.length - 1 ? "1px solid #F4F6F7" : "none" }}>
                  <div style={{ width: 22, display: "flex", justifyContent: "center" }}>{item.icon}</div>
                  <div style={{ flex: 1, fontSize: 14, color: "#1A2E3B" }}>{item.label}</div>
                  {item.toggleKey ? (
                    <div
                      onClick={() => store.updateProfile({ [item.toggleKey]: !toggleOn })}
                      style={{
                        width: 44, height: 24, borderRadius: 12,
                        background: toggleOn ? "#1E7D5C" : "#D1D5DB",
                        position: "relative", cursor: "pointer", transition: "background 0.2s",
                      }}
                    >
                      <div style={{
                        position: "absolute", top: 3,
                        left: toggleOn ? 23 : 3,
                        width: 18, height: 18, borderRadius: "50%", background: "#FFFFFF", transition: "left 0.2s",
                      }} />
                    </div>
                  ) : item.value ? (
                    <span style={{ fontSize: 13, color: "#607D8B" }}>{item.value}</span>
                  ) : (
                    <ChevronRight size={16} color="#B2CEBF" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div style={{ marginInline: 20 }}>
          <div
            onClick={() => navigate("/")}
            style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0px 2px 12px rgba(0,0,0,0.06)", cursor: "pointer" }}
          >
            <LogOut size={18} color="#E53935" />
            <span style={{ fontSize: 14, color: "#E53935", fontWeight: 600 }}>Se déconnecter</span>
          </div>
        </div>
      </div>

      <BottomNav active={4} />
    </div>
  );
}
