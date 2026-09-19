import type { Student } from "./mockStudents";
import { initialStudents } from "./mockStudents";
import { defaultDraft, type WizardDraft } from "./wizardDraft";

export interface LogEntry {
  id: string;
  time: string;
  actor: "system" | "you";
  kind: "text" | "command" | "warning";
  text: string;
}

export interface Certificate {
  id: string;
  name: string;
  createdAt: string;
  settings: WizardDraft;
  students: Student[];
  nextSendAt: string;
  log: LogEntry[];
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Seeded so the dashboard has something to show on first run — a real deployment
// starts every new certificate empty (see CertificatesContext.createCertificate).
export function seedDefaultCertificate(): Certificate {
  return {
    id: "spring-honor-roll",
    name: "Spring Honor Roll",
    createdAt: new Date().toISOString(),
    settings: { ...defaultDraft },
    students: initialStudents,
    nextSendAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    log: [
      {
        id: "l0",
        time: timeNow(),
        actor: "system",
        kind: "text",
        text: `Verification stage started. ${initialStudents.length} submissions loaded, ${initialStudents.filter((s) => s.status === "pending").length} pending review.`,
      },
    ],
  };
}
