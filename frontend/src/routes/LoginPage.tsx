import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AVATAR_GRADIENTS } from "../data/avatars";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(1);
  const [touched, setTouched] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = username.trim().length > 0 && emailValid;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    signIn({ username: username.trim(), email: email.trim(), avatarIndex });
    navigate("/dashboard");
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "var(--cream)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 32, left: 40, display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: "'Source Serif 4',serif", color: "var(--cream)", fontSize: 14, fontWeight: 700 }}>S</span>
        </div>
        <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Seal</span>
      </div>

      <div
        style={{
          width: 440,
          background: "var(--paper)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          boxShadow: "var(--shadow-2)",
          padding: "44px 40px 36px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ fontFamily: "'Source Serif 4',serif", color: "var(--cream)", fontSize: 24, fontWeight: 600 }}>S</span>
          </div>
          <h1 style={{ fontSize: 22 }}>Sign in to Seal</h1>
          <div style={{ fontSize: 13, color: "var(--ink-muted)", textAlign: "center", maxWidth: 300, lineHeight: 1.5 }}>
            Certificate automation for your classroom
          </div>
        </div>

        <form style={{ display: "flex", flexDirection: "column", gap: 18 }} onSubmit={handleSubmit} noValidate>
          <div>
            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="e.g. jalvarez"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="email">
              School email
            </label>
            <input
              type="email"
              id="email"
              placeholder="e.g. j.alvarez@lincolnhigh.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={touched && !emailValid ? { borderColor: "var(--rust)" } : undefined}
            />
            {touched && !emailValid && (
              <div style={{ fontSize: 12, color: "var(--rust)", marginTop: 6 }}>Enter a valid email address.</div>
            )}
          </div>

          <div>
            <label className="field-label">Choose an avatar</label>
            <div style={{ display: "flex", gap: 12, paddingTop: 2 }}>
              {AVATAR_GRADIENTS.map((gradient, i) => (
                <button
                  type="button"
                  key={i}
                  aria-label={`Avatar ${i + 1}`}
                  aria-pressed={avatarIndex === i}
                  onClick={() => setAvatarIndex(i)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: `2px solid ${avatarIndex === i ? "var(--accent)" : "transparent"}`,
                    background: gradient,
                    cursor: "pointer",
                    position: "relative",
                    transition: "transform 160ms ease, border-color 160ms ease",
                    boxShadow: avatarIndex === i ? "0 0 0 1px var(--accent)" : "none",
                    outlineOffset: 3,
                  }}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 8, width: "100%" }} disabled={touched && !canSubmit}>
            Continue
          </button>
        </form>

        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: "1px solid var(--hairline)",
            fontSize: 12,
            color: "var(--ink-muted)",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          No password required — access is scoped to your Google account for Sheets, Forms and Gmail.
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 28, fontSize: 12, color: "var(--ink-muted)" }}>
        Lincoln High School · Certificate Desk
      </div>
    </div>
  );
}
