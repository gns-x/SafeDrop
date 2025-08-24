import { apiService } from "./api.service";
import { Role, AuthResponse } from "../types/auth";

interface LoginPayload {
  accessCode: string;
}

interface LoginResponse {
  access_token: string;
  user: User;
}

interface BackendError {
  message?: string;
  error?: string;
}

interface BackendErrorResponse {
  data: BackendError;
}

interface BackendErrorWithResponse {
  response: BackendErrorResponse;
}

export async function authenticate(
  accessCode: string,
  role: Role,
): Promise<AuthResponse> {
  try {
    let endpoint: string;
    let payload: LoginPayload;

    switch (role) {
      case "PARENT":
        endpoint = "/auth/parent-login";
        payload = { accessCode };
        break;
      case "TEACHER":
        endpoint = "/auth/teacher-login";
        payload = { accessCode };
        break;
      default:
        throw new Error(`Unsupported role: ${role}`);
    }

    const response = await apiService.post<LoginResponse>(endpoint, payload);

    // Backend returns { access_token, user } structure
    if (response.access_token && response.user) {
      // Store the access token for future API calls
      localStorage.setItem("access_token", response.access_token);

      return {
        success: true,
        user: response.user,
        access_token: response.access_token,
      };
    } else {
      return {
        success: false,
        error: "Invalid response from server",
      };
    }
  } catch (error: unknown) {
    console.error("Authentication error:", error);
    if (error && typeof error === "object" && "response" in error) {
      // Handle backend error responses
      const backendError = error as BackendErrorWithResponse;
      if (backendError.response.data.message) {
        return {
          success: false,
          error: backendError.response.data.message,
        };
      }
      return {
        success: false,
        error: backendError.response.data.error || "Unknown error",
      };
    }
    return {
      success: false,
      error: "Failed to connect to the server",
    };
  }
}

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const response = await apiService.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    // Backend returns { access_token, user } structure
    if (response.access_token && response.user) {
      // Store the access token for future API calls
      localStorage.setItem("access_token", response.access_token);

      return {
        success: true,
        user: response.user,
        access_token: response.access_token,
      };
    } else {
      return {
        success: false,
        error: "Invalid response from server",
      };
    }
  } catch (error: unknown) {
    console.error("Admin authentication error:", error);
    if (error && typeof error === "object" && "response" in error) {
      // Handle backend error responses
      const backendError = error as BackendErrorWithResponse;
      if (backendError.response.data.message) {
        return {
          success: false,
          error: backendError.response.data.message,
        };
      }
      return {
        success: false,
        error: backendError.response.data.error || "Unknown error",
      };
    }
    return {
      success: false,
      error: "Failed to connect to the server",
    };
  }
}
