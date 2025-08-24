import { useState } from "react";
import { Role } from "../types/auth";

interface AuthState {
  isAuthenticated: boolean;
  userRole: Role | null;
  userId: string | null;
  userName: string | null;
  userGrade?: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userRole: null,
  userId: null,
  userName: null,
  userGrade: null,
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize state from localStorage during first render only
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole") as Role | null;
    const userName = localStorage.getItem("userName");
    const userGrade = localStorage.getItem("userGrade");

    return {
      isAuthenticated: !!userId && !!userRole,
      userRole,
      userId,
      userName,
      userGrade,
    };
  });

  const login = (userData: {
    id: string;
    role: Role;
    name: string;
    grade?: string;
  }) => {
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("userName", userData.name);
    if (userData.grade) {
      localStorage.setItem("userGrade", userData.grade);
    }

    setAuthState({
      isAuthenticated: true,
      userRole: userData.role,
      userId: userData.id,
      userName: userData.name,
      userGrade: userData.grade || null,
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuthState(initialState);
  };

  return { ...authState, login, logout };
}
