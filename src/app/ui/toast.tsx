import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CheckCircle, Info, AlertTriangle } from "lucide-react";

type ToastKind = "success" | "info" | "warning";
interface Toast { id: number; message: string; kind: ToastKind; }

interface ToastApi {
  show: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

// État partagé via un simple module pour que le viewport (dans le PhoneFrame)
// et les écrans accèdent à la même file.
let counter = 0;
const listeners = new Set<(toasts: Toast[]) => void>();
let toasts: Toast[] = [];

function emit() {
  listeners.forEach(l => l(toasts));
}

function pushToast(message: string, kind: ToastKind) {
  const id = ++counter;
  toasts = [...toasts, { id, message, kind }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id);
    emit();
  }, 2600);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const show = useCallback((message: string, kind: ToastKind = "success") => pushToast(message, kind), []);
  return <ToastContext.Provider value={{ show }}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé dans <ToastProvider>");
  return ctx;
}

const STYLES: Record<ToastKind, { bg: string; color: string; icon: React.ReactNode }> = {
  success: { bg: "#1E7D5C", color: "#FFFFFF", icon: <CheckCircle size={18} color="#FFFFFF" /> },
  info: { bg: "#1A2E3B", color: "#FFFFFF", icon: <Info size={18} color="#FFFFFF" /> },
  warning: { bg: "#FF9800", color: "#FFFFFF", icon: <AlertTriangle size={18} color="#FFFFFF" /> },
};

/** Pile de toasts positionnée au bas du téléphone (dans le PhoneFrame). */
export function ToastViewport() {
  const [items, setItems] = useState<Toast[]>(toasts);
  useEffect(() => {
    listeners.add(setItems);
    return () => { listeners.delete(setItems); };
  }, []);

  return (
    <div style={{ position: "absolute", left: 16, right: 16, bottom: 96, display: "flex", flexDirection: "column", gap: 8, zIndex: 50, pointerEvents: "none" }}>
      {items.map(t => {
        const s = STYLES[t.kind];
        return (
          <div key={t.id} style={{
            background: s.bg, color: s.color, borderRadius: 12, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500,
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)", animation: "rs-toast-in 0.2s ease",
          }}>
            {s.icon}
            <span>{t.message}</span>
          </div>
        );
      })}
      <style>{`@keyframes rs-toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
