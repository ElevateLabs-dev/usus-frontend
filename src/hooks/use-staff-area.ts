"use client";

import { usePathname } from "next/navigation";

/**
 * Company admins and managers share the same
 * team, training and performance pages. This
 * returns the links for the area being viewed,
 * so a manager stays under /manager.
 */
export function useStaffArea() {
  const pathname = usePathname();

  const isManager =
    pathname === "/manager" ||
    pathname.startsWith("/manager/");

  const base = isManager
    ? "/manager"
    : "/company-admin";

  return {
    isManager,
    base,
    trainees: isManager
      ? "/manager/team"
      : "/company-admin/trainees",
    training: `${base}/training`,
    performance: `${base}/performance`,
  };
}
