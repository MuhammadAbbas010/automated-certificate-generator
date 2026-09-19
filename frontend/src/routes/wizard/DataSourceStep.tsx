import { useEffect } from "react";
import type { WizardDraft } from "../../data/wizardDraft";
import { CheckIcon } from "../../components/icons";

export function DataSourceStep({
  draft,
  patch,
}: {
  draft: WizardDraft;
  patch: (p: Partial<WizardDraft>) => void;
}) {
  // Auto-create the Sheet + Form pair the first time this step is reached, per docs/plan.md section 2
  // (one isolated Sheet+Form per certificate). Mocked here — real build calls the Sheets/Forms API.
  useEffect(() => {
    if (!draft.sheetUrl) {
      const slug = draft.certificateName.trim().toLowerCase().replace(/\s+/g, "-") || "certificate";
      patch({
        sheetUrl: `https://docs.google.com/spreadsheets/d/seal-${slug}`,
        formUrl: `https://docs.google.com/forms/d/seal-${slug}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectedColumns = ["First Name", "Last Name", "Email", draft.qualifyingColumn || "Work Placement Status", "Status"];

  return (
    <>
      <h1 style={{ fontSize: 27 }}>Data source</h1>
      <div style={{ fontSize: 14, color: "var(--ink-muted)", marginTop: 8, lineHeight: 1.55 }}>
        A Google Sheet and linked Form were created for this certificate. Student responses land here, and we
        write status back to a column so nothing gets processed twice.
      </div>

      <div
        style={{
          marginTop: 24,
          background: "var(--paper)",
          border: "1px solid var(--hairline)",
          borderRadius: 8,
          boxShadow: "var(--shadow-1)",
          padding: "26px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, marginBottom: 14 }}>
          <CheckIcon size={15} />
          <span style={{ color: "var(--ink)" }}>
            Linked Sheet: <span className="mono">{draft.sheetUrl}</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, marginBottom: 20 }}>
          <CheckIcon size={15} />
          <span style={{ color: "var(--ink)" }}>
            Linked Form: <span className="mono">{draft.formUrl}</span>
          </span>
        </div>

        <div className="field-label">Columns detected</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {detectedColumns.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22, fontSize: 13.5, color: "var(--ink-soft)" }}>
          <input type="checkbox" checked={draft.dedupeByEmail} onChange={(e) => patch({ dedupeByEmail: e.target.checked })} />
          Match resubmissions by email + name, and keep only the latest entry
        </label>
      </div>
    </>
  );
}
