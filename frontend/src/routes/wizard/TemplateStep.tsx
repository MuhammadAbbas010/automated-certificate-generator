import type { WizardDraft } from "../../data/wizardDraft";

const FONTS = ["Source Serif 4", "Playfair Display", "EB Garamond", "Cormorant Garamond"];

export function TemplateStep({
  draft,
  patch,
}: {
  draft: WizardDraft;
  patch: (p: Partial<WizardDraft>) => void;
}) {
  return (
    <>
      <h1 style={{ fontSize: 27 }}>Certificate template</h1>
      <div style={{ fontSize: 14, color: "var(--ink-muted)", marginTop: 8, lineHeight: 1.55 }}>
        Point us at your draft in Google Slides. We'll read its fonts and layout so every copy matches exactly —
        only the student's name changes.
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
        <label className="field-label" htmlFor="cert-name">
          Certificate name
        </label>
        <input
          type="text"
          id="cert-name"
          placeholder="e.g. Spring Honor Roll"
          value={draft.certificateName}
          onChange={(e) => patch({ certificateName: e.target.value })}
        />

        <label className="field-label" htmlFor="template-url" style={{ marginTop: 20, display: "block" }}>
          Google Slides template link
        </label>
        <input
          type="text"
          id="template-url"
          placeholder="e.g. https://docs.google.com/presentation/d/..."
          value={draft.templateUrl}
          onChange={(e) => patch({ templateUrl: e.target.value })}
        />

        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: 10,
            padding: "12px 16px",
            background: "var(--amber-soft)",
            borderLeft: "3px solid var(--amber)",
            borderRadius: "0 6px 6px 0",
            fontSize: 13,
            color: "var(--ink)",
            lineHeight: 1.55,
          }}
        >
          <span aria-hidden style={{ fontWeight: 700, color: "var(--amber)" }}>
            !
          </span>
          <span>
            Course name and date aren't auto-detected — add them directly to your Slides template before
            generating copies.
          </span>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 12 }}>
          Font &amp; style (read from your template — adjust if needed)
        </div>
        <div
          style={{
            background: "var(--paper)",
            border: "1px solid var(--hairline)",
            borderRadius: 8,
            padding: "20px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 120px",
            gap: 16,
          }}
        >
          <div>
            <label className="field-label" htmlFor="font-family">
              Font family
            </label>
            <select
              id="font-family"
              className="select-native"
              value={draft.fontFamily}
              onChange={(e) => patch({ fontFamily: e.target.value })}
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="font-size">
              Size
            </label>
            <input
              type="number"
              id="font-size"
              value={draft.fontSize}
              min={10}
              max={96}
              onChange={(e) => patch({ fontSize: Number(e.target.value) })}
            />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 20, marginTop: 4 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-soft)" }}>
              <input type="checkbox" checked={draft.bold} onChange={(e) => patch({ bold: e.target.checked })} />
              Bold
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-soft)" }}>
              <input type="checkbox" checked={draft.italic} onChange={(e) => patch({ italic: e.target.checked })} />
              Italic
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-soft)" }}>
              <input
                type="checkbox"
                checked={draft.letterSpacing === "wide"}
                onChange={(e) => patch({ letterSpacing: e.target.checked ? "wide" : "normal" })}
              />
              Wide letter-spacing
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
