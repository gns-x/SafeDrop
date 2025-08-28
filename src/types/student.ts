export type StudentStatus = "IN_CLASS" | "WITH_PARENT" | "PENDING_PICKUP";

export interface StudentWithStatus {
  classroom: ReactNode;
  id: string;
  name: string;
  cardId: string;
  email: string;
  grade: string;
  balance: number;
  photo?: string | null;
  externalCode: string;
  status: StudentStatus;
}

export interface StatusUpdateRequest {
  studentId: string;
  status: StudentStatus;
  parentId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}


