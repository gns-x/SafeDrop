import axios from "axios";
import { Role, AuthResponse } from "../types/auth";
import { API_URL } from "../config/constants";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function authenticate(
  accessCode: string,
  role: Role,
): Promise<AuthResponse> {
  try {
    const response = await api.post("/auth/login", {
      accessCode,
      role,
    });
    return response.data;
  } catch (error: any) {
    console.error("Authentication error:", error);
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      error: "Failed to connect to the server",
    };
  }
}
