import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { GridIcon, PlusIcon, DocIcon, GearIcon, ChevronDown, ChevronRight, FolderIcon, EditIcon, TrashIcon } from "./icons";
import { AVATAR_GRADIENTS } from "../data/avatars";
import { useAuth } from "../context/AuthContext";
import { useCertificates } from "../context/CertificatesContext";
import { ContextMenu, type ContextMenuItem } from "./ContextMenu";

const NAV_ITEMS = [
  { path: "/new-certificate", label: "New Certificate", icon: PlusIcon },
  { path: "/templates", label: "Templates", icon: DocIcon },
  { path: "/settings", label: "Settings", icon: GearIcon },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { certId: activeCertId } = useParams();
  const { user, signOut } = useAuth();
  const { certificates, renameCertificate, deleteCertificate } = useCertificates();

  const [treeExpanded, setTreeExpanded] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [menu, setMenu] = useState<{ x: number; y: number; certId: string } | null>(null);

  const dashboardActive = location.pathname.startsWith("/dashboard");

  function openMenu(e: React.MouseEvent, certId: string) {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, certId });
  }

  function startRename(certId: string, currentName: string) {
    setRenamingId(certId);
    setRenameValue(currentName);
  }

  function commitRename() {
    if (renamingId) renameCertificate(renamingId, renameValue);
    setRenamingId(null);
  }

  function menuItems(certId: string): ContextMenuItem[] {
    const cert = certificates.find((c) => c.id === certId);
    return [
      {
        label: "Rename",
        icon: <EditIcon size={13} />,
        onClick: () => cert && startRename(certId, cert.name),
      },
      {
        label: "Delete",
        icon: <TrashIcon size={13} />,
        danger: true,
        onClick: () => {
          deleteCertificate(certId);
          if (activeCertId === certId) navigate("/dashboard");
        },
      },
    ];
  }

  return (
    <div
      style={{
        width: 232,
        flexShrink: 0,
        height: "100%",
        background: "var(--cream-deep)",
        borderRight: "1px solid var(--hairline)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 64,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 22px",
          borderBottom: "1px solid var(--hairline)",
          cursor: "pointer",
        }}
        onClick={() => navigate("/dashboard")}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: "'Source Serif 4',serif", color: "var(--cream)", fontSize: 12, fontWeight: 700 }}>S</span>
        </div>
        <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: 15, fontWeight: 600 }}>Seal</span>
      </div>

      <div style={{ flexGrow: 1, minHeight: 0, overflowY: "auto", padding: "14px 0" }}>
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <button className={`nav-item${dashboardActive ? " active" : ""}`} style={{ flexGrow: 1 }} onClick={() => navigate("/dashboard")}>
            <GridIcon size={16} />
            Dashboard
          </button>
          <button
            className="nav-item"
            style={{ width: 36, flexGrow: 0, justifyContent: "center", padding: 0 }}
            aria-label={treeExpanded ? "Collapse certificate list" : "Expand certificate list"}
            aria-expanded={treeExpanded}
            onClick={(e) => {
              e.stopPropagation();
              setTreeExpanded((v) => !v);
            }}
          >
            {treeExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        </div>

        {treeExpanded && (
          <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 2 }}>
            {certificates.length === 0 && (
              <div style={{ fontSize: 12, color: "var(--ink-muted)", padding: "6px 20px 6px 46px" }}>No certificates yet</div>
            )}
            {certificates.map((cert) => {
              const active = cert.id === activeCertId;
              if (renamingId === cert.id) {
                return (
                  <div key={cert.id} style={{ padding: "4px 20px 4px 46px" }}>
                    <input
                      type="text"
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      style={{ height: 28, fontSize: 12.5, padding: "0 8px" }}
                    />
                  </div>
                );
              }
              return (
                <button
                  key={cert.id}
                  className={`nav-item${active ? " active" : ""}`}
                  style={{ paddingLeft: 46, fontSize: 12.5, height: 34 }}
                  onClick={() => navigate(`/dashboard/${cert.id}`)}
                  onContextMenu={(e) => openMenu(e, cert.id)}
                  title={cert.name}
                >
                  <FolderIcon size={13} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cert.name}</span>
                </button>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 8, borderTop: "1px solid var(--hairline)", paddingTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <button key={path} className={`nav-item${location.pathname === path ? " active" : ""}`} onClick={() => navigate(path)}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          height: 60,
          borderTop: "1px solid var(--hairline)",
          background: "var(--cream-deep)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 20px",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: AVATAR_GRADIENTS[user?.avatarIndex ?? 0],
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user?.username ?? "Guest"}
        </span>
        <button
          className="btn-icon"
          style={{ width: 22, height: 22 }}
          aria-label="Sign out"
          onClick={() => {
            signOut();
            navigate("/login");
          }}
        >
          <ChevronDown size={12} />
        </button>
      </div>

      {menu && <ContextMenu x={menu.x} y={menu.y} items={menuItems(menu.certId)} onClose={() => setMenu(null)} />}
    </div>
  );
}
