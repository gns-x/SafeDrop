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
    // Fetch latest pickups for the student
    const pickups = await apiService.get<any[]>(
      `/pickups/student/${request.studentId}`,
    );

    if (!Array.isArray(pickups) || pickups.length === 0) {
      throw new Error("No pickup records found for this student");
    }

    // Find the most recent pending pickup
    const pending = pickups.find(
      (p) => p.status === "PENDING" || p.status === "PARENT_ARRIVED",
    ) || pickups[0];

    if (!pending?.id) {
      throw new Error("No valid pickup record to update");
    }

    // Map frontend student status to backend pickup status
    const statusMap: Record<string, string> = {
      WITH_PARENT: "PARENT_ARRIVED",
      PENDING_PICKUP: "PENDING",
      IN_CLASS: "CANCELLED",
      ABSENT: "CANCELLED",
    };

    const pickupStatus = statusMap[request.status] || "PARENT_ARRIVED";

    await apiService.patch(`/pickups/${pending.id}/status`, {
      status: pickupStatus,
    });
  } catch (error) {
    console.error("Error updating student status:", error);
    throw new Error("Failed to update student status");
  }
}


