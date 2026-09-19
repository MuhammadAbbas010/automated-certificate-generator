import { Sidebar } from "../components/Sidebar";
import { SidebarDrawer } from "../components/SidebarDrawer";
import { MenuIcon } from "../components/icons";
import { useIsMobile } from "../lib/useIsMobile";
import { useMobileDrawer } from "../lib/useMobileDrawer";

export function PlaceholderPage({ title }: { title: string }) {
  const isMobile = useIsMobile();
  const drawer = useMobileDrawer();

  return (
    <div style={{ width: "100%", height: "100vh", background: "var(--cream)", display: "flex", overflow: "hidden" }}>
      {isMobile ? (
        <SidebarDrawer open={drawer.open} onClose={drawer.close}>
          <Sidebar />
        </SidebarDrawer>
      ) : (
        <Sidebar />
      )}
      <div style={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {isMobile && (
          <div style={{ height: 56, flexShrink: 0, borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", padding: "0 14px" }}>
            <button className="btn-icon" aria-label="Open menu" onClick={drawer.toggle}>
              <MenuIcon size={18} />
            </button>
          </div>
        )}
        <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "var(--ink-muted)" }}>
            <h1 style={{ fontSize: 22, color: "var(--ink)", marginBottom: 8 }}>{title}</h1>
            <div style={{ fontSize: 13.5 }}>Not built yet.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
