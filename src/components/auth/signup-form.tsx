"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { AuthDivider } from "./auth-divider";
import { SocialAuth } from "./social-auth";
import { PasswordInput } from "./password-input";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);

    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(
      form.get("confirmPassword") ?? ""
    );

    if (!email) {
      setError("Please enter your work email.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain a lowercase letter.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain an uppercase letter.");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;'`~]/.test(password)) {
      setError("Password must contain a special character.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Temporary frontend signup simulation.
    // Replace with the real signup API when the backend is connected.
    setTimeout(() => {
      setLoading(false);
      setSuccess("Your account has been created successfully.");
    }, 1000);
  }

  return (
    <div>
      <SocialAuth />

      <AuthDivider />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-3.5"
      >
        <div>
          <label
            htmlFor="signup-email"
            className="mb-1.5 block text-[11px] text-[var(--usus-foreground)]"
          >
            Work Email
          </label>

          <Input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-1.5 block text-[11px] text-[var(--usus-foreground)]"
          >
            Password
          </label>

          <PasswordInput
            id="signup-password"
            name="password"
            autoComplete="new-password"
            required
            disabled={loading}
          />

          <p className="mt-1.5 text-[9px] leading-3 text-[var(--usus-muted)]">
            Must be at least 8 characters long, contain{" "}
            <span className="text-[var(--usus-green)]">
              lowercase
            </span>{" "}
            and{" "}
            <span className="text-[var(--usus-green)]">
              uppercase
            </span>{" "}
            letters, and have at least one special character.
          </p>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-1.5 block text-[11px] text-[var(--usus-foreground)]"
          >
            Confirm Password
          </label>

          <PasswordInput
            id="confirm-password"
            name="confirmPassword"
            autoComplete="new-password"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[10px] text-red-600"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[10px] text-green-700"
          >
            {success}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-10 w-full rounded-full bg-[#5b8500] text-[11px] hover:bg-[#4f7400]"
        >
          {loading
            ? "Creating Workspace..."
            : "Create Workspace"}
        </Button>

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-[10px] text-[var(--usus-muted)] hover:text-[var(--usus-green)]"
          >
            Reset Password
          </Link>
        </div>
      </form>

      <p className="mt-5 text-[10px] leading-4 text-[var(--usus-muted)]">
        By clicking Continue, you agree to the{" "}
        <a
          href="#"
          className="text-[var(--usus-green)]"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-[var(--usus-green)]"
        >
          Privacy Policy
        </a>
        .
      </p>

      <div className="my-7 h-px bg-[var(--usus-border)]" />

      <div>
        <h2 className="text-[13px] font-semibold text-[var(--usus-foreground)]">
          Sign in
        </h2>

        <p className="mt-2 text-[10px] text-[var(--usus-muted)]">
          If you already have an account, please{" "}
          <Link
            href="/login"
            className="text-[var(--usus-green)]"
          >
            sign in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
