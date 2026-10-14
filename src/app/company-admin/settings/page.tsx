"use client";

import { useEffect, useState } from "react";

import { changePassword } from "@/services/auth-service";

import {
  getMyOrganisation,
  renameMyOrganisation,
  type MyOrganisation,
} from "@/services/company-service";

import {
  getMyProfile,
  updateMyName,
} from "@/services/profile-service";

import type { OrgUser } from "@/services/users-service";

const inputClassName =
  "h-10 w-full rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-3 text-sm text-[var(--usus-text)] outline-none transition-colors placeholder:text-[var(--usus-text-soft)] focus:border-[var(--usus-primary)] focus:ring-2 focus:ring-[var(--usus-primary-soft)] disabled:opacity-60 sm:max-w-xs";

const buttonClassName =
  "w-fit cursor-pointer rounded-lg bg-[var(--usus-primary)] px-4 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

type Message = {
  kind: "error" | "success";
  text: string;
} | null;

export default function CompanySettingsPage() {
  const [organisation, setOrganisation] =
    useState<MyOrganisation | null>(null);

  const [profile, setProfile] =
    useState<OrgUser | null>(null);

  const [organisationName, setOrganisationName] =
    useState("");

  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");

  /** Which form is being saved. */
  const [saving, setSaving] = useState<
    string | null
  >(null);

  const [message, setMessage] =
    useState<Message>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getMyOrganisation(),
      getMyProfile(),
    ])
      .then(([nextOrganisation, nextProfile]) => {
        if (cancelled) {
          return;
        }

        setOrganisation(nextOrganisation);
        setOrganisationName(nextOrganisation.name);
        setProfile(nextProfile);
        setFullName(nextProfile.full_name ?? "");
      })
      .catch((err) => {
        if (!cancelled) {
          setMessage({
            kind: "error",
            text:
              err instanceof Error
                ? err.message
                : "Unable to load the settings.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function save(
    key: string,
    action: () => Promise<void>,
    success: string,
  ) {
    setSaving(key);
    setMessage(null);

    try {
      await action();
      setMessage({
        kind: "success",
        text: success,
      });
    } catch (err) {
      setMessage({
        kind: "error",
        text:
          err instanceof Error
            ? err.message
            : "Unable to save.",
      });
    } finally {
      setSaving(null);
    }
  }

  function handleRename(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    void save(
      "organisation",
      async () => {
        const updated =
          await renameMyOrganisation(
            organisationName.trim(),
          );

        setOrganisation(updated);
        setOrganisationName(updated.name);
      },
      "The organisation name was updated.",
    );
  }

  function handleName(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    void save(
      "name",
      async () => {
        setProfile(
          await updateMyName(fullName.trim()),
        );
      },
      "Your name was updated.",
    );
  }

  function handlePassword(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    void save(
      "password",
      async () => {
        await changePassword(
          currentPassword,
          newPassword,
        );

        setCurrentPassword("");
        setNewPassword("");
      },
      "Your password was changed.",
    );
  }

  const organisationChanged =
    organisation !== null &&
    organisationName.trim().length >= 2 &&
    organisationName.trim() !== organisation.name;

  const nameChanged =
    profile !== null &&
    fullName.trim().length > 0 &&
    fullName.trim() !== (profile.full_name ?? "");

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <div>
            <p className="text-xs font-medium text-[var(--usus-primary)]">
              Organisation
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              Your organisation&apos;s details and your
              own account.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              role={
                message.kind === "error"
                  ? "alert"
                  : "status"
              }
              className={
                message.kind === "error"
                  ? "mt-6 rounded-xl border border-[var(--usus-danger)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-danger)]"
                  : "mt-6 rounded-xl border border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] px-4 py-3 text-sm text-[var(--usus-text)]"
              }
            >
              {message.text}
            </div>
          )}

          {/* Organisation */}
          <SettingsSection
            title="Organisation"
            description="How your organisation appears on USUS."
          >
            <form
              onSubmit={handleRename}
              className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <label
                htmlFor="organisation-name"
                className="text-sm font-medium text-[var(--usus-text)]"
              >
                Organisation name
              </label>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <input
                  id="organisation-name"
                  value={organisationName}
                  onChange={(event) =>
                    setOrganisationName(
                      event.target.value,
                    )
                  }
                  disabled={!organisation}
                  className={inputClassName}
                />

                <button
                  type="submit"
                  disabled={
                    !organisationChanged ||
                    saving === "organisation"
                  }
                  className={buttonClassName}
                >
                  {saving === "organisation"
                    ? "Saving..."
                    : "Save"}
                </button>
              </div>
            </form>

            <InfoRow
              label="Status"
              value={
                organisation
                  ? organisation.is_active
                    ? "Active"
                    : "Inactive"
                  : "—"
              }
            />

            <InfoRow
              label="On USUS since"
              value={
                organisation
                  ? formatDate(organisation.created_at)
                  : "—"
              }
            />
          </SettingsSection>

          {/* Account */}
          <SettingsSection
            title="Your Account"
            description="Your own details as a company admin."
          >
            <InfoRow
              label="Email"
              value={profile?.email ?? "—"}
            />

            <form
              onSubmit={handleName}
              className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <label
                htmlFor="full-name"
                className="text-sm font-medium text-[var(--usus-text)]"
              >
                Full name
              </label>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <input
                  id="full-name"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  disabled={!profile}
                  className={inputClassName}
                />

                <button
                  type="submit"
                  disabled={
                    !nameChanged ||
                    saving === "name"
                  }
                  className={buttonClassName}
                >
                  {saving === "name"
                    ? "Saving..."
                    : "Save"}
                </button>
              </div>
            </form>

            <form
              onSubmit={handlePassword}
              className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-[var(--usus-text)]">
                  Password
                </p>

                <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                  At least 8 characters.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto">
                <input
                  type="password"
                  aria-label="Current password"
                  placeholder="Current password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value,
                    )
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

                <button
                  type="submit"
                  disabled={
                    !currentPassword ||
                    newPassword.length < 8 ||
                    saving === "password"
                  }
                  className={buttonClassName}
                >
                  {saving === "password"
                    ? "Changing..."
                    : "Change password"}
                </button>
              </div>
            </form>
          </SettingsSection>
        </div>
      </section>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)] first-of-type:mt-8">
      <div className="border-b border-[var(--usus-border)] px-6 py-5">
        <h2 className="text-base font-semibold text-[var(--usus-text)]">
          {title}
        </h2>

        <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
          {description}
        </p>
      </div>

      <div className="divide-y divide-[var(--usus-border-soft)]">
        {children}
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-[var(--usus-text)]">
        {label}
      </p>

      <span className="w-fit rounded-md border border-[var(--usus-border)] bg-[var(--usus-surface-soft)] px-3 py-1.5 text-xs font-medium text-[var(--usus-text-muted)]">
        {value}
      </span>
    </div>
  );
}
