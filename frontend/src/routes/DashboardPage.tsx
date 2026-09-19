import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { SearchIcon, BellIcon, ChevronDown, ClockIcon, UsersIcon } from "../components/icons";
import { initialStudents } from "../data/mockStudents";
import { ReviewListTab } from "./dashboard/ReviewListTab";
import { ChatCommandsTab } from "./dashboard/ChatCommandsTab";
import type { LogEntry } from "./dashboard/types";

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatCountdown(target: Date) {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return "any moment";
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${h}h ${m}m`;
}

export function DashboardPage() {
  const [tab, setTab] = useState<"review" | "chat">("review");
  const [students, setStudents] = useState(initialStudents);
  const [nextSendAt, setNextSendAt] = useState(() => new Date(Date.now() + 4 * 60 * 60 * 1000));
  const [log, setLog] = useState<LogEntry[]>([
    { id: "l0", time: timeNow(), actor: "system", kind: "text", text: `Verification stage started. ${initialStudents.length} submissions loaded, ${initialStudents.filter((s) => s.status === "pending").length} pending review.` },
  ]);
  const [, forceTick] = useState(0);

  // Re-render every 30s so the countdown chip stays live without a full timer implementation.
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  function pushLog(entry: Omit<LogEntry, "id" | "time">) {
    setLog((prev) => [...prev, { ...entry, id: `l${prev.length}`, time: timeNow() }]);
  }

  const dashboardState = {
    students,
    setStudents,
    nextSendAt,
    setNextSendAt,
    hasTimer: true,
    log,
    pushLog,
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "var(--cream)", display: "flex" }}>
      <Sidebar />

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div
          style={{
            height: 64,
            flexShrink: 0,
            borderBottom: "1px solid var(--hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
          }}
        >
          <button className="btn-ghost-sm" style={{ border: "none", padding: 0, height: "auto", gap: 8, background: "none" }}>
            <h1 style={{ fontSize: 19 }}>Spring Honor Roll</h1>
            <ChevronDown size={13} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="btn-icon" aria-label="Search">
              <SearchIcon size={16} />
            </button>
            <button className="btn-icon" aria-label="Notifications">
              <BellIcon size={16} />
            </button>
          </div>
        </div>

        <div
          style={{
            height: 48,
            flexShrink: 0,
            borderBottom: "1px solid var(--hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            <button className={`tab${tab === "review" ? " active" : ""}`} onClick={() => setTab("review")}>
              Review List
            </button>
            <button className={`tab${tab === "chat" ? " active" : ""}`} onClick={() => setTab("chat")}>
              Chat Commands
            </button>
          </div>

          {tab === "review" ? (
            <div style={{ display: "flex", gap: 20 }}>
              <span className="stat-chip">
                <span className="status-dot" style={{ background: "var(--amber)" }} />
                {students.filter((s) => s.status === "pending").length} pending
              </span>
              <span className="stat-chip">
                <span className="status-dot" style={{ background: "var(--rust)" }} />
                {students.filter((s) => s.status === "not_qualified").length} not qualified
              </span>
              <span className="stat-chip">
                <span className="status-dot" style={{ background: "var(--green)" }} />
                {students.filter((s) => s.status === "sent").length} sent
              </span>
              <span className="stat-chip" style={{ color: "var(--ink-muted)" }}>
                <ClockIcon size={13} />
                {`Auto-sends in ${formatCountdown(nextSendAt)}`}
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--ink-muted)" }}>
              <UsersIcon size={13} />
              Audit trail · 1 admin active
            </div>
          )}
        </div>

        {tab === "review" ? <ReviewListTab {...dashboardState} /> : <ChatCommandsTab {...dashboardState} />}
      </div>
    </div>
  );
}
