import axios, { type AxiosInstance } from "axios";
import {
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
  type User,
  type ApiResponse,
} from "../types";
import { config } from "../config";

class ApiService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      "/users/login",
      credentials
    );
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse> {
    const response = await this.api.post<ApiResponse>(
      "/users/register",
      userData
    );
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>("/users/me");
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.api.put<User>("/users/me", userData);
    return response.data;
  }

  // Contact endpoints
  async searchUsers(query: string): Promise<User[]> {
    const response = await this.api.get<User[]>(
      `/users/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  }

  async getContacts(): Promise<User[]> {
    const response = await this.api.get<User[]>("/users/contacts");
    return response.data;
  }

  async addContact(userId: string): Promise<ApiResponse> {
    const response = await this.api.post<ApiResponse>("/users/contacts", {
      userId,
    });
    return response.data;
  }

  async removeContact(userId: string): Promise<ApiResponse> {
    const response = await this.api.delete<ApiResponse>(
      `/users/contacts/${userId}`
    );
    return response.data;
  }

  // Message endpoints (mainly for loading history)
  async getConversationMessages(conversationId: string, page = 0, size = 50) {
    const response = await this.api.get(
      `/messages/conversation/${conversationId}?page=${page}&size=${size}`
    );
    return response.data;
  }

  // File upload endpoints
  async uploadFile(file: File): Promise<{ url: string; id: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.api.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async getMediaFile(mediaId: string): Promise<string> {
    const response = await this.api.get(`/media/${mediaId}`);
    return response.data.url;
  }

  // Utility methods
  setAuthToken(token: string) {
    localStorage.setItem("auth_token", token);
  }

  removeAuthToken() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  }

  getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }
}

export const apiService = new ApiService();
export default apiService;
