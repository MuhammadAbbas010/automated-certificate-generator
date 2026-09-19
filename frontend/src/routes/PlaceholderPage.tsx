import { Sidebar } from "../components/Sidebar";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "var(--cream)", display: "flex" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "var(--ink-muted)" }}>
          <h1 style={{ fontSize: 22, color: "var(--ink)", marginBottom: 8 }}>{title}</h1>
          <div style={{ fontSize: 13.5 }}>Not built yet.</div>
        </div>
      </div>
    </div>
  );
}
