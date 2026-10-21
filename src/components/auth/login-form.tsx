"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";

import { Button, Input } from "@/components/ui";
import { PasswordInput } from "./password-input";

import { login } from "@/services/auth-service";
import { getRoleHome } from "@/services/role-routing";

export function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const [error, setError] = useState(
    searchParams.get("reason") === "role-changed"
      ? "Your role has changed. Please sign in again."
      : "",
  );
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);

    const email = String(
      form.get("email") ?? "",
    ).trim();

    const password = String(
      form.get("password") ?? "",
    );

    /*
     * Validate email
     */
    if (!email) {
      setError(
        "Please enter your email address.",
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(
        "Please enter a valid email address.",
      );
      return;
    }

    /*
     * Validate password
     */
    if (!password) {
      setError(
        "Please enter your password.",
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Your password must be at least 8 characters.",
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * Existing authentication.
       *
       * Tenant ID has intentionally been
       * removed from the login form.
       */
      const session = await login({
        username: email,
        password,
      });

      /*
       * Invited users sign in with a temporary
       * password and must replace it before
       * they can use the app.
       */
      if (session.must_change_password) {
        router.replace("/change-password");
        return;
      }

      /*
       * Get access token
       */
      const token = localStorage.getItem(
        "usus_access_token",
      );

      if (!token) {
        setError(
          "Sign in succeeded, but no access token was received.",
        );
        return;
      }

      /*
       * Decode JWT payload
       */
      const payload = JSON.parse(
        atob(
          token
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/"),
        ),
      );

      /*
       * Determine destination
       * based on the user's role.
       */
      const roleHome = getRoleHome(
        payload.role,
      );

      if (
        !roleHome ||
        roleHome === "/login"
      ) {
        setError(
          "Your account does not have a valid role.",
        );
        return;
      }

      setSuccess(
        "Sign in successful.",
      );

      router.replace(roleHome);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Unable to sign in. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="
              mb-2
              block
              text-xs
              font-medium
              text-[var(--usus-text)]
            "
          >
            Email
          </label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
            disabled={loading}
            className="
              h-11
              rounded-xl
              border-[var(--usus-border)]
              bg-[var(--usus-surface)]
              text-[var(--usus-text)]
              placeholder:text-[var(--usus-text-soft)]
              focus:border-[var(--usus-primary)]
              focus:ring-[var(--usus-primary)]
            "
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="
              mb-2
              block
              text-xs
              font-medium
              text-[var(--usus-text)]
            "
          >
            Password
          </label>

          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
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

        {/* Success */}
        {success && (
          <div
            role="status"
            className="
              rounded-xl
              border
              border-[var(--usus-primary)]
              bg-[var(--usus-primary-soft)]
              px-3
              py-2.5
              text-xs
              leading-5
              text-[var(--usus-text)]
            "
          >
            {success}
          </div>
        )}

        {/* Sign In */}
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
            ? "Signing in..."
            : "Sign In"}
        </Button>
      </form>

      {/* Terms and Privacy */}
      <p
        className="
          mt-6
          text-center
          text-[10px]
          leading-5
          text-[var(--usus-text-muted)]
        "
      >
        By clicking Sign In, you agree to the{" "}
        <a
          href="#"
          className="
            text-[var(--usus-primary)]
            hover:underline
          "
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="
            text-[var(--usus-primary)]
            hover:underline
          "
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};