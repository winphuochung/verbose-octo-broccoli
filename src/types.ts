export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface BlueprintParams {
  schoolLevel: string;
  department: string;
  primaryGoal: string;
}

export interface CodeTemplate {
  title: string;
  category: "academic" | "quality" | "automation";
  description: string;
  sheetsSchema: string[];
  appsScript: string;
  lookerGuide: string;
}

export interface Teacher {
  id: string;
  name: string;
  dob: string;
  subject: string;
  degree: string;
  phone: string;
  email: string;
}

export interface Evaluation {
  id: string;
  teacherId: string;
  period: "month" | "quarter" | "year";
  periodValue: string; // e.g., "01-2026"
  score: "Xuất sắc" | "Tốt" | "Hoàn thành" | "Không hoàn thành";
  notes: string;
  date: string;
}

export interface FileItem {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadDate: string;
}
