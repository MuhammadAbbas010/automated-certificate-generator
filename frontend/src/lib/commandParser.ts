export type ParsedCommand =
  | { kind: "help" }
  | { kind: "send-all" }
  | { kind: "add-time"; hours: number }
  | { kind: "resend" }
  | { kind: "confirm" }
  | { kind: "cancel" }
  | { kind: "unknown"; raw: string };

export function parseCommand(raw: string): ParsedCommand {
  const trimmed = raw.trim();
  if (trimmed === "/help") return { kind: "help" };
  if (trimmed === "/send-all") return { kind: "send-all" };
  if (trimmed === "/resend") return { kind: "resend" };
  if (trimmed === "/confirm") return { kind: "confirm" };
  if (trimmed === "/cancel") return { kind: "cancel" };

  const addTimeMatch = trimmed.match(/^\/add-time\((\d+)\)$/);
  if (addTimeMatch) return { kind: "add-time", hours: Number(addTimeMatch[1]) };

  return { kind: "unknown", raw: trimmed };
}

export const HELP_TEXT =
  "Available commands: /send-all (send everyone checked now, skipping the timer), " +
  "/add-time(N) (push the send timer back N hours), /resend (re-send to students already marked sent), " +
  "/help (show this message).";
