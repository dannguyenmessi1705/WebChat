import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, LoginRequest, RegisterRequest, User } from "../types";
import apiService from "../services/api";
import webSocketService from "../services/websocket";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await apiService.login(credentials);
          const { token, user } = response;

          // Store token and user data
          apiService.setAuthToken(token);
          localStorage.setItem("user_data", JSON.stringify(user));

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Connect to WebSocket
          await webSocketService.connect(user.userId);
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || "Login failed";
          throw new Error(message);
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true });
        try {
          await apiService.register(userData);
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message || "Registration failed";
          throw new Error(message);
        }
      },

      logout: () => {
        // Disconnect WebSocket
        webSocketService.disconnect();

        // Clear auth data
        apiService.removeAuthToken();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
        localStorage.setItem("user_data", JSON.stringify(user));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Auto-connect WebSocket if user is authenticated
        if (state?.isAuthenticated && state?.user) {
          webSocketService.connect(state.user.userId).catch(console.error);
        }
      },
    }
  )
);
