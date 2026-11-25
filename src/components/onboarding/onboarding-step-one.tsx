"use client";

import { useState } from "react";

interface OnboardingStepOneProps {
  companyName: string;
  companyEmail: string;
  fullName: string;
  password: string;
  confirmPassword: string;

  onCompanyNameChange: (value: string) => void;
  onCompanyEmailChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;

  onContinue: () => void;
}

// Password visibility icon
function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {visible ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 002.8 2.8" />
          <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.2" />
          <path d="M6.2 6.2C3.9 7.6 2.5 9.7 2.5 12c1 2.5 4.5 7 9.5 7 1.2 0 2.3-.2 3.3-.7" />
        </>
      ) : (
        <>
          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

export function OnboardingStepOne({
  companyName,
  companyEmail,
  fullName,
  password,
  confirmPassword,
  onCompanyNameChange,
  onCompanyEmailChange,
  onFullNameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onContinue,
}: OnboardingStepOneProps) {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputStyles = `
    h-12 w-full border
    border-[var(--usus-border)]
    bg-[var(--usus-surface)]
    px-4 text-sm
    text-[var(--usus-text)]
    outline-none transition-colors
    placeholder:text-[var(--usus-text-muted)]
    focus:border-[var(--usus-primary)]
  `;

  function handleContinue() {
    setError("");

    if (
      !companyName.trim() ||
      !companyEmail.trim() ||
      !fullName.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    onContinue();
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--usus-primary)]">
          Step 1 of 3
        </p>

        <h1 className="mt-3 text-2xl font-semibold text-[var(--usus-text)]">
          Company information
        </h1>
      </div>

      <div className="space-y-5">
        {/* Company name */}
        <div>
          <label
            htmlFor="companyName"
            className="mb-2 block text-sm font-medium text-[var(--usus-text)]"
          >
            Company name
          </label>

          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(event) => onCompanyNameChange(event.target.value)}
            placeholder="Company name"
            className={inputStyles}
          />
        </div>

        {/* Company email */}
        <div>
          <label
            htmlFor="companyEmail"
            className="mb-2 block text-sm font-medium text-[var(--usus-text)]"
          >
            Email address
          </label>

          <input
            id="companyEmail"
            type="email"
            value={companyEmail}
            onChange={(event) => onCompanyEmailChange(event.target.value)}
            placeholder="Email address"
            className={inputStyles}
          />
        </div>

        {/* Full name */}
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-[var(--usus-text)]"
          >
            Full name
          </label>

          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(event) => onFullNameChange(event.target.value)}
            placeholder="Your full name"
            className={inputStyles}
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[var(--usus-text)]"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Create password"
              autoComplete="new-password"
              className={`${inputStyles} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="
                absolute inset-y-0 right-0 flex w-12
                items-center justify-center
                text-[var(--usus-text-muted)]
                transition-colors hover:text-[var(--usus-text)]
              "
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-[var(--usus-text)]"
          >
            Confirm password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) =>
                onConfirmPasswordChange(event.target.value)
              }
              placeholder="Confirm password"
              autoComplete="new-password"
              className={`${inputStyles} pr-12`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((current) => !current)
              }
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              aria-pressed={showConfirmPassword}
              className="
                absolute inset-y-0 right-0 flex w-12
                items-center justify-center
                text-[var(--usus-text-muted)]
                transition-colors hover:text-[var(--usus-text)]
              "
            >
              <EyeIcon visible={showConfirmPassword} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        {/* Continue */}
        <button
          type="button"
          onClick={handleContinue}
          className="
            flex h-12 w-full items-center justify-center
            bg-[var(--usus-primary)]
            px-6 text-sm font-semibold text-black
            transition-colors hover:bg-[var(--usus-primary-hover)]
          "
        >
          Continue
        </button>
      </div>
    </div>
  );
}