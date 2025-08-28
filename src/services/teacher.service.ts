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

export async function getStudentsByUser(
  userId: string,
  role: Role,
): Promise<StudentWithStatus[]> {
  try {
    let endpoint: string;

    switch (role) {
      case "TEACHER":
        endpoint = `/students/teacher/${userId}`;
        break;
      default:
        throw new Error(`Unsupported role: ${role}`);
    }

    const students = await apiService.get<StudentData[]>(endpoint);
    console.log("Teacher students response:", students);

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


