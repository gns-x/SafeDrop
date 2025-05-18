import axios from "axios";
import { API_URL } from "../config/constants";
import { StudentWithStatus } from "../types/student";
import { Role } from "../types/auth";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getStudentsList(
  userId: string,
  role: Role,
): Promise<StudentWithStatus[]> {
  try {
    const response = await api.get(`/students/${userId}/${role}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error("Failed to fetch students");
  }
}

export async function getStudentStatus(studentId: string): Promise<any> {
  try {
    const statusResponse = await api.get(`/students/${studentId}/status`);
    return statusResponse.data;
  } catch (error) {
    console.error("Error fetching student status:", error);
    throw new Error("Failed to fetch student status");
  }
}
