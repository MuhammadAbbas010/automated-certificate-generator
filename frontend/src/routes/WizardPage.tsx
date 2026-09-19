import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WizardProgress } from "../components/WizardProgress";
import { TemplateStep } from "./wizard/TemplateStep";
import { DataSourceStep } from "./wizard/DataSourceStep";
import { QualificationStep } from "./wizard/QualificationStep";
import { EmailStep } from "./wizard/EmailStep";
import { ScheduleStep } from "./wizard/ScheduleStep";
import { defaultDraft, loadDraft, saveDraft, clearDraft, type WizardDraft } from "../data/wizardDraft";

const STEP_COMPONENTS = [TemplateStep, DataSourceStep, QualificationStep, EmailStep, ScheduleStep];

export function WizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<WizardDraft>(() => loadDraft());
  const mainRef = useRef<HTMLDivElement>(null);

  // Autosave — closing the tab mid-wizard shouldn't lose progress (docs/mockups/DESIGN.md).
  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  // Auto-scroll the content column back to top on step change, giving a brief
  // reversible cue rather than yanking focus — see DESIGN.md "auto-scroll to next section".
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function patch(p: Partial<WizardDraft>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  const StepComponent = STEP_COMPONENTS[step];
  const isLast = step === STEP_COMPONENTS.length - 1;

  function handleContinue() {
    if (isLast) {
      clearDraft();
      navigate("/dashboard");
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleSaveExit() {
    saveDraft(draft);
    navigate("/dashboard");
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "var(--cream)", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          height: 64,
          flexShrink: 0,
          borderBottom: "1px solid var(--hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontFamily: "'Source Serif 4',serif", color: "var(--cream)", fontSize: 12, fontWeight: 700 }}>S</span>
            </div>
            <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: 15, fontWeight: 600 }}>Seal</span>
          </div>
          <span style={{ color: "var(--hairline-strong)" }}>/</span>
          <span style={{ fontSize: 14, color: "var(--ink-muted)" }}>New Certificate — {draft.certificateName || "Untitled"}</span>
        </div>
        <button className="btn-ghost-sm" onClick={handleSaveExit}>
          Save &amp; exit
        </button>
      </div>

      <WizardProgress currentStep={step} />

      <div ref={mainRef} style={{ flexGrow: 1, overflowY: "auto", display: "flex", justifyContent: "center", paddingTop: 36, paddingBottom: 24 }}>
        <div style={{ width: 640, maxWidth: "calc(100% - 48px)" }}>
          <StepComponent draft={draft} patch={patch} />
        </div>
      </div>

      <div style={{ flexShrink: 0, minHeight: 88, borderTop: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
        <div style={{ width: 640, maxWidth: "calc(100% - 48px)", display: "flex", justifyContent: "space-between" }}>
          <button className="btn-ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))} style={step === 0 ? { visibility: "hidden" } : undefined}>
            Back
          </button>
          <button className="btn-primary" onClick={handleContinue}>
            {isLast ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export { defaultDraft };
