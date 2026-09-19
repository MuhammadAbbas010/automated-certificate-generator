const STEPS = ["Template", "Data Source", "Qualification", "Email", "Schedule"];
const MIN_START = 0.12; // "endowed progress" — never start the bar at 0%, see docs/mockups/DESIGN.md

export function WizardProgress({ currentStep }: { currentStep: number }) {
  const progress = MIN_START + (currentStep / (STEPS.length - 1)) * (1 - MIN_START);

  return (
    <div style={{ padding: "28px 40px 24px", borderBottom: "1px solid var(--hairline)" }}>
      <div style={{ width: 920, margin: "0 auto", maxWidth: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, marginBottom: 10 }}>
          {STEPS.map((label, i) => (
            <div
              key={label}
              className="step-label"
              style={{
                fontSize: 12,
                fontWeight: 600,
                textAlign: "center",
                color: i === currentStep ? "var(--ink)" : "var(--ink-muted)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div style={{ position: "relative", height: 4, background: "var(--hairline-strong)", borderRadius: 2 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 4,
              width: "100%",
              background: "var(--accent)",
              borderRadius: 2,
              transform: `scaleX(${progress})`,
              transformOrigin: "left",
              transition: "transform 260ms cubic-bezier(.4,0,.2,1)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: `${progress * 100}%`,
              top: -24,
              transform: "translateX(-50%)",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              boxShadow: "0 3px 8px rgba(33,29,20,0.25)",
              transition: "left 260ms cubic-bezier(.4,0,.2,1)",
            }}
          >
            <span style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "var(--cream)" }} />
            <span style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "var(--cream)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
