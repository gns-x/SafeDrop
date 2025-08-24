import { apiService } from "./api.service";
import { StudentWithStatus } from "../types/student";
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

interface StudentStatusData {
  status: string;
}

export async function getStudentsList(
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

export async function getStudentStatus(): Promise<StudentStatusData> {
  try {
    console.warn(
      "getStudentStatus is deprecated, use WebSocket updates instead",
    );
    return { status: "IN_CLASS" };
  } catch (error) {
    console.error("Error fetching student status:", error);
    throw new Error("Failed to fetch student status");
  }
}
