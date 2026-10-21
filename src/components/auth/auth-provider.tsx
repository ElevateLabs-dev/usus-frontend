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

import { getMyProfile } from "@/services/profile-service";

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

    /*
     * The token keeps the role the user had when
     * they signed in, but the backend always uses
     * the current one. If it has changed since,
     * sign in again so the app shows the right pages.
     */
    const signedIn = getAuthUser();

    if (signedIn) {
      getMyProfile()
        .then((profile) => {
          if (profile.role !== signedIn.role) {
            clearAuth();
            window.location.replace(
              "/login?reason=role-changed",
            );
          }
        })
        .catch(() => {
          // Handled by the API client (401) or the page.
        });
    }

    const handleAuthChange = () => {
      const authenticatedUser =
        getAuthUser();

      setUser(authenticatedUser);
    };

    /*
     * Signing in or out in another tab changes
     * the shared token: follow it, so this tab
     * never sends requests without one.
     */
    const handleStorage = (
      event: StorageEvent,
    ) => {
      if (event.key !== "usus_access_token") {
        return;
      }

      if (!event.newValue) {
        window.location.replace("/login");
        return;
      }

      window.location.reload();
    };

    window.addEventListener(
      "usus-auth-change",
      handleAuthChange,
    );

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        "usus-auth-change",
        handleAuthChange,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
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