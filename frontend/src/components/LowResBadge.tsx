import { WarningIcon } from "./icons";

export function LowResBadge() {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "8px 12px",
        background: "rgba(33, 29, 20, 0.72)",
        borderRadius: 6,
        color: "#fff",
        maxWidth: "calc(100% - 20px)",
      }}
    >
      <WarningIcon size={16} />
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>Low resolution preview</div>
        <div style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.3 }}>Original image quality unaffected</div>
      </div>
    </div>
  );
}
