import { apiService } from "./api.service";
import { StudentWithStatus, StatusUpdateRequest } from "../types/student";
import { Role } from "../types/auth";

interface StudentData {
  id: string;
  name: string;
  grade: string;
  cardId: string;
  parentName: string;
  parentEmail: string;
  balance: number;
  photo?: string;
}

export async function getStudentsByUser(
  userId: string,
  role: Role,
): Promise<StudentWithStatus[]> {
  try {
    let endpoint: string;

    switch (role) {
      case "PARENT":
        endpoint = `/students/parent/${userId}`;
        break;
      case "TEACHER":
        endpoint = `/students/teacher/${userId}`;
        break;
      default:
        throw new Error(`Unsupported role: ${role}`);
    }

    const students = await apiService.get<StudentData[]>(endpoint);
    console.log("Students response:", students);

    const studentsWithStatus: StudentWithStatus[] = students.map(
      (student: StudentData) => ({
        ...student,
        status: "IN_CLASS" as const,
        grade: student.grade,
        classroom: student.grade,
        email: student.parentEmail,
        externalCode: student.cardId,
      }),
    );

    return studentsWithStatus;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error("Failed to fetch students");
  }
}

export async function updateStudentStatus(
  request: StatusUpdateRequest,
): Promise<void> {
  try {
    await apiService.patch(`/students/${request.studentId}/status`, request);
  } catch (error) {
    console.error("Error updating student status:", error);
    throw new Error("Failed to update student status");
  }
}

export async function requestPickup(
  request: StatusUpdateRequest,
): Promise<void> {
  try {
    await apiService.post("/pickup/request", request);
  } catch (error) {
    console.error("Error requesting pickup:", error);
    throw new Error("Failed to request pickup");
  }
}
