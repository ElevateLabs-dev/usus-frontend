"use client";

import { useState } from "react";

import { changePassword } from "@/services/auth-service";

const inputClassName =
  "h-10 w-full rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-3 text-sm text-[var(--usus-text)] outline-none transition-colors placeholder:text-[var(--usus-text-soft)] focus:border-[var(--usus-primary)] focus:ring-2 focus:ring-[var(--usus-primary-soft)] disabled:opacity-60 sm:max-w-xs";

const buttonClassName =
  "w-fit cursor-pointer rounded-lg bg-[var(--usus-primary)] px-4 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60";

type Message = {
  kind: "success" | "error";
  text: string;
} | null;

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saving, setSaving] = useState(false);

  const [message, setMessage] =
    useState<Message>(null);

  async function handlePassword(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({
        kind: "error",
        text: "The new passwords do not match.",
      });
      return;
    }

    setSaving(true);

    try {
      await changePassword(
        currentPassword,
        newPassword,
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage({
        kind: "success",
        text: "Your password was changed.",
      });
    } catch (err) {
      setMessage({
        kind: "error",
        text:
          err instanceof Error
            ? err.message
            : "Unable to change your password.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="mb-8">
        <p className="text-sm text-[var(--usus-text-muted)]">
          Trainee / Settings
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[var(--usus-text)]">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
          Manage your account.
        </p>
      </div>

      {message && (
        <div
          role={
            message.kind === "error"
              ? "alert"
              : "status"
          }
          className={
            message.kind === "error"
              ? "mb-6 rounded-xl border border-[var(--usus-danger)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-danger)]"
              : "mb-6 rounded-xl border border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] px-4 py-3 text-sm text-[var(--usus-text)]"
          }
        >
          {message.text}
        </div>
      )}

      <section className="rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
        <div className="border-b border-[var(--usus-border)] px-6 py-5">
          <h2 className="text-base font-semibold text-[var(--usus-text)]">
            Password
          </h2>

          <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
            At least 8 characters.
          </p>
        </div>

        <form
          onSubmit={handlePassword}
          className="flex flex-col gap-3 px-6 py-5"
        >
          <input
            type="password"
            aria-label="Current password"
            placeholder="Current password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            className={inputClassName}
          />

          <input
            type="password"
            aria-label="New password"
            placeholder="New password"
            autoComplete="new-password"
            minLength={8}
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            className={inputClassName}
          />

          <input
            type="password"
            aria-label="Confirm new password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            className={inputClassName}
          />

          <button
            type="submit"
            disabled={
              !currentPassword ||
              newPassword.length < 8 ||
              !confirmPassword ||
              saving
            }
            className={buttonClassName}
          >
            {saving
              ? "Changing..."
              : "Change password"}
          </button>
        </form>
      </section>
    </main>
  );
}
