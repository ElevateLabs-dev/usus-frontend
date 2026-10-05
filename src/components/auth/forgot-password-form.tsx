"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Input } from "@/components/ui";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Temporary frontend simulation.
    // Replace with the real password reset API later.
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#a1e510]/15">
          <span className="text-lg text-[#5b8500]">
            ✓
          </span>
        </div>

        <h2 className="text-base font-semibold text-[var(--usus-foreground)]">
          Check your email
        </h2>

        <p className="mt-2 text-[11px] leading-5 text-[var(--usus-muted)]">
          If an account exists with that email,
          we&apos;ve sent instructions to reset your
          password.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-block text-[11px] font-medium text-[var(--usus-green)]"
        >
          Back to Sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="reset-email"
          className="mb-1.5 block text-[11px] text-[var(--usus-foreground)]"
        >
          Email
        </label>

        <Input
          id="reset-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
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

      <Button
        type="submit"
        disabled={loading}
        className="h-10 w-full rounded-full bg-[#5b8500] text-[11px] hover:bg-[#4f7400]"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-[10px] text-[var(--usus-muted)] hover:text-[var(--usus-green)]"
        >
          Back to Sign in
        </Link>
      </div>
    </form>
  );
}
