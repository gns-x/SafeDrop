import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_URL } from '../config/constants';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.clear();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic GET method
  async get<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error, `GET ${url}`);
    }
  }

  // Generic POST method
  async post<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, `POST ${url}`);
    }
  }

  // Generic PATCH method
  async patch<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await this.api.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, `PATCH ${url}`);
    }
  }

  // Generic DELETE method
  async delete<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error, `DELETE ${url}`);
    }
  }

  private handleError(error: any, operation: string): never {
    console.error(`API Error in ${operation}:`, error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'Server error';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
