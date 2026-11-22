"use client";

import { useEffect, useRef, useState } from "react";

interface OnboardingStepThreeProps {
  companyEmail: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
}

export function OnboardingStepThree({
  companyEmail,
  onVerify,
  onResend,
  onBack,
}: OnboardingStepThreeProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;

    setOtp(updatedOtp);
    setError("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedCode) return;

    const updatedOtp = Array.from({ length: 6 }, (_, index) =>
      pastedCode[index] || ""
    );

    setOtp(updatedOtp);
    setError("");

    const nextEmptyIndex = updatedOtp.findIndex((digit) => !digit);

    inputRefs.current[
      nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    ]?.focus();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    onVerify(code);
  };

  const handleResend = () => {
    if (countdown > 0) return;

    setOtp(["", "", "", "", "", ""]);
    setError("");
    setCountdown(60);

    onResend();
    inputRefs.current[0]?.focus();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--usus-text)]">
          Verify your email
        </h1>

        <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
          We&apos;ve sent a 6-digit verification code to your company email address.
        </p>
      </div>

      <div className="mb-8 border border-[var(--usus-border)] bg-[var(--usus-surface-soft)] px-4 py-3">
        <p className="text-xs text-[var(--usus-text-muted)]">
          Company email
        </p>

        <p className="mt-1 break-all text-sm font-medium text-[var(--usus-text)]">
          {companyEmail}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="text-sm font-medium text-[var(--usus-text)]">
          Enter verification code
        </label>

        <div className="mt-3 flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(event) =>
                handleChange(event.target.value, index)
              }
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPaste={handlePaste}
              aria-label={`Verification code digit ${index + 1}`}
              className="h-12 w-full min-w-0 border border-[var(--usus-border)] bg-[var(--usus-surface)] text-center text-lg font-semibold text-[var(--usus-text)] outline-none transition focus:border-[var(--usus-primary)] focus:ring-2 focus:ring-[var(--usus-primary-soft)]"
            />
          ))}
        </div>

        {error && (
          <p className="mt-3 text-sm text-[var(--usus-danger)]" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-[var(--usus-text-muted)]">
            Didn&apos;t receive the code?
          </span>

          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0}
            className="font-medium text-[var(--usus-primary)] transition hover:text-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:text-[var(--usus-text-soft)]"
          >
            {countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend code"}
          </button>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="h-12 flex-1 border border-[var(--usus-border)] bg-[var(--usus-surface)] text-sm font-semibold text-[var(--usus-text)] transition hover:bg-[var(--usus-surface-soft)]"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={otp.some((digit) => !digit)}
            className="h-12 flex-1 border border-[var(--usus-primary)] bg-[var(--usus-primary)] text-sm font-semibold text-[#252624] transition hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Verify Email
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-xs text-[var(--usus-text-soft)]">
        Powered by Elevate Labs
      </p>
    </div>
  );
}