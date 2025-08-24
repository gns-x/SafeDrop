import { apiService } from "./api.service";
import { StudentWithStatus } from "../types/student";
import { Role } from "../types/auth";

export async function getStudentsByUser(
  userId: string,
  role: Role,
): Promise<StudentWithStatus[]> {
  try {
    let endpoint: string;
    
    switch (role) {
      case 'TEACHER':
        endpoint = `/students/teacher/${userId}`;
        break;
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
    
    const students = await apiService.get<any[]>(endpoint);
    console.log('Teacher students response:', students);
    
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

export async function getStudentsByGrade(
  grade: string,
): Promise<StudentWithStatus[]> {
  try {
    // For now, return empty array since this endpoint doesn't exist
    // In the future, you can implement a grade-based endpoint
    console.warn('getStudentsByGrade is deprecated, use getStudentsByUser instead');
    return [];
  } catch (error) {
    console.error("Error fetching students by grade:", error);
    throw new Error("Failed to fetch students");
  }
}

export const getPickupRecordsForGrade = async (grade: string) => {
  try {
    // For now, return empty array since this endpoint doesn't exist
    // In the future, you can implement a pickup records endpoint
    console.warn('getPickupRecordsForGrade is deprecated, use WebSocket updates instead');
    return [];
  } catch (error) {
    console.error("Error fetching pickup records:", error);
    throw error;
  }
};
