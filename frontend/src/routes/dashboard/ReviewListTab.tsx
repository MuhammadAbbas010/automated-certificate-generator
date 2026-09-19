import { useMemo, useState } from "react";
import { bucketStudents } from "../../lib/timeBuckets";
import type { Student } from "../../data/mockStudents";
import { ChevronRight, EditIcon, TrashIcon, ExportIcon, CheckIcon, XIcon } from "../../components/icons";
import type { DashboardState } from "./types";

const STATUS_COLOR: Record<Student["status"], string> = {
  pending: "var(--amber)",
  not_qualified: "var(--rust)",
  sent: "var(--green)",
};

function Row({
  student,
  onToggle,
  onEdit,
  onRemove,
}: {
  student: Student;
  onToggle: () => void;
  onEdit: (name: string, email: string) => void;
  onRemove: () => void;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "confirm-delete">("view");
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);

  if (mode === "edit") {
    return (
      <div className="row" style={{ gridTemplateColumns: "28px 1fr 76px 150px 76px" }}>
        <input type="checkbox" checked={student.checked} onChange={onToggle} aria-label={`Select ${student.name}`} />
        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ height: 32, fontSize: 13 }} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ height: 32, fontSize: 13 }} />
        </div>
        <div className="cert-thumb" style={{ opacity: 0.6 }} />
        <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{student.columnValue}</div>
        <div style={{ display: "flex", gap: 4, justifySelf: "end" }}>
          <button
            className="btn-icon"
            aria-label="Save"
            onClick={() => {
              onEdit(name.trim() || student.name, email.trim() || student.email);
              setMode("view");
            }}
          >
            <CheckIcon size={14} />
          </button>
          <button className="btn-icon" aria-label="Cancel" onClick={() => setMode("view")}>
            <XIcon size={12} />
          </button>
        </div>
      </div>
    );
  }

  if (mode === "confirm-delete") {
    return (
      <div className="row" style={{ gridTemplateColumns: "28px 1fr 76px 150px 76px" }}>
        <input type="checkbox" checked={student.checked} disabled aria-label={`Select ${student.name}`} />
        <div style={{ fontSize: 13.5, color: "var(--rust)" }}>Remove {student.name} from this certificate?</div>
        <div />
        <div />
        <div style={{ display: "flex", gap: 4, justifySelf: "end" }}>
          <button className="btn-icon" aria-label="Confirm remove" style={{ color: "var(--rust)" }} onClick={onRemove}>
            <CheckIcon size={14} />
          </button>
          <button className="btn-icon" aria-label="Cancel" onClick={() => setMode("view")}>
            <XIcon size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="row" style={{ gridTemplateColumns: "28px 1fr 76px 150px 76px" }}>
      <input type="checkbox" checked={student.checked} onChange={onToggle} aria-label={`Select ${student.name}`} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <span className="status-dot" style={{ background: STATUS_COLOR[student.status] }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {student.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>
            {student.email}
            {student.sentAt ? ` · sent ${new Date(student.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
          </div>
        </div>
      </div>
      <div className="cert-thumb" style={{ opacity: student.status === "not_qualified" ? 0.5 : 1 }}>
        {student.status !== "not_qualified" && <span className="seal" />}
        <div className="ln" style={{ width: 30 }} />
        <div className="ln" style={{ width: 18, opacity: 0.6 }} />
      </div>
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
        <button className="btn-icon" aria-label="Edit" onClick={() => setMode("edit")}>
          <EditIcon size={14} />
        </button>
        <button className="btn-icon" aria-label="Delete" onClick={() => setMode("confirm-delete")}>
          <TrashIcon size={14} />
        </button>
      </div>
    </div>
  );
}

export function ReviewListTab({ students, setStudents }: DashboardState) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const buckets = useMemo(() => bucketStudents(students), [students]);

  const selectedCount = students.filter((s) => s.checked).length;

  function toggle(id: string) {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)));
  }

  function edit(id: string, name: string, email: string) {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, name, email } : s)));
  }

  function remove(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  function approveAll() {
    setStudents((prev) =>
      prev.map((s) =>
        s.checked && s.status === "pending" ? { ...s, status: "sent" as const, sentAt: new Date().toISOString() } : s
      )
    );
  }

  return (
    <>
      <div style={{ flexGrow: 1, overflowY: "auto", padding: "22px 32px 12px" }}>
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
                  <div style={{ border: "1px solid var(--hairline)", borderRadius: 6, background: "var(--paper)", marginBottom: 16 }}>
                    {bucket.students.map((s) => (
                      <Row
                        key={s.id}
                        student={s}
                        onToggle={() => toggle(s.id)}
                        onEdit={(name, email) => edit(s.id, name, email)}
                        onRemove={() => remove(s.id)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <button
                  className="collapsed-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    height: 48,
                    padding: "0 18px",
                    background: "var(--cream-deep)",
                    borderRadius: 6,
                    border: "none",
                    width: "100%",
                  }}
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
            No submissions yet.
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
          padding: "0 32px",
        }}
      >
        <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>
          {selectedCount} selected · {students.length} total
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost-sm">
            <ExportIcon size={14} />
            Export
          </button>
          <button className="btn-primary" onClick={approveAll} disabled={selectedCount === 0}>
            Approve All
          </button>
        </div>
      </div>
    </>
  );
}
