"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getAuthUser,
  type AuthUser,
} from "@/services/auth-state";

import {
  logout as clearAuth,
} from "@/services/auth-service";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const restoreAuthentication = () => {
      const authenticatedUser =
        getAuthUser();

      setUser(authenticatedUser);
      setLoading(false);
    };

    restoreAuthentication();

    const handleAuthChange = () => {
      const authenticatedUser =
        getAuthUser();

      setUser(authenticatedUser);
    };

    window.addEventListener(
      "usus-auth-change",
      handleAuthChange,
    );

    return () => {
      window.removeEventListener(
        "usus-auth-change",
        handleAuthChange,
      );
    };
  }, []);

  function handleLogout() {
    clearAuth();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        loading,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider",
    );
  }

  return context;
};