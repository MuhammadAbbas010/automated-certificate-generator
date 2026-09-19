import type { Student } from "../data/mockStudents";

export interface Bucket {
  key: string;
  label: string;
  students: Student[];
  defaultExpanded: boolean;
}

const HOUR = 60 * 60 * 1000;

// "Just Arrived" mirrors a Downloads-folder aging pattern (docs/plan.md section 7):
// new submissions surface first, then age into coarser buckets over time.
export function bucketStudents(students: Student[]): Bucket[] {
  const now = Date.now();
  const justArrived: Student[] = [];
  const last6h: Student[] = [];
  const yesterday: Student[] = [];
  const lastWeek: Student[] = [];

  for (const s of students) {
    const ageMs = now - new Date(s.arrivedAt).getTime();
    if (ageMs < HOUR) justArrived.push(s);
    else if (ageMs < 6 * HOUR) last6h.push(s);
    else if (ageMs < 48 * HOUR) yesterday.push(s);
    else lastWeek.push(s);
  }

  return [
    { key: "just-arrived", label: "Just Arrived", students: justArrived, defaultExpanded: true },
    { key: "last-6h", label: "Last 6 Hours", students: last6h, defaultExpanded: true },
    { key: "yesterday", label: "Yesterday", students: yesterday, defaultExpanded: false },
    { key: "last-week", label: "Last Week", students: lastWeek, defaultExpanded: false },
  ].filter((b) => b.students.length > 0);
}
