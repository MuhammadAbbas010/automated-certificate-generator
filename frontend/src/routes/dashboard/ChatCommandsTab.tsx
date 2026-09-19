import { useState } from "react";
import { parseCommand, HELP_TEXT } from "../../lib/commandParser";
import { SendIcon } from "../../components/icons";
import type { Student } from "../../data/mockStudents";
import type { LogEntry } from "../../data/certificate";

interface ChatCommandsTabProps {
  students: Student[];
  updateStudents: (updater: (students: Student[]) => Student[]) => void;
  nextSendAt: Date;
  setNextSendAt: (date: Date) => void;
  log: LogEntry[];
  pushLog: (entry: Omit<LogEntry, "id" | "time">) => void;
}

export function ChatCommandsTab({ students, updateStudents, nextSendAt, setNextSendAt, log, pushLog }: ChatCommandsTabProps) {
  const [input, setInput] = useState("");
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  function submit() {
    const raw = input.trim();
    if (!raw) return;
    setInput("");
    pushLog({ actor: "you", kind: "command", text: raw });

    const cmd = parseCommand(raw);

    if (awaitingConfirm) {
      if (cmd.kind === "confirm") {
        const checkedPending = students.filter((s) => s.checked && s.status === "pending");
        updateStudents((prev) =>
          prev.map((s) => (s.checked && s.status === "pending" ? { ...s, status: "sent" as const, sentAt: new Date().toISOString() } : s))
        );
        pushLog({ actor: "system", kind: "text", text: `Sent ${checkedPending.length} certificate${checkedPending.length === 1 ? "" : "s"} immediately.` });
        setAwaitingConfirm(false);
        return;
      }
      if (cmd.kind === "cancel") {
        pushLog({ actor: "system", kind: "text", text: `Cancelled. Nothing was sent — the scheduled run at ${nextSendAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} is unaffected.` });
        setAwaitingConfirm(false);
        return;
      }
      pushLog({ actor: "system", kind: "text", text: `Waiting for /confirm or /cancel.` });
      return;
    }

    switch (cmd.kind) {
      case "help":
        pushLog({ actor: "system", kind: "text", text: HELP_TEXT });
        break;
      case "send-all": {
        const count = students.filter((s) => s.checked && s.status === "pending").length;
        if (count === 0) {
          pushLog({ actor: "system", kind: "text", text: "No checked, pending students to send right now." });
          break;
        }
        pushLog({
          actor: "system",
          kind: "warning",
          text: `This will send ${count} certificate${count === 1 ? "" : "s"} immediately, skipping the scheduled timer. Type /confirm to proceed, or /cancel to stop.`,
        });
        setAwaitingConfirm(true);
        break;
      }
      case "add-time": {
        const next = new Date(nextSendAt.getTime() + cmd.hours * 60 * 60 * 1000);
        setNextSendAt(next);
        pushLog({
          actor: "system",
          kind: "text",
          text: `Added ${cmd.hours} hour${cmd.hours === 1 ? "" : "s"} to the send timer. New send time: ${next.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
        });
        break;
      }
      case "resend": {
        const sentCount = students.filter((s) => s.status === "sent").length;
        pushLog({ actor: "system", kind: "text", text: `Resent certificates to ${sentCount} student${sentCount === 1 ? "" : "s"} previously marked sent.` });
        break;
      }
      case "confirm":
      case "cancel":
        pushLog({ actor: "system", kind: "text", text: "Nothing to confirm right now." });
        break;
      default:
        pushLog({ actor: "system", kind: "text", text: `Unknown command "${cmd.raw}". Type /help for a list of available commands.` });
    }
  }

  return (
    <div style={{ flexGrow: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ flexGrow: 1, minHeight: 0, overflowY: "auto", padding: "8px 32px 12px" }}>
        {log.map((entry) => (
          <div key={entry.id} style={{ display: "flex", gap: 16, padding: "15px 0", borderTop: "1px solid var(--hairline)" }}>
            <div style={{ width: 60, flexShrink: 0, fontSize: 12, color: "var(--ink-muted)", paddingTop: 1 }}>{entry.time}</div>
            <div style={{ flexGrow: 1 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: entry.actor === "you" ? "var(--accent-ink)" : "var(--ink-muted)",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                {entry.actor === "you" ? "YOU" : "SYSTEM"}
              </span>
              {entry.kind === "command" ? (
                <span
                  className="mono"
                  style={{ display: "inline-flex", fontSize: 12.5, background: "var(--cream-deep)", color: "var(--ink)", borderRadius: 4, padding: "5px 10px" }}
                >
                  {entry.text}
                </span>
              ) : entry.kind === "warning" ? (
                <div
                  style={{
                    borderLeft: "3px solid var(--amber)",
                    background: "var(--amber-soft)",
                    borderRadius: "0 6px 6px 0",
                    padding: "12px 16px",
                    marginTop: 4,
                  }}
                >
                  <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.55 }}>{entry.text}</div>
                </div>
              ) : (
                <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.55 }}>{entry.text}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ flexShrink: 0, borderTop: "1px solid var(--hairline)", background: "var(--paper)", padding: "14px 32px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-muted)", marginRight: 4 }}>
            Commands
          </span>
          {["/help", "/send-all", "/add-time(1)", "/resend"].map((c) => (
            <button
              key={c}
              className="mono"
              onClick={() => setInput(c)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: 12,
                color: "var(--ink-soft)",
                background: "var(--paper)",
                border: "1px solid var(--hairline-strong)",
                borderRadius: 4,
                padding: "6px 12px",
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="text"
            className="mono"
            placeholder="Type a command — try /help"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            style={{ flexGrow: 1, height: 44, border: "1px solid var(--hairline-strong)", borderRadius: 4, padding: "0 16px", fontSize: 13.5, background: "var(--cream)", color: "var(--ink)" }}
          />
          <button
            className="btn-icon"
            style={{ width: 44, height: 44, background: "var(--accent)", color: "var(--cream)" }}
            aria-label="Send"
            onClick={submit}
          >
            <SendIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
