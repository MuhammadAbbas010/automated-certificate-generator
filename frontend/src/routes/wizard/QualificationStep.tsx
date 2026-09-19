import { useState } from "react";
import type { WizardDraft } from "../../data/wizardDraft";
import { ChevronDown, SparkleIcon, XIcon, CheckIcon } from "../../components/icons";

const COLUMN_OPTIONS = ["Work Placement Status", "Attendance", "Final Grade", "Volunteer Hours"];

export function QualificationStep({
  draft,
  patch,
}: {
  draft: WizardDraft;
  patch: (p: Partial<WizardDraft>) => void;
}) {
  const [columnOpen, setColumnOpen] = useState(false);
  const [newValue, setNewValue] = useState("");

  function addValue() {
    const v = newValue.trim();
    if (v && !draft.acceptedValues.includes(v)) {
      patch({ acceptedValues: [...draft.acceptedValues, v] });
    }
    setNewValue("");
  }

  function removeValue(v: string) {
    patch({ acceptedValues: draft.acceptedValues.filter((x) => x !== v) });
  }

  return (
    <>
      <h1 style={{ fontSize: 27 }}>Qualification rules</h1>
      <div style={{ fontSize: 14, color: "var(--ink-muted)", marginTop: 8, lineHeight: 1.55 }}>
        We scanned your sheet and found a likely qualifying column. Confirm or adjust it below — this only runs
        once and is cached for future sends.
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <label className="field-label">Qualifying column</label>
          <span className="tag-suggest">
            <SparkleIcon size={10} />
            AI suggested
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <div className="select-control" role="button" tabIndex={0} onClick={() => setColumnOpen((o) => !o)}>
            <span>{draft.qualifyingColumn}</span>
            <ChevronDown size={14} />
          </div>
          {columnOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "var(--paper)",
                border: "1px solid var(--hairline-strong)",
                borderRadius: 4,
                boxShadow: "var(--shadow-1)",
                zIndex: 10,
              }}
            >
              {COLUMN_OPTIONS.map((opt) => (
                <div
                  key={opt}
                  role="option"
                  aria-selected={opt === draft.qualifyingColumn}
                  onClick={() => {
                    patch({ qualifyingColumn: opt });
                    setColumnOpen(false);
                  }}
                  style={{
                    padding: "10px 14px",
                    fontSize: 13.5,
                    cursor: "pointer",
                    background: opt === draft.qualifyingColumn ? "var(--accent-soft)" : "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cream-deep)")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = opt === draft.qualifyingColumn ? "var(--accent-soft)" : "transparent")
                  }
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 20, marginBottom: 8 }}>
          <label className="field-label">Accepted values</label>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {draft.acceptedValues.map((v) => (
            <span className="chip" key={v}>
              {v}
              <span className="chip-x" role="button" tabIndex={0} aria-label={`Remove ${v}`} onClick={() => removeValue(v)}>
                <XIcon size={9} />
              </span>
            </span>
          ))}
          <input
            type="text"
            placeholder="e.g. yes/done/y"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addValue();
              }
            }}
            style={{ width: 140, height: 32, fontSize: 13 }}
          />
          <button type="button" className="chip chip-add" onClick={addValue}>
            + Add value
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 18, fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
          <CheckIcon size={15} />
          Looks good — matches 42 of 45 rows
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <label className="field-label" htmlFor="reason-col">
          Non-qualifying reason <span style={{ textTransform: "none", fontWeight: 400, color: "var(--ink-muted)" }}>(optional)</span>
        </label>
        <input
          type="text"
          id="reason-col"
          style={{ marginTop: 8 }}
          placeholder="e.g. Status Notes"
          value={draft.reasonColumn}
          onChange={(e) => patch({ reasonColumn: e.target.value })}
        />
      </div>
    </>
  );
}
