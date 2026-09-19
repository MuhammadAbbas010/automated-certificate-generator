import { useMemo, useState } from "react";
import type { Student } from "../../data/mockStudents";
import type { LogEntry } from "../../data/certificate";
import { ExportIcon } from "../../components/icons";
import { CertificatePreviewModal } from "../../components/CertificatePreviewModal";
import { exportStudentsCsv } from "../../lib/exportCsv";
import { useIsMobile } from "../../lib/useIsMobile";

interface SentTabProps {
  students: Student[];
  certificateName: string;
  searchQuery: string;
  updateStudents: (updater: (students: Student[]) => Student[]) => void;
  pushLog: (entry: Omit<LogEntry, "id" | "time">) => void;
}

function matchesSearch(s: Student, query: string) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
}

export function SentTab({ students, certificateName, searchQuery, updateStudents, pushLog }: SentTabProps) {
  const isMobile = useIsMobile();
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);

  const sent = useMemo(
    () =>
      students
        .filter((s) => s.status === "sent" && matchesSearch(s, searchQuery))
        .sort((a, b) => new Date(b.sentAt ?? 0).getTime() - new Date(a.sentAt ?? 0).getTime()),
    [students, searchQuery]
  );

  function resend(student: Student) {
    updateStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, sentAt: new Date().toISOString() } : s)));
    pushLog({ actor: "system", kind: "text", text: `Resent certificate to ${student.name}.` });
  }

  const listPad = isMobile ? "14px 14px 12px" : "22px 32px 12px";
  const footerPad = isMobile ? "0 14px" : "0 32px";

  return (
    <div style={{ flexGrow: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ flexGrow: 1, minHeight: 0, overflowY: "auto", padding: listPad }}>
        {sent.length === 0 ? (
          <div style={{ fontSize: 13.5, color: "var(--ink-muted)", padding: "40px 0", textAlign: "center" }}>
            {searchQuery ? "No sent certificates match your search." : "Nothing sent yet — approved certificates land here."}
          </div>
        ) : (
          <div style={{ border: "1px solid var(--hairline)", borderRadius: 6, background: "var(--paper)", padding: isMobile ? "0 12px" : 0 }}>
            {sent.map((s) =>
              isMobile ? (
                <div key={s.id} className="row-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="status-dot" style={{ background: "var(--green)" }} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, flexGrow: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                    <button className="btn-ghost-sm" style={{ height: 30, padding: "0 10px", flexShrink: 0 }} onClick={() => resend(s)}>
                      Resend
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 17 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: "var(--ink-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.email}</div>
                      <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-muted)", marginTop: 2 }}>
                        {s.sentAt ? new Date(s.sentAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </div>
                    </div>
                    <button className="cert-thumb" style={{ cursor: "pointer" }} onClick={() => setPreviewStudent(s)} aria-label={`Preview certificate for ${s.name}`}>
                      <span className="seal" />
                      <div className="ln" style={{ width: 20 }} />
                      <div className="ln" style={{ width: 12, opacity: 0.6 }} />
                    </button>
                  </div>
                </div>
              ) : (
                <div key={s.id} className="row" style={{ gridTemplateColumns: "1fr 76px 140px 90px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span className="status-dot" style={{ background: "var(--green)" }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{s.email}</div>
                    </div>
                  </div>
                  <button className="cert-thumb" style={{ cursor: "pointer" }} onClick={() => setPreviewStudent(s)} aria-label={`Preview certificate for ${s.name}`}>
                    <span className="seal" />
                    <div className="ln" style={{ width: 30 }} />
                    <div className="ln" style={{ width: 18, opacity: 0.6 }} />
                  </button>
                  <div className="mono" style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                    {s.sentAt ? new Date(s.sentAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                  </div>
                  <button className="btn-ghost-sm" style={{ justifySelf: "end", height: 32, padding: "0 12px" }} onClick={() => resend(s)}>
                    Resend
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div
        style={{
          height: 64,
          flexShrink: 0,
          borderTop: "1px solid var(--hairline)",
          background: "var(--paper)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: footerPad,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>{sent.length} sent</span>
        <button className="btn-ghost-sm" onClick={() => exportStudentsCsv(sent, certificateName)}>
          <ExportIcon size={14} />
          {!isMobile && "Export"}
        </button>
      </div>

      {previewStudent && (
        <CertificatePreviewModal studentName={previewStudent.name} certificateName={certificateName} onClose={() => setPreviewStudent(null)} />
      )}
    </div>
  );
}
