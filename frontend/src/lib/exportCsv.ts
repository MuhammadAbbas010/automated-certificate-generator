import type { Student } from "../data/mockStudents";

function csvCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function exportStudentsCsv(students: Student[], certificateName: string) {
  const header = ["Name", "Email", "Column Value", "Status", "Arrived At", "Sent At"];
  const rows = students.map((s) => [
    s.name,
    s.email,
    s.columnValue,
    s.status,
    new Date(s.arrivedAt).toLocaleString(),
    s.sentAt ? new Date(s.sentAt).toLocaleString() : "",
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${certificateName.trim().toLowerCase().replace(/\s+/g, "-") || "certificate"}-students.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
