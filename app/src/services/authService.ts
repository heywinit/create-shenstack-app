import { httpHelper } from "./httpHelper";
import { useUserStore } from "../stores/userStore";

interface LoginCredentials {
  clientCode: string;
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: {
    id: number;
    username: string;
    clientCode: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<void> {
    try {
      const response = await httpHelper.post<LoginResponse>(
        "/auth/login",
        credentials
      );

      if (!response.success || !response.token) {
        throw new Error(response.message || "Login failed");
      }

      // Store the token and credentials
      useUserStore.getState().setToken(response.token);
      useUserStore.getState().setCredentials(credentials);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    useUserStore.getState().setToken(null);
    useUserStore.getState().setCredentials(null);
  }

  isAuthenticated(): boolean {
    return !!useUserStore.getState().token;
  }
}

export const authService = new AuthService();
