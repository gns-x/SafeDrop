import axios from "axios";
import { API_URL } from "../config/constants";
import { StudentWithStatus } from "../types/student";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getStudentsByGrade(
  grade: string,
): Promise<StudentWithStatus[]> {
  try {
    const response = await api.get(`/students/grade/${grade}`);
    const studentsWithStatus: StudentWithStatus[] = response.data.map(
      (student: any) => ({
        ...student,
        status: student.status || "IN_CLASS",
        grade: student.grade,
      }),
    );
    return studentsWithStatus;
  } catch (error) {
    console.error("Error fetching students by grade:", error);
    throw new Error("Failed to fetch students");
  }
}

export const getPickupRecordsForGrade = async (grade: string) => {
  try {
    const response = await api.get(`/pickup/records/${grade}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pickup records:", error);
    throw error;
  }
};
