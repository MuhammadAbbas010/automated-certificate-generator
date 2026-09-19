import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Certificate, LogEntry } from "../data/certificate";
import { seedDefaultCertificate } from "../data/certificate";
import type { Student } from "../data/mockStudents";
import type { WizardDraft } from "../data/wizardDraft";

const STORAGE_KEY = "seal.certificates";

function loadCertificates(): Certificate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Certificate[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // malformed storage — fall through to seed
  }
  return [seedDefaultCertificate()];
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface CertificatesContextValue {
  certificates: Certificate[];
  getCertificate: (id: string) => Certificate | undefined;
  createCertificate: (draft: WizardDraft) => string;
  renameCertificate: (id: string, name: string) => void;
  deleteCertificate: (id: string) => void;
  updateStudents: (id: string, updater: (students: Student[]) => Student[]) => void;
  setNextSendAt: (id: string, date: Date) => void;
  pushLog: (id: string, entry: Omit<LogEntry, "id" | "time">) => void;
}

const CertificatesContext = createContext<CertificatesContextValue | undefined>(undefined);

export function CertificatesProvider({ children }: { children: ReactNode }) {
  const [certificates, setCertificates] = useState<Certificate[]>(() => loadCertificates());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
    } catch {
      // storage full/unavailable — autosave is best-effort
    }
  }, [certificates]);

  const value = useMemo<CertificatesContextValue>(
    () => ({
      certificates,
      getCertificate: (id) => certificates.find((c) => c.id === id),
      createCertificate: (draft) => {
        const id = `cert-${Date.now().toString(36)}`;
        const cert: Certificate = {
          id,
          name: draft.certificateName.trim() || "Untitled Certificate",
          createdAt: new Date().toISOString(),
          settings: draft,
          students: [],
          nextSendAt: new Date(Date.now() + draft.delayHours * 60 * 60 * 1000).toISOString(),
          log: [
            {
              id: "l0",
              time: timeNow(),
              actor: "system",
              kind: "text",
              text: "Certificate created. Waiting for form submissions.",
            },
          ],
        };
        setCertificates((prev) => [...prev, cert]);
        return id;
      },
      renameCertificate: (id, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c)));
      },
      deleteCertificate: (id) => {
        setCertificates((prev) => prev.filter((c) => c.id !== id));
      },
      updateStudents: (id, updater) => {
        setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, students: updater(c.students) } : c)));
      },
      setNextSendAt: (id, date) => {
        setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, nextSendAt: date.toISOString() } : c)));
      },
      pushLog: (id, entry) => {
        setCertificates((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, log: [...c.log, { ...entry, id: `l${c.log.length}-${Date.now()}`, time: timeNow() }] }
              : c
          )
        );
      },
    }),
    [certificates]
  );

  return <CertificatesContext.Provider value={value}>{children}</CertificatesContext.Provider>;
}

export function useCertificates() {
  const ctx = useContext(CertificatesContext);
  if (!ctx) throw new Error("useCertificates must be used within CertificatesProvider");
  return ctx;
}
