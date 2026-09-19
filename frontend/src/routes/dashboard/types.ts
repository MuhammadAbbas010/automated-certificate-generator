import type { Dispatch, SetStateAction } from "react";
import type { Student } from "../../data/mockStudents";

export interface LogEntry {
  id: string;
  time: string;
  actor: "system" | "you";
  kind: "text" | "command" | "warning";
  text: string;
}

export interface DashboardState {
  students: Student[];
  setStudents: Dispatch<SetStateAction<Student[]>>;
  nextSendAt: Date;
  setNextSendAt: Dispatch<SetStateAction<Date>>;
  hasTimer: boolean;
  log: LogEntry[];
  pushLog: (entry: Omit<LogEntry, "id" | "time">) => void;
}
