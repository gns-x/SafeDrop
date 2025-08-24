import { apiService } from "./api.service";
import { StudentWithStatus } from "../types/student";
import { Role } from "../types/auth";

export async function getStudentsList(
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
    
    // Transform the response data to include default status
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

export async function getStudentStatus(studentId: string): Promise<any> {
  try {
    // For now, return default status since this endpoint doesn't exist
    // In the future, you can implement a student status endpoint
    console.warn('getStudentStatus is deprecated, use WebSocket updates instead');
    return { status: 'IN_CLASS' };
  } catch (error) {
    console.error("Error fetching student status:", error);
    throw new Error("Failed to fetch student status");
  }
}
