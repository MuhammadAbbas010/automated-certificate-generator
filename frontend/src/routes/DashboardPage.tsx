import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { SidebarDrawer } from "../components/SidebarDrawer";
import { SearchIcon, BellIcon, ChevronDown, ClockIcon, UsersIcon, PlusIcon, XIcon, MenuIcon } from "../components/icons";
import { useCertificates } from "../context/CertificatesContext";
import { bucketStudents } from "../lib/timeBuckets";
import { useIsMobile } from "../lib/useIsMobile";
import { useMobileDrawer } from "../lib/useMobileDrawer";
import { ReviewListTab } from "./dashboard/ReviewListTab";
import { SentTab } from "./dashboard/SentTab";
import { ChatCommandsTab } from "./dashboard/ChatCommandsTab";

function formatCountdown(target: Date) {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return "any moment";
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${h}h ${m}m`;
}

export function DashboardPage() {
  const { certId } = useParams();
  const navigate = useNavigate();
  const { certificates, getCertificate, updateStudents, setNextSendAt, pushLog } = useCertificates();
  const cert = certId ? getCertificate(certId) : undefined;
  const isMobile = useIsMobile();
  const drawer = useMobileDrawer();

  const [tab, setTab] = useState<"review" | "sent" | "chat">("review");
  const [, forceTick] = useState(0);
  const [breadcrumbOpen, setBreadcrumbOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!breadcrumbOpen && !notifOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setBreadcrumbOpen(false);
        setNotifOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [breadcrumbOpen, notifOpen]);

  const topBarPad = isMobile ? 14 : 32;

  if (!cert) {
    return (
      <div style={{ width: "100%", height: "100vh", background: "var(--cream)", display: "flex", overflow: "hidden" }}>
        {!isMobile && <Sidebar />}
        <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 16, color: "var(--ink)" }}>Certificate not found.</div>
          <button className="btn-ghost" onClick={() => navigate("/dashboard")}>
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const justArrived = bucketStudents(cert.students).find((b) => b.key === "just-arrived")?.students ?? [];

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <div style={{ width: "100%", height: "100vh", background: "var(--cream)", display: "flex", overflow: "hidden" }}>
      {isMobile ? (
        <SidebarDrawer open={drawer.open} onClose={drawer.close}>
          <Sidebar />
        </SidebarDrawer>
      ) : (
        <Sidebar />
      )}

      <div style={{ flexGrow: 1, minWidth: 0, minHeight: 0, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div
          style={{
            height: isMobile ? 56 : 64,
            flexShrink: 0,
            borderBottom: "1px solid var(--hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${topBarPad}px`,
            gap: 8,
            position: "relative",
          }}
        >
          {isMobile && (
            <button className="btn-icon" aria-label="Open menu" onClick={drawer.toggle} style={{ flexShrink: 0 }}>
              <MenuIcon size={18} />
            </button>
          )}

          <button
            className="btn-ghost-sm"
            style={{ border: "none", padding: 0, height: "auto", gap: 8, background: "none", minWidth: 0, flexGrow: isMobile ? 1 : 0, justifyContent: isMobile ? "center" : "flex-start" }}
            onClick={() => setBreadcrumbOpen((v) => !v)}
            aria-expanded={breadcrumbOpen}
          >
            <h1 style={{ fontSize: isMobile ? 16 : 19, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cert.name}</h1>
            <ChevronDown size={13} />
          </button>

          {breadcrumbOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setBreadcrumbOpen(false)} />
              <div
                style={{
                  position: "absolute",
                  top: isMobile ? 48 : 52,
                  left: isMobile ? 14 : 32,
                  right: isMobile ? 14 : "auto",
                  width: isMobile ? "auto" : 260,
                  background: "var(--paper)",
                  border: "1px solid var(--hairline-strong)",
                  borderRadius: 8,
                  boxShadow: "var(--shadow-2)",
                  zIndex: 50,
                  overflow: "hidden",
                }}
              >
                {certificates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setBreadcrumbOpen(false);
                      navigate(`/dashboard/${c.id}`);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      width: "100%",
                      padding: "10px 16px",
                      background: c.id === cert.id ? "var(--accent-soft)" : "none",
                      border: "none",
                      borderBottom: "1px solid var(--hairline)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (c.id !== cert.id) e.currentTarget.style.background = "var(--cream-deep)";
                    }}
                    onMouseLeave={(e) => {
                      if (c.id !== cert.id) e.currentTarget.style.background = "none";
                    }}
                  >
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{c.name}</span>
                    <span style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>{c.students.length} submissions</span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setBreadcrumbOpen(false);
                    navigate("/new-certificate");
                  }}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: 13, fontWeight: 600 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cream-deep)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <PlusIcon size={14} />
                  New Certificate
                </button>
              </div>
            </>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 8, flexShrink: 0 }}>
            {!isMobile &&
              (searchOpen ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search name or email…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") closeSearch();
                    }}
                    style={{ height: 34, width: 220, fontSize: 13 }}
                  />
                  <button className="btn-icon" aria-label="Close search" onClick={closeSearch}>
                    <XIcon size={12} />
                  </button>
                </div>
              ) : (
                <button className="btn-icon" aria-label="Search" onClick={() => setSearchOpen(true)}>
                  <SearchIcon size={16} />
                </button>
              ))}

            <div style={{ position: "relative" }}>
              <button className="btn-icon" aria-label="Notifications" onClick={() => setNotifOpen((v) => !v)} style={{ position: "relative" }}>
                <BellIcon size={16} />
                {justArrived.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      right: 3,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--rust)",
                      border: "1.5px solid var(--cream)",
                    }}
                  />
                )}
              </button>
              {notifOpen && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setNotifOpen(false)} />
                  <div
                    style={{
                      position: "absolute",
                      top: 42,
                      right: isMobile ? -14 : 0,
                      width: isMobile ? "calc(100vw - 28px)" : 280,
                      maxWidth: 320,
                      background: "var(--paper)",
                      border: "1px solid var(--hairline-strong)",
                      borderRadius: 8,
                      boxShadow: "var(--shadow-2)",
                      zIndex: 50,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-muted)" }}>
                      New submissions
                    </div>
                    {justArrived.length === 0 ? (
                      <div style={{ padding: "16px", fontSize: 13, color: "var(--ink-muted)" }}>Nothing new right now.</div>
                    ) : (
                      justArrived.map((s) => (
                        <div key={s.id} style={{ padding: "10px 16px", borderBottom: "1px solid var(--hairline)" }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>{s.email}</div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {isMobile && (
          <div style={{ flexShrink: 0, borderBottom: "1px solid var(--hairline)", padding: "10px 14px" }}>
            {searchOpen ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search name or email…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") closeSearch();
                  }}
                  style={{ height: 36, flexGrow: 1, fontSize: 13 }}
                />
                <button className="btn-icon" aria-label="Close search" onClick={closeSearch}>
                  <XIcon size={12} />
                </button>
              </div>
            ) : (
              <button className="btn-ghost-sm" style={{ width: "100%", justifyContent: "flex-start", color: "var(--ink-muted)" }} onClick={() => setSearchOpen(true)}>
                <SearchIcon size={14} />
                Search name or email…
              </button>
            )}
          </div>
        )}

        <div
          style={{
            height: isMobile ? 42 : 48,
            flexShrink: 0,
            borderBottom: "1px solid var(--hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${topBarPad}px`,
            gap: isMobile ? 16 : 0,
          }}
        >
          <div style={{ display: "flex", gap: isMobile ? 18 : 28, flexShrink: 0 }}>
            <button className={`tab${tab === "review" ? " active" : ""}`} onClick={() => setTab("review")}>
              Review List
            </button>
            <button className={`tab${tab === "sent" ? " active" : ""}`} onClick={() => setTab("sent")}>
              Sent
            </button>
            <button className={`tab${tab === "chat" ? " active" : ""}`} onClick={() => setTab("chat")}>
              Chat Commands
            </button>
          </div>
        </div>

        {tab === "review" && (
          <div style={{ flexShrink: 0, borderBottom: "1px solid var(--hairline)", padding: isMobile ? "8px 14px" : "8px 32px", overflowX: "auto" }}>
            <div style={{ display: "flex", gap: isMobile ? 8 : 20, width: "max-content" }}>
              <span className="stat-chip">
                <span className="status-dot" style={{ background: "var(--amber)" }} />
                {cert.students.filter((s) => s.status === "pending").length} pending
              </span>
              <span className="stat-chip">
                <span className="status-dot" style={{ background: "var(--rust)" }} />
                {cert.students.filter((s) => s.status === "not_qualified").length} not qualified
              </span>
              <span className="stat-chip">
                <span className="status-dot" style={{ background: "var(--green)" }} />
                {cert.students.filter((s) => s.status === "sent").length} sent
              </span>
              <span className="stat-chip" style={{ color: "var(--ink-muted)" }}>
                <ClockIcon size={13} />
                {cert.settings.hasTimer ? `Auto-sends in ${formatCountdown(new Date(cert.nextSendAt))}` : "Sending once you're done"}
              </span>
            </div>
          </div>
        )}
        {tab === "chat" && (
          <div style={{ flexShrink: 0, borderBottom: "1px solid var(--hairline)", padding: isMobile ? "8px 14px" : "8px 32px", display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--ink-muted)" }}>
            <UsersIcon size={13} />
            Audit trail · 1 admin active
          </div>
        )}
        {tab === "sent" && (
          <div style={{ flexShrink: 0, borderBottom: "1px solid var(--hairline)", padding: isMobile ? "8px 14px" : "8px 32px" }}>
            <span className="stat-chip">
              <span className="status-dot" style={{ background: "var(--green)" }} />
              {cert.students.filter((s) => s.status === "sent").length} sent total
            </span>
          </div>
        )}

        <div style={{ flexGrow: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {tab === "review" && (
            <ReviewListTab
              certId={cert.id}
              students={cert.students}
              certificateName={cert.name}
              searchQuery={searchQuery}
              updateStudents={(updater) => updateStudents(cert.id, updater)}
            />
          )}
          {tab === "sent" && (
            <SentTab
              students={cert.students}
              certificateName={cert.name}
              searchQuery={searchQuery}
              updateStudents={(updater) => updateStudents(cert.id, updater)}
              pushLog={(entry) => pushLog(cert.id, entry)}
            />
          )}
          {tab === "chat" && (
            <ChatCommandsTab
              students={cert.students}
              updateStudents={(updater) => updateStudents(cert.id, updater)}
              nextSendAt={new Date(cert.nextSendAt)}
              setNextSendAt={(date) => setNextSendAt(cert.id, date)}
              log={cert.log}
              pushLog={(entry) => pushLog(cert.id, entry)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
