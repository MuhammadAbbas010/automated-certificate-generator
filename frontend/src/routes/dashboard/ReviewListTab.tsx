import { useEffect, useMemo, useRef, useState } from "react";
import { bucketStudents } from "../../lib/timeBuckets";
import { exportStudentsCsv } from "../../lib/exportCsv";
import { useIsMobile } from "../../lib/useIsMobile";
import type { Student } from "../../data/mockStudents";
import { ChevronRight, EditIcon, TrashIcon, ExportIcon, CheckIcon, XIcon, WarningIcon, MoreIcon } from "../../components/icons";
import { CertificatePreviewModal } from "../../components/CertificatePreviewModal";
import { ContextMenu } from "../../components/ContextMenu";

const STATUS_COLOR: Record<Student["status"], string> = {
  pending: "var(--amber)",
  not_qualified: "var(--rust)",
  sent: "var(--green)",
};

const MAX_CONCURRENT_EDITS = 2;

interface ReviewListTabProps {
  certId: string;
  students: Student[];
  certificateName: string;
  searchQuery: string;
  updateStudents: (updater: (students: Student[]) => Student[]) => void;
}

function matchesSearch(s: Student, query: string) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.columnValue.toLowerCase().includes(q);
}

function Row({
  student,
  editing,
  canOpenEdit,
  draft,
  registerRef,
  onToggleCheck,
  onRequestEdit,
  onDraftChange,
  onSaveEdit,
  onCancelEdit,
  onRemove,
  onPreview,
}: {
  student: Student;
  editing: boolean;
  canOpenEdit: boolean;
  draft?: { name: string; email: string };
  registerRef: (el: HTMLDivElement | null) => void;
  onToggleCheck: () => void;
  onRequestEdit: () => void;
  onDraftChange: (name: string, email: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemove: () => void;
  onPreview: () => void;
}) {
  const isMobile = useIsMobile();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);

  const thumb = (
    <button className="cert-thumb" style={{ opacity: student.status === "not_qualified" ? 0.5 : 1, cursor: "pointer" }} onClick={onPreview} aria-label={`Preview certificate for ${student.name}`}>
      {student.status !== "not_qualified" && <span className="seal" />}
      <div className="ln" style={{ width: isMobile ? 20 : 30 }} />
      <div className="ln" style={{ width: isMobile ? 12 : 18, opacity: 0.6 }} />
    </button>
  );

  if (editing && draft) {
    if (isMobile) {
      return (
        <div ref={registerRef} data-row-id={student.id} className="row-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" checked={student.checked} onChange={onToggleCheck} aria-label={`Select ${student.name}`} />
            <input type="text" value={draft.name} onChange={(e) => onDraftChange(e.target.value, draft.email)} style={{ height: 34, fontSize: 13, flexGrow: 1 }} />
          </div>
          <input type="email" value={draft.email} onChange={(e) => onDraftChange(draft.name, e.target.value)} style={{ height: 34, fontSize: 13, marginLeft: 27, width: "calc(100% - 27px)" }} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn-ghost-sm" style={{ height: 32, padding: "0 12px" }} onClick={onCancelEdit}>
              Cancel
            </button>
            <button className="btn-primary" style={{ height: 32, padding: "0 12px" }} onClick={onSaveEdit}>
              Save
            </button>
          </div>
        </div>
      );
    }
    return (
      <div ref={registerRef} data-row-id={student.id} className="row" style={{ gridTemplateColumns: "28px 1fr 76px 150px 76px" }}>
        <input type="checkbox" checked={student.checked} onChange={onToggleCheck} aria-label={`Select ${student.name}`} />
        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" value={draft.name} onChange={(e) => onDraftChange(e.target.value, draft.email)} style={{ height: 32, fontSize: 13 }} />
          <input type="email" value={draft.email} onChange={(e) => onDraftChange(draft.name, e.target.value)} style={{ height: 32, fontSize: 13 }} />
        </div>
        <div className="cert-thumb" style={{ opacity: 0.6 }} />
        <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{student.columnValue}</div>
        <div style={{ display: "flex", gap: 4, justifySelf: "end" }}>
          <button className="btn-icon" aria-label="Save" onClick={onSaveEdit}>
            <CheckIcon size={14} />
          </button>
          <button className="btn-icon" aria-label="Cancel" onClick={onCancelEdit}>
            <XIcon size={12} />
          </button>
        </div>
      </div>
    );
  }

  if (confirmingDelete) {
    if (isMobile) {
      return (
        <div ref={registerRef} data-row-id={student.id} className="row-card">
          <div style={{ fontSize: 13.5, color: "var(--rust)" }}>Remove {student.name} from this certificate?</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn-ghost-sm" style={{ height: 32, padding: "0 12px" }} onClick={() => setConfirmingDelete(false)}>
              Cancel
            </button>
            <button className="btn-primary" style={{ height: 32, padding: "0 12px", background: "var(--rust)", borderColor: "var(--rust)" }} onClick={onRemove}>
              Remove
            </button>
          </div>
        </div>
      );
    }
    return (
      <div ref={registerRef} data-row-id={student.id} className="row" style={{ gridTemplateColumns: "28px 1fr 76px 150px 76px" }}>
        <input type="checkbox" checked={student.checked} disabled aria-label={`Select ${student.name}`} />
        <div style={{ fontSize: 13.5, color: "var(--rust)" }}>Remove {student.name} from this certificate?</div>
        <div />
        <div />
        <div style={{ display: "flex", gap: 4, justifySelf: "end" }}>
          <button className="btn-icon" aria-label="Confirm remove" style={{ color: "var(--rust)" }} onClick={onRemove}>
            <CheckIcon size={14} />
          </button>
          <button className="btn-icon" aria-label="Cancel" onClick={() => setConfirmingDelete(false)}>
            <XIcon size={12} />
          </button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div ref={registerRef} data-row-id={student.id} className="row-card">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox" checked={student.checked} onChange={onToggleCheck} aria-label={`Select ${student.name}`} />
          <span className="status-dot" style={{ background: STATUS_COLOR[student.status] }} />
          <span style={{ fontSize: 13.5, fontWeight: 600, flexGrow: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.name}</span>
          <button
            className="btn-icon"
            style={{ width: 28, height: 28 }}
            aria-label="More actions"
            onClick={(e) => setMenuAnchor({ x: e.clientX, y: e.clientY })}
          >
            <MoreIcon size={14} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 27 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: "var(--ink-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.email}</div>
            <div style={{ fontSize: 12, color: student.status === "not_qualified" ? "var(--rust)" : "var(--ink-soft)", fontWeight: student.status === "not_qualified" ? 600 : 400, marginTop: 2 }}>
              {student.columnValue}
            </div>
          </div>
          {thumb}
        </div>

        {menuAnchor && (
          <ContextMenu
            x={menuAnchor.x}
            y={menuAnchor.y}
            onClose={() => setMenuAnchor(null)}
            items={[
              {
                label: "Edit",
                icon: <EditIcon size={13} />,
                disabled: !canOpenEdit,
                title: canOpenEdit ? undefined : `Only ${MAX_CONCURRENT_EDITS} records can be edited at once`,
                onClick: onRequestEdit,
              },
              { label: "Delete", icon: <TrashIcon size={13} />, danger: true, onClick: () => setConfirmingDelete(true) },
            ]}
          />
        )}
      </div>
    );
  }

  return (
    <div ref={registerRef} data-row-id={student.id} className="row" style={{ gridTemplateColumns: "28px 1fr 76px 150px 76px" }}>
      <input type="checkbox" checked={student.checked} onChange={onToggleCheck} aria-label={`Select ${student.name}`} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <span className="status-dot" style={{ background: STATUS_COLOR[student.status] }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.name}</div>
          <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{student.email}</div>
        </div>
      </div>
      {thumb}
      <div
        style={{
          fontSize: 13,
          color: student.status === "not_qualified" ? "var(--rust)" : "var(--ink-soft)",
          fontWeight: student.status === "not_qualified" ? 600 : 400,
        }}
      >
        {student.columnValue}
      </div>
      <div style={{ display: "flex", gap: 4, justifySelf: "end" }}>
        <button
          className="btn-icon"
          aria-label="Edit"
          onClick={onRequestEdit}
          disabled={!canOpenEdit}
          style={!canOpenEdit ? { opacity: 0.35, cursor: "not-allowed" } : undefined}
          title={canOpenEdit ? undefined : `Only ${MAX_CONCURRENT_EDITS} records can be edited at once`}
        >
          <EditIcon size={14} />
        </button>
        <button className="btn-icon" aria-label="Delete" onClick={() => setConfirmingDelete(true)}>
          <TrashIcon size={14} />
        </button>
      </div>
    </div>
  );
}

export function ReviewListTab({ students, certificateName, searchQuery, updateStudents }: ReviewListTabProps) {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [openEdits, setOpenEdits] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { name: string; email: string }>>({});
  const [offscreenWarnings, setOffscreenWarnings] = useState<string[]>([]);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const draftsRef = useRef(drafts);
  useEffect(() => {
    draftsRef.current = drafts;
  }, [drafts]);

  const filtered = useMemo(() => students.filter((s) => s.status !== "sent" && matchesSearch(s, searchQuery)), [students, searchQuery]);
  const buckets = useMemo(() => bucketStudents(filtered), [filtered]);
  const selectedCount = filtered.filter((s) => s.checked).length;
  const unsentTotal = students.filter((s) => s.status !== "sent").length;

  // Track scroll-visibility of any row currently open for edit. A dirty row that scrolls
  // out of view gets a warning near the scrollbar instead of being silently discarded or
  // yanking the user's scroll position back (per product decision: never force-scroll).
  useEffect(() => {
    if (openEdits.length === 0 || !scrollRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-row-id");
          if (!id) continue;
          if (entry.isIntersecting) {
            setOffscreenWarnings((prev) => prev.filter((x) => x !== id));
          } else if (draftsRef.current[id]) {
            const student = students.find((s) => s.id === id);
            const draft = draftsRef.current[id];
            const dirty = student && (draft.name !== student.name || draft.email !== student.email);
            if (dirty) {
              setOffscreenWarnings((prev) => (prev.includes(id) ? prev : [...prev, id]));
            } else {
              setOpenEdits((prev) => prev.filter((x) => x !== id));
              setDrafts((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
              });
            }
          }
        }
      },
      { root: scrollRef.current, threshold: 0 }
    );
    for (const id of openEdits) {
      const el = rowRefs.current.get(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openEdits, students]);

  function toggle(id: string) {
    updateStudents((prev) => prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)));
  }

  function requestEdit(student: Student) {
    if (openEdits.includes(student.id) || openEdits.length >= MAX_CONCURRENT_EDITS) return;
    setOpenEdits((prev) => [...prev, student.id]);
    setDrafts((prev) => ({ ...prev, [student.id]: { name: student.name, email: student.email } }));
  }

  function cancelEdit(id: string) {
    setOpenEdits((prev) => prev.filter((x) => x !== id));
    setOffscreenWarnings((prev) => prev.filter((x) => x !== id));
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function saveEdit(id: string) {
    const draft = drafts[id];
    if (draft) {
      updateStudents((prev) => prev.map((s) => (s.id === id ? { ...s, name: draft.name.trim() || s.name, email: draft.email.trim() || s.email } : s)));
    }
    cancelEdit(id);
  }

  function remove(id: string) {
    updateStudents((prev) => prev.filter((s) => s.id !== id));
    cancelEdit(id);
  }

  function approveAll() {
    updateStudents((prev) =>
      prev.map((s) => (s.checked && s.status === "pending" ? { ...s, status: "sent" as const, sentAt: new Date().toISOString() } : s))
    );
  }

  function handleExport() {
    const toExport = selectedCount > 0 ? filtered.filter((s) => s.checked) : filtered;
    exportStudentsCsv(toExport, certificateName);
  }

  const listPad = isMobile ? "14px 14px 12px" : "22px 32px 12px";
  const footerPad = isMobile ? "0 14px" : "0 32px";

  return (
    <div style={{ position: "relative", flexGrow: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <div ref={scrollRef} style={{ flexGrow: 1, minHeight: 0, overflowY: "auto", padding: listPad }}>
        {buckets.map((bucket) => {
          const isExpanded = expanded[bucket.key] ?? bucket.defaultExpanded;
          return (
            <div key={bucket.key} style={{ marginBottom: 10 }}>
              {isExpanded ? (
                <>
                  <div
                    style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10, cursor: "pointer" }}
                    onClick={() => setExpanded((e) => ({ ...e, [bucket.key]: false }))}
                  >
                    <span className="bucket-label">{bucket.label}</span>
                    <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>{bucket.students.length}</span>
                    <div style={{ flexGrow: 1, height: 1, background: "var(--hairline)" }} />
                  </div>
                  <div style={{ border: "1px solid var(--hairline)", borderRadius: 6, background: "var(--paper)", marginBottom: 16, padding: isMobile ? "0 12px" : 0 }}>
                    {bucket.students.map((s) => (
                      <Row
                        key={s.id}
                        student={s}
                        editing={openEdits.includes(s.id)}
                        canOpenEdit={openEdits.includes(s.id) || openEdits.length < MAX_CONCURRENT_EDITS}
                        draft={drafts[s.id]}
                        registerRef={(el) => {
                          if (el) rowRefs.current.set(s.id, el);
                          else rowRefs.current.delete(s.id);
                        }}
                        onToggleCheck={() => toggle(s.id)}
                        onRequestEdit={() => requestEdit(s)}
                        onDraftChange={(name, email) => setDrafts((prev) => ({ ...prev, [s.id]: { name, email } }))}
                        onSaveEdit={() => saveEdit(s.id)}
                        onCancelEdit={() => cancelEdit(s.id)}
                        onRemove={() => remove(s.id)}
                        onPreview={() => setPreviewStudent(s)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <button
                  className="collapsed-row"
                  style={{ display: "flex", alignItems: "center", gap: 10, height: 48, padding: "0 18px", background: "var(--cream-deep)", borderRadius: 6, border: "none", width: "100%" }}
                  onClick={() => setExpanded((e) => ({ ...e, [bucket.key]: true }))}
                >
                  <ChevronRight size={12} />
                  <span className="bucket-label">{bucket.label}</span>
                  <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>{bucket.students.length}</span>
                </button>
              )}
            </div>
          );
        })}
        {buckets.length === 0 && (
          <div style={{ fontSize: 13.5, color: "var(--ink-muted)", padding: "40px 0", textAlign: "center" }}>
            {searchQuery ? "No submissions match your search." : "No submissions yet."}
          </div>
        )}
      </div>

      {offscreenWarnings.length > 0 && (
        <div style={{ position: "absolute", top: 16, right: isMobile ? 6 : 10, display: "flex", flexDirection: "column", gap: 8, zIndex: 20, maxWidth: isMobile ? 170 : 220 }}>
          {offscreenWarnings.map((id) => {
            const student = students.find((s) => s.id === id);
            return (
              <div
                key={id}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  background: "var(--rust-soft)",
                  border: "1px solid var(--rust)",
                  borderRadius: 6,
                  padding: "10px 12px",
                  boxShadow: "var(--shadow-1)",
                }}
              >
                <span style={{ color: "var(--rust)", flexShrink: 0, marginTop: 1 }}>
                  <WarningIcon size={14} />
                </span>
                <span style={{ fontSize: 12, color: "var(--rust)", lineHeight: 1.4 }}>
                  Unsaved edit open{student ? ` for ${student.name}` : ""} — scroll back to save or cancel it.
                </span>
              </div>
            );
          })}
        </div>
      )}

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
          gap: 10,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--ink-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedCount} selected · {filtered.length} shown{filtered.length !== unsentTotal ? ` of ${unsentTotal}` : ""}
        </span>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button className="btn-ghost-sm" onClick={handleExport} aria-label="Export" title="Export">
            <ExportIcon size={14} />
            {!isMobile && "Export"}
          </button>
          <button className="btn-primary" onClick={approveAll} disabled={selectedCount === 0}>
            Approve All
          </button>
        </div>
      </div>

      {previewStudent && (
        <CertificatePreviewModal studentName={previewStudent.name} certificateName={certificateName} onClose={() => setPreviewStudent(null)} />
      )}
    </div>
  );
}
