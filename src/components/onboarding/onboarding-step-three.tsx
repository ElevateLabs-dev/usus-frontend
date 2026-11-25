"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";

interface OnboardingStepThreeProps {
  companyEmail: string;
  resendIn: number;
  isLoading: boolean;
  error: string;
  isVerified: boolean;

  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<number | null>;
  onBack: () => void;
}

export function OnboardingStepThree({
  companyEmail,
  resendIn,
  isLoading,
  error,
  isVerified,
  onVerify,
  onResend,
  onBack,
}: OnboardingStepThreeProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(resendIn);
  const [localError, setLocalError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setTimeout(() => {
      setCountdown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  // Handle individual OTP input
  function handleChange(value: string, index: number) {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtp((current) => {
      const updated = [...current];
      updated[index] = digit;
      return updated;
    });

    setLocalError("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // Handle keyboard navigation
  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // Handle pasting a complete OTP
  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const digits = Array(6).fill("");

    pasted.split("").forEach((digit, index) => {
      digits[index] = digit;
    });

    setOtp(digits);
    setLocalError("");

    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  // Verify OTP
  async function handleVerify() {
    const code = otp.join("");

    if (code.length !== 6) {
      setLocalError(
        "Please enter the complete 6-digit verification code.",
      );
      return;
    }

    setLocalError("");

    await onVerify(code);
  }

  // Resend OTP
  async function handleResend() {
    if (countdown > 0 || isLoading) return;

    setLocalError("");

    const newCountdown = await onResend();

    // Only reset the OTP when the backend confirms success.
    if (newCountdown !== null) {
      setCountdown(newCountdown);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  }

  // Successful verification screen
  if (isVerified) {
    return (
      <div className="mx-auto w-full max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--usus-primary-soft)]">
          <span className="text-2xl font-semibold text-[var(--usus-primary)]">
            ✓
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-[var(--usus-text)]">
          Email verified successfully
        </h1>

        <p className="mt-3 text-sm leading-6 text-[var(--usus-text-muted)]">
          Your company account has been created and you are now signed in.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Heading */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--usus-primary)]">
          Step 3 of 3
        </p>

        <h1 className="mt-3 text-2xl font-semibold text-[var(--usus-text)]">
          Verify your email address
        </h1>

        <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
          We have sent a verification code to{" "}
          <span className="font-semibold text-[var(--usus-text)]">
            {companyEmail}
          </span>
          . Enter the six-digit code below.
        </p>
      </div>

      {/* OTP inputs */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            disabled={isLoading}
            onChange={(event) =>
              handleChange(event.target.value, index)
            }
            onKeyDown={(event) =>
              handleKeyDown(event, index)
            }
            onPaste={handlePaste}
            aria-label={`Verification digit ${index + 1}`}
            className="
              h-12 w-11 rounded-lg border
              border-[var(--usus-border)]
              bg-[var(--usus-surface)]
              text-center text-lg font-semibold
              text-[var(--usus-text)]
              outline-none transition-colors
              focus:border-[var(--usus-primary)]
              disabled:opacity-60
              sm:h-14 sm:w-14
            "
          />
        ))}
      </div>

      {/* Error messages */}
      {(localError || error) && (
        <p
          role="alert"
          className="
            mt-4 border border-red-500/30
            bg-red-500/10 p-3
            text-sm text-red-600
          "
        >
          {localError || error}
        </p>
      )}

      {/* Verify button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={isLoading || otp.some((digit) => !digit)}
        className="
          mt-7 flex h-12 w-full items-center justify-center
          rounded-lg bg-[var(--usus-primary)]
          px-6 text-sm font-semibold text-black
          transition-colors hover:bg-[var(--usus-primary-hover)]
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        {isLoading ? "Verifying..." : "Verify email"}
      </button>

      {/* Resend code */}
      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--usus-text-muted)]">
          Didn&apos;t receive the code?
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || isLoading}
          className="
            mt-2 text-sm font-semibold
            text-[var(--usus-primary)]
            transition-colors hover:underline
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          {countdown > 0
            ? `Resend code in ${countdown}s`
            : "Resend verification code"}
        </button>
      </div>

      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isLoading}
        className="
          mt-8 w-full text-center text-sm
          text-[var(--usus-text-muted)]
          transition-colors hover:text-[var(--usus-text)]
          disabled:opacity-50
        "
      >
        Back
      </button>

      <p className="mt-8 text-center text-xs text-[var(--usus-text-muted)]">
        Powered by Elevate Labs
      </p>
    </div>
  );
}