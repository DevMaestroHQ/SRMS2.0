import { apiRequest } from "./queryClient";
import { type LoginCredentials } from "@shared/schema";

export interface AuthState {
  isAuthenticated: boolean;
  admin: {
    id: number;
    email: string;
    name: string;
  } | null;
  token: string | null;
}

class AuthManager {
  private static instance: AuthManager;
  private authState: AuthState = {
    isAuthenticated: false,
    admin: null,
    token: null,
  };

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  getAuthState(): AuthState {
    return this.authState;
  }

  async login(credentials: LoginCredentials): Promise<AuthState> {
    const data = await apiRequest("/api/admin/login", {
      method: "POST",
      body: credentials,
    });
    
    this.authState = {
      isAuthenticated: true,
      admin: data.admin,
      token: data.token,
    };
    
    // Store token in localStorage
    localStorage.setItem("auth_token", data.token);
    
    return this.authState;
  }

  async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/admin/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.authState = {
          isAuthenticated: true,
          admin: data.admin,
          token,
        };
        return true;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
    }

    this.logout();
    return false;
  }

  logout(): void {
    this.authState = {
      isAuthenticated: false,
      admin: null,
      token: null,
    };
    localStorage.removeItem("auth_token");
  }

  getAuthHeaders(): Record<string, string> {
    return this.authState.token
      ? { Authorization: `Bearer ${this.authState.token}` }
      : {};
  }
}

export const authManager = AuthManager.getInstance();
