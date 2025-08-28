export interface Student {
  id: string;
  name: string;
  cardId: string;
  grade: string;
  balance: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
}

export interface PickupRecord {
  id: string;
  studentName: string;
  parentName: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  timestamp: string;
  location: string;
}


