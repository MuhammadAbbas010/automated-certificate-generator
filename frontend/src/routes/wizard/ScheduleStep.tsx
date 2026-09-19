import type { WizardDraft } from "../../data/wizardDraft";
import { ClockIcon, CheckIcon } from "../../components/icons";

function OptionCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: "left",
        flex: 1,
        background: active ? "var(--accent-soft)" : "var(--paper)",
        border: `1px solid ${active ? "var(--accent)" : "var(--hairline)"}`,
        borderRadius: 8,
        padding: "18px 20px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: `2px solid ${active ? "var(--accent)" : "var(--hairline-strong)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {active && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />}
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: active ? "var(--accent-ink)" : "var(--ink)" }}>{title}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--ink-muted)", lineHeight: 1.5, paddingLeft: 24 }}>{description}</div>
    </button>
  );
}

export function ScheduleStep({
  draft,
  patch,
}: {
  draft: WizardDraft;
  patch: (p: Partial<WizardDraft>) => void;
}) {
  return (
    <>
      <h1 style={{ fontSize: 27 }}>Schedule &amp; sending</h1>
      <div style={{ fontSize: 14, color: "var(--ink-muted)", marginTop: 8, lineHeight: 1.55 }}>
        Choose how certificates go out, and how long we keep checking your sheet for late submissions.
      </div>

      <div style={{ marginTop: 24 }}>
        <label className="field-label">Sending mode</label>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <OptionCard
            active={draft.sendMode === "auto"}
            title="Auto-send"
            description="Certificates send automatically once the timer below runs out — no manual approval needed."
            onClick={() => patch({ sendMode: "auto" })}
          />
          <OptionCard
            active={draft.sendMode === "manual"}
            title="Manual approval"
            description="Nothing sends until you check students in the review list and click Approve All."
            onClick={() => patch({ sendMode: "manual" })}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 22,
          background: "var(--paper)",
          border: "1px solid var(--hairline)",
          borderRadius: 8,
          boxShadow: "var(--shadow-1)",
          padding: "22px 24px",
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 14 }}>
          <input type="checkbox" checked={draft.hasTimer} onChange={(e) => patch({ hasTimer: e.target.checked })} />
          Use a send delay timer
        </label>

        {draft.hasTimer ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ClockIcon size={16} />
            <span style={{ fontSize: 13.5 }}>Send</span>
            <input
              type="number"
              min={0}
              max={72}
              value={draft.delayHours}
              onChange={(e) => patch({ delayHours: Number(e.target.value) })}
              style={{ width: 70 }}
            />
            <span style={{ fontSize: 13.5 }}>hours after review starts</span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--ink-soft)" }}>
            <ClockIcon size={16} />
            Sending once you're done
          </div>
        )}
      </div>

      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="field-label" htmlFor="run-window">
            Run window (days, max 7)
          </label>
          <input
            type="number"
            id="run-window"
            min={1}
            max={7}
            value={draft.runWindowDays}
            onChange={(e) => patch({ runWindowDays: Math.min(7, Math.max(1, Number(e.target.value))) })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="check-interval">
            Re-check every (hours, min 4)
          </label>
          <input
            type="number"
            id="check-interval"
            min={4}
            value={draft.checkIntervalHours}
            onChange={(e) => patch({ checkIntervalHours: Math.max(4, Number(e.target.value)) })}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 18, fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
        <CheckIcon size={15} />
        Will re-check your sheet every {draft.checkIntervalHours}h for {draft.runWindowDays} day
        {draft.runWindowDays === 1 ? "" : "s"}, then stop. You can always hit Resend manually after that.
      </div>
    </>
  );
}
