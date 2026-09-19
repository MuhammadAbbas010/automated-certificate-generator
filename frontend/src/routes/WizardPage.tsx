import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { WizardProgress } from "../components/WizardProgress";
import { TemplateStep } from "./wizard/TemplateStep";
import { DataSourceStep } from "./wizard/DataSourceStep";
import { QualificationStep } from "./wizard/QualificationStep";
import { EmailStep } from "./wizard/EmailStep";
import { ScheduleStep } from "./wizard/ScheduleStep";
import { defaultDraft, loadDraft, saveDraft, clearDraft, type WizardDraft } from "../data/wizardDraft";
import { useCertificates } from "../context/CertificatesContext";

const STEP_COMPONENTS = [TemplateStep, DataSourceStep, QualificationStep, EmailStep, ScheduleStep];

export function WizardPage() {
  const navigate = useNavigate();
  const { createCertificate } = useCertificates();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<WizardDraft>(() => loadDraft());
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

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
      const id = createCertificate(draft);
      clearDraft();
      navigate(`/dashboard/${id}`);
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleSaveExit() {
    saveDraft(draft);
    navigate("/dashboard");
  }

  return (
    <div style={{ width: "100%", height: "100vh", background: "var(--cream)", display: "flex", overflow: "hidden" }}>
      <Sidebar />

      <div style={{ flexGrow: 1, minWidth: 0, minHeight: 0, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
            <span style={{ fontSize: 14, color: "var(--ink-muted)" }}>New Certificate — {draft.certificateName || "Untitled"}</span>
          </div>
          <button className="btn-ghost-sm" onClick={handleSaveExit}>
            Save &amp; exit
          </button>
        </div>

        <WizardProgress currentStep={step} />

        <div ref={mainRef} style={{ flexGrow: 1, minHeight: 0, overflowY: "auto", display: "flex", justifyContent: "center", paddingTop: 36, paddingBottom: 24 }}>
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
    </div>
  );
}

export { defaultDraft };
