import { apiService } from "./api.service";
import { Role, AuthResponse } from "../types/auth";

export async function authenticate(
  accessCode: string,
  role: Role,
): Promise<AuthResponse> {
  try {
    let endpoint: string;
    let payload: any;
    
    switch (role) {
      case 'PARENT':
        endpoint = '/auth/parent-login';
        payload = { accessCode };
        break;
      case 'TEACHER':
        endpoint = '/auth/teacher-login';
        payload = { accessCode };
        break;
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
    
    const response = await apiService.post<any>(endpoint, payload);
    
    // Backend returns { access_token, user } structure
    if (response.access_token && response.user) {
      // Store the access token for future API calls
      localStorage.setItem('access_token', response.access_token);
      
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
  } catch (error: any) {
    console.error("Authentication error:", error);
    if (error.response) {
      // Handle backend error responses
      if (error.response.data.message) {
        return {
          success: false,
          error: error.response.data.message,
        };
      }
      return error.response.data;
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
    const response = await apiService.post<any>('/auth/login', {
      email,
      password,
    });
    
    // Backend returns { access_token, user } structure
    if (response.access_token && response.user) {
      // Store the access token for future API calls
      localStorage.setItem('access_token', response.access_token);
      
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
  } catch (error: any) {
    console.error("Admin authentication error:", error);
    if (error.response) {
      // Handle backend error responses
      if (error.response.data.message) {
        return {
          success: false,
          error: error.response.data.message,
        };
      }
      return error.response.data;
    }
    return {
      success: false,
      error: "Failed to connect to the server",
    };
  }
}
