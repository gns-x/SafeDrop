import { apiService } from "./api.service";
import { StudentWithStatus, StatusUpdateRequest } from "../types/student";
import { Role } from "../types/auth";

export async function getStudentsByUser(
  userId: string,
  role: Role,
): Promise<StudentWithStatus[]> {
  try {
    let endpoint: string;
    
    switch (role) {
      case 'PARENT':
        endpoint = `/students/parent/${userId}`;
        break;
      case 'TEACHER':
        endpoint = `/students/teacher/${userId}`;
        break;
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
    
    const students = await apiService.get<any[]>(endpoint);
    console.log('Students response:', students);
    
    // Transform the response data to include default status since status endpoint doesn't exist yet
    const studentsWithStatus: StudentWithStatus[] = students.map((student: any) => ({
      ...student,
      status: 'IN_CLASS', // Default status - will be updated via WebSocket
      grade: student.grade,
    }));
    
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
