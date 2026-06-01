interface ScreenFrameProps {
  children: React.ReactNode;
  label: string;
  scale?: number;
}

export function ScreenFrame({ children, label, scale = 0.48 }: ScreenFrameProps) {
  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
      <div
        style={{
          width: 390 * scale,
          height: 844 * scale,
          position: "relative",
          borderRadius: 36 * scale,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
          border: "2px solid #e2e8f0",
          background: "#F4F6F7",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 390,
            height: 844,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {children}
        </div>
      </div>
      <span style={{ fontSize: 11, color: "#607D8B", fontWeight: 500, fontFamily: "Inter, sans-serif", textAlign: "center", maxWidth: 390 * scale }}>
        {label}
      </span>
    </div>
  );
}
