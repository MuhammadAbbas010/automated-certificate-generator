import { useState } from "react";
import { Modal } from "./Modal";
import { LowResBadge } from "./LowResBadge";

// Drop the real reference image at frontend/public/exampleCert.png — served at "/exampleCert.png".
// Until then this shows a graceful placeholder instead of a broken image icon.
const EXAMPLE_CERT_SRC = "/exampleCert.png";

export function CertificatePreviewModal({
  studentName,
  certificateName,
  onClose,
}: {
  studentName?: string;
  certificateName: string;
  onClose: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <Modal onClose={onClose} labelledBy="cert-preview-title">
      <h2 id="cert-preview-title" style={{ fontSize: 19, marginBottom: 4, marginTop: 4 }}>
        Certificate preview
      </h2>
      <div style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 18 }}>
        {studentName ? `${studentName} — ${certificateName}` : certificateName}
      </div>

      <div
        style={{
          position: "relative",
          background: "repeating-conic-gradient(#e9e3d3 0% 25%, #f4efe2 0% 50%) 50% / 24px 24px",
          border: "1px solid var(--hairline)",
          borderRadius: 6,
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {!failed ? (
          <img
            src={EXAMPLE_CERT_SRC}
            alt={studentName ? `Certificate preview for ${studentName}` : "Example certificate"}
            onError={() => setFailed(true)}
            style={{ maxWidth: "100%", maxHeight: 420, display: "block" }}
          />
        ) : (
          <div style={{ fontSize: 13, color: "var(--ink-muted)", textAlign: "center", padding: 32, lineHeight: 1.6 }}>
            Reference image not added yet.
            <br />
            Drop it in as <span className="mono">frontend/public/exampleCert.png</span>.
          </div>
        )}
        <LowResBadge />
      </div>
    </Modal>
  );
}
