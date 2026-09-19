export type QualificationStatus = "pending" | "not_qualified" | "sent";

export interface Student {
  id: string;
  name: string;
  email: string;
  columnValue: string; // raw value from the qualifying column, e.g. "Completed"
  status: QualificationStatus;
  checked: boolean;
  arrivedAt: string; // ISO timestamp
  sentAt?: string;
}

const now = Date.now();
const hours = (n: number) => new Date(now - n * 60 * 60 * 1000).toISOString();

export const initialStudents: Student[] = [
  { id: "s1", name: "Maria Chen", email: "maria.chen@lincolnhs.edu", columnValue: "Completed", status: "pending", checked: false, arrivedAt: hours(0.4) },
  { id: "s2", name: "Devon Brooks", email: "devon.brooks@lincolnhs.edu", columnValue: "Yes", status: "pending", checked: true, arrivedAt: hours(0.7) },
  { id: "s3", name: "Priya Patel", email: "priya.patel@lincolnhs.edu", columnValue: "No", status: "not_qualified", checked: false, arrivedAt: hours(0.9) },
  { id: "s4", name: "Amir Hassan", email: "amir.hassan@lincolnhs.edu", columnValue: "Done", status: "pending", checked: true, arrivedAt: hours(4) },
  { id: "s5", name: "Lucia Fernandez", email: "lucia.fernandez@lincolnhs.edu", columnValue: "Completed", status: "sent", checked: true, arrivedAt: hours(5), sentAt: hours(4.6) },
  { id: "s6", name: "Noah Williams", email: "noah.williams@lincolnhs.edu", columnValue: "Y", status: "pending", checked: false, arrivedAt: hours(26) },
  { id: "s7", name: "Elena Kowalski", email: "elena.kowalski@lincolnhs.edu", columnValue: "Yes", status: "pending", checked: false, arrivedAt: hours(28) },
  { id: "s8", name: "Marcus Johnson", email: "marcus.johnson@lincolnhs.edu", columnValue: "Completed", status: "pending", checked: false, arrivedAt: hours(31) },
  { id: "s9", name: "Aisha Khan", email: "aisha.khan@lincolnhs.edu", columnValue: "No", status: "not_qualified", checked: false, arrivedAt: hours(33) },
  { id: "s10", name: "Tomás Reyes", email: "tomas.reyes@lincolnhs.edu", columnValue: "Done", status: "pending", checked: false, arrivedAt: hours(36) },
  { id: "s11", name: "Grace Lin", email: "grace.lin@lincolnhs.edu", columnValue: "Yes", status: "pending", checked: false, arrivedAt: hours(38) },
  { id: "s12", name: "Samuel Osei", email: "samuel.osei@lincolnhs.edu", columnValue: "Y", status: "pending", checked: false, arrivedAt: hours(40) },
];

// pad out "Last Week" bucket to roughly match the mockup's stated counts
for (let i = 0; i < 21; i++) {
  initialStudents.push({
    id: `w${i}`,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@lincolnhs.edu`,
    columnValue: "Completed",
    status: i < 2 ? "not_qualified" : "pending",
    checked: false,
    arrivedAt: hours(24 * 5 + i),
  });
}
