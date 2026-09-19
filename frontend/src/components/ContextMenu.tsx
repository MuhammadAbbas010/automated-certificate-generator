import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface ContextMenuItem {
  label: string;
  icon: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  title?: string;
  onClick: () => void;
}

export function ContextMenu({ x, y, items, onClose }: { x: number; y: number; items: ContextMenuItem[]; onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    // Any outside click (or a second right-click) dismisses the menu.
    window.addEventListener("click", onClose);
    window.addEventListener("contextmenu", onClose);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("click", onClose);
      window.removeEventListener("contextmenu", onClose);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const menuWidth = 180;
  const menuHeight = items.length * 38 + 8;
  const left = Math.min(Math.max(8, x), window.innerWidth - menuWidth - 8);
  const top = Math.min(Math.max(8, y), window.innerHeight - menuHeight - 8);

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        top,
        left,
        background: "var(--paper)",
        border: "1px solid var(--hairline-strong)",
        borderRadius: 6,
        boxShadow: "var(--shadow-2)",
        zIndex: 2000,
        minWidth: 168,
        overflow: "hidden",
        padding: "4px 0",
      }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            if (item.disabled) return;
            item.onClick();
            onClose();
          }}
          disabled={item.disabled}
          title={item.title}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "9px 14px",
            fontSize: 13,
            fontWeight: 500,
            textAlign: "left",
            background: "none",
            border: "none",
            color: item.disabled ? "var(--ink-muted)" : item.danger ? "var(--rust)" : "var(--ink)",
            opacity: item.disabled ? 0.55 : 1,
            cursor: item.disabled ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (item.disabled) return;
            e.currentTarget.style.background = item.danger ? "var(--rust-soft)" : "var(--cream-deep)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
          }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>,
    document.body
  );
}
