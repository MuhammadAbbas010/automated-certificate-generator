import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "./icons";

export function Modal({ onClose, children, labelledBy }: { onClose: () => void; children: ReactNode; labelledBy?: string }) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(33, 29, 20, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "var(--paper)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          boxShadow: "var(--shadow-2)",
          maxWidth: 560,
          width: "100%",
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          padding: 28,
        }}
      >
        <button
          className="btn-icon"
          aria-label="Close"
          onClick={onClose}
          style={{ position: "absolute", top: 14, left: 14, background: "var(--cream-deep)" }}
        >
          <XIcon size={13} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
