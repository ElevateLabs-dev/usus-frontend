"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import { PasswordInput } from "./password-input";

import { changePassword } from "@/services/auth-service";
import {
  getUserRole,
  isAuthenticated,
} from "@/services/auth-state";
import { getRoleHome } from "@/services/role-routing";

const labelClassName = `
  mb-2
  block
  text-xs
  font-medium
  text-[var(--usus-text)]
`;

export function ChangePasswordForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * This page needs a signed-in user
   * (the temporary-password token).
   */
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const form = new FormData(event.currentTarget);

    const currentPassword = String(
      form.get("currentPassword") ?? "",
    );

    const newPassword = String(
      form.get("newPassword") ?? "",
    );

    const confirmPassword = String(
      form.get("confirmPassword") ?? "",
    );

    if (!currentPassword) {
      setError(
        "Please enter the temporary password from your invitation email.",
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Your new password must be at least 8 characters.",
      );
      return;
    }

    if (newPassword === currentPassword) {
      setError(
        "Your new password must be different from the temporary password.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Stores the new token, which no longer
       * carries the password-change restriction.
       */
      await changePassword(
        currentPassword,
        newPassword,
      );

      const role = getUserRole();

      router.replace(
        role ? getRoleHome(role) : "/login",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to change your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      {/* Temporary password */}
      <div>
        <label
          htmlFor="currentPassword"
          className={labelClassName}
        >
          Temporary password
        </label>

        <PasswordInput
          id="currentPassword"
          name="currentPassword"
          placeholder="From your invitation email"
          autoComplete="current-password"
          required
          disabled={loading}
        />
      </div>

      {/* New password */}
      <div>
        <label
          htmlFor="newPassword"
          className={labelClassName}
        >
          New password
        </label>

        <PasswordInput
          id="newPassword"
          name="newPassword"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          disabled={loading}
        />
      </div>

      {/* Confirm new password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className={labelClassName}
        >
          Confirm new password
        </label>

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          required
          disabled={loading}
        />
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-3
            py-2.5
            text-xs
            leading-5
            text-red-600
            dark:border-red-900
            dark:bg-red-950
            dark:text-red-300
          "
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="
          mt-1
          h-11
          w-full
          rounded-xl
          bg-[var(--usus-primary)]
          text-sm
          font-semibold
          text-[#111111]
          transition-colors
          hover:bg-[var(--usus-primary-hover)]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading
          ? "Saving..."
          : "Set password and continue"}
      </Button>
    </form>
  );
}
