"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { getRoleHome } from "@/services/role-routing";
import type { UserRole } from "@/types/auth";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({
  allowedRoles,
  children,
}: RoleGuardProps) {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace(getRoleHome(user.role));
    }
  }, [
    allowedRoles,
    isAuthenticated,
    loading,
    router,
    user,
  ]);

  if (
    loading ||
    !isAuthenticated ||
    !user
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--usus-background)] text-[var(--usus-text)]">
        <p className="text-sm">
          Checking access...
        </p>
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};