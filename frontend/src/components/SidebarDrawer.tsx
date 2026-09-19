import { createPortal } from "react-dom";
import { useEffect, type ReactNode } from "react";

export function SidebarDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(33, 29, 20, 0.5)" }} />
      <div
        style={{
          position: "relative",
          width: 264,
          maxWidth: "82vw",
          height: "100%",
          boxShadow: "var(--shadow-2)",
          animation: "seal-drawer-in 200ms ease-out",
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes seal-drawer-in {
          from { transform: translateX(-12px); opacity: 0.6; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
}
