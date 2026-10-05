"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { isAuthenticated } from "@/services/auth-state";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const valid = isAuthenticated();

      if (valid) {
        setAuthenticated(true);
        setChecking(false);
        return;
      }

      setChecking(false);
      router.replace(
        `/login?redirect=${encodeURIComponent(pathname)}`,
      );
    };

    checkAuthentication();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--usus-background)] text-[var(--usus-text)]">
        <p className="text-sm">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
};