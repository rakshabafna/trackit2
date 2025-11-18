// Type definitions for the application
export type UserRole = "student" | "mentor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  semester?: number;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "submitted" | "done";
  assignees: string[];
  dueDate: string;
  semester: number;
  groupId: string;
  files?: string[];
}

export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  groupId: string;
  studentName?: string;
  fileUrl: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  rubric?: {
    design?: string;
    clarity?: string;
  };
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  isPinned: boolean;
  groupId?: string;
  fileUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  semester: number;
  students: string[];
  mentors: string[];
  progress: number;
  isOverdue: boolean;
}

export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  timestamp: string;
  fileUrl?: string;
}
