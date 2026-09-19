import { useNavigate, useLocation } from "react-router-dom";
import { GridIcon, PlusIcon, DocIcon, GearIcon, ChevronDown } from "./icons";
import { AVATAR_GRADIENTS } from "../data/avatars";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: GridIcon },
  { path: "/new-certificate", label: "New Certificate", icon: PlusIcon },
  { path: "/templates", label: "Templates", icon: DocIcon },
  { path: "/settings", label: "Settings", icon: GearIcon },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div
      style={{
        width: 232,
        flexShrink: 0,
        background: "var(--cream-deep)",
        borderRight: "1px solid var(--hairline)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 64,
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

      <div style={{ padding: "14px 0", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <button
            key={path}
            className={`nav-item${location.pathname === path ? " active" : ""}`}
            onClick={() => navigate(path)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: "auto",
          height: 60,
          borderTop: "1px solid var(--hairline)",
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
    </div>
  );
}
