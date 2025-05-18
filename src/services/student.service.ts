import axios from "axios";
import { API_URL } from "../config/constants";
import { StudentWithStatus, StatusUpdateRequest } from "../types/student";
import { Role } from "../types/auth";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getStudentsByUser(
  userId: string,
  role: Role,
): Promise<StudentWithStatus[]> {
  try {
    const response = await api.get(`/students/${userId}/${role}`);
    console.log('Miyakoooo : ', response.data);
    // Transform the response data to include status and ensure grade is preserved
    const studentsWithStatus: StudentWithStatus[] = await Promise.all(
      response.data.map(async (student: any) => {
        const statusResponse = await api.get(`/students/${student.id}/status`);
        return {
          ...student,
          status: statusResponse.data.status,
          grade: student.grade || statusResponse.data.grade, // Ensure grade is preserved
        };
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
    await api.patch(`/students/${request.studentId}/status`, request);
  } catch (error) {
    console.error("Error updating student status:", error);
    throw new Error("Failed to update student status");
  }
}

export async function requestPickup(
  request: StatusUpdateRequest,
): Promise<void> {
  try {
    await api.post("/pickup/request", request);
  } catch (error) {
    console.error("Error requesting pickup:", error);
    throw new Error("Failed to request pickup");
  }
}
