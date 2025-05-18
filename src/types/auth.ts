export type Role = "PARENT" | "TEACHER" | "ADMIN";

export interface LoginFormData {
  accessCode: string;
  role: Role;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    role: Role;
    grade?: string;
  };
  error?: string;
}

export interface Student {
  id: string;
  name: string;
  cardId: string;
  email: string;
  grade: string;
  balance: number;
  photo?: string | null;
  externalCode: string;
}
