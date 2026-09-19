export interface WizardDraft {
  certificateName: string;
  templateUrl: string;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  letterSpacing: "normal" | "wide";
  sheetUrl: string;
  formUrl: string;
  dedupeByEmail: boolean;
  qualifyingColumn: string;
  acceptedValues: string[];
  reasonColumn: string;
  emailTemplateId: string;
  nonQualEmailBody: string;
  sendMode: "auto" | "manual";
  hasTimer: boolean;
  delayHours: number;
  runWindowDays: number;
  checkIntervalHours: number;
}

export const defaultDraft: WizardDraft = {
  certificateName: "Spring Honor Roll",
  templateUrl: "",
  fontFamily: "Source Serif 4",
  fontSize: 28,
  bold: false,
  italic: false,
  letterSpacing: "normal",
  sheetUrl: "",
  formUrl: "",
  dedupeByEmail: true,
  qualifyingColumn: "Work Placement Status",
  acceptedValues: ["Completed", "Yes", "Done", "Y"],
  reasonColumn: "",
  emailTemplateId: "classic",
  nonQualEmailBody: "",
  sendMode: "manual",
  hasTimer: true,
  delayHours: 4,
  runWindowDays: 5,
  checkIntervalHours: 4,
};

const STORAGE_KEY = "seal.wizard.draft";

export function loadDraft(): WizardDraft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultDraft };
    return { ...defaultDraft, ...(JSON.parse(raw) as Partial<WizardDraft>) };
  } catch {
    return { ...defaultDraft };
  }
}

export function saveDraft(draft: WizardDraft) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // ignore — autosave is a convenience, not a guarantee
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
