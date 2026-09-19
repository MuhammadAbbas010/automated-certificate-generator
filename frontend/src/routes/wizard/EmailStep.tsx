import type { WizardDraft } from "../../data/wizardDraft";
import { SparkleIcon } from "../../components/icons";

const TEMPLATES = [
  { id: "classic", name: "Classic", preview: "Dear {{first_name}}, congratulations on completing {{course_name}}..." },
  { id: "warm", name: "Warm & Personal", preview: "Hi {{first_name}}! We're so proud of what you accomplished in {{course_name}}..." },
  { id: "formal", name: "Formal", preview: "Dear {{first_name}} {{last_name}}, it is our pleasure to confirm your completion of {{course_name}}..." },
  { id: "brief", name: "Brief", preview: "{{first_name}} — your {{course_name}} certificate is attached. Well done." },
];

export function EmailStep({
  draft,
  patch,
}: {
  draft: WizardDraft;
  patch: (p: Partial<WizardDraft>) => void;
}) {
  return (
    <>
      <h1 style={{ fontSize: 27 }}>Email template</h1>
      <div style={{ fontSize: 14, color: "var(--ink-muted)", marginTop: 8, lineHeight: 1.55 }}>
        Choose a template for the congratulations email. Merge fields fill in automatically for each student.
      </div>

      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => patch({ emailTemplateId: t.id })}
            style={{
              textAlign: "left",
              background: "var(--paper)",
              border: `1px solid ${draft.emailTemplateId === t.id ? "var(--accent)" : "var(--hairline)"}`,
              boxShadow: draft.emailTemplateId === t.id ? "0 0 0 1px var(--accent)" : "var(--shadow-1)",
              borderRadius: 8,
              padding: "16px 18px",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{t.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-muted)", lineHeight: 1.5 }}>{t.preview}</div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <label className="field-label" style={{ marginBottom: 0 }}>
            Non-qualification email
          </label>
          <span className="tag-suggest">
            <SparkleIcon size={10} />
            AI generated
          </span>
        </div>
        <textarea
          placeholder="e.g. Hi {{first_name}}, thanks for your submission — unfortunately you didn't meet the {{qualifying_column}} requirement this time ({{reason}}). Reach out to {{teacher_email}} with any questions."
          value={draft.nonQualEmailBody}
          onChange={(e) => patch({ nonQualEmailBody: e.target.value })}
          rows={4}
          style={{
            width: "100%",
            border: "1px solid var(--hairline-strong)",
            borderRadius: 2,
            background: "var(--paper)",
            padding: "12px 14px",
            fontSize: 14,
            fontFamily: "inherit",
            color: "var(--ink)",
            resize: "vertical",
          }}
        />
        <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 8, lineHeight: 1.5 }}>
          Includes a merge field for the specific reason each student didn't qualify, and links your email so
          they know who to contact.
        </div>
      </div>
    </>
  );
}
