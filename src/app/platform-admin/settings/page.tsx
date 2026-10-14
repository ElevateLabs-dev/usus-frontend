"use client";

import { useEffect, useState } from "react";

import {
  getPlatformSettings,
  getPlatformStatus,
  setMaintenanceMode as saveMaintenanceMode,
} from "@/services/platform-service";

export default function PlatformSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  /** The value currently saved on the backend. */
  const [savedMaintenanceMode, setSavedMaintenanceMode] =
    useState<boolean | null>(null);

  const [environment, setEnvironment] =
    useState("—");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getPlatformSettings(),
      getPlatformStatus(),
    ])
      .then(([settings, status]) => {
        if (cancelled) {
          return;
        }

        setMaintenanceMode(
          settings.maintenance_mode,
        );
        setSavedMaintenanceMode(
          settings.maintenance_mode,
        );
        setEnvironment(status.environment);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load the settings.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const hasChanges =
    savedMaintenanceMode !== null &&
    maintenanceMode !== savedMaintenanceMode;

  async function handleSave() {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const settings =
        await saveMaintenanceMode(
          maintenanceMode,
        );

      setSavedMaintenanceMode(
        settings.maintenance_mode,
      );

      setNotice(
        settings.maintenance_mode
          ? "Maintenance mode is on. Only platform admins can sign in."
          : "Maintenance mode is off. Everyone can sign in again.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <div>
            <p className="text-xs font-medium text-[var(--usus-primary)]">
              Platform
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              Manage platform-wide settings and
              configuration for USUS.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-[var(--usus-danger)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-danger)]"
            >
              {error}
            </div>
          )}

          {/* Notice */}
          {notice && (
            <div
              role="status"
              className="mt-6 rounded-xl border border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] px-4 py-3 text-sm text-[var(--usus-text)]"
            >
              {notice}
            </div>
          )}

          {/* General settings */}
          <section className="mt-8 rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            <div className="border-b border-[var(--usus-border)] px-6 py-5">
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                General Settings
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                General configuration for the USUS platform.
              </p>
            </div>

            <div className="divide-y divide-[var(--usus-border-soft)]">
              <SettingRow
                title="Platform name"
                description="The name displayed throughout the platform."
                value="USUS"
              />

              {/* Maintenance mode */}
              <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--usus-text)]">
                    Maintenance mode
                  </p>

                  <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                    Temporarily restrict access to the
                    platform while maintenance is being
                    performed. Only platform admins can
                    sign in while it is on.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={maintenanceMode}
                  aria-label="Maintenance mode"
                  disabled={
                    savedMaintenanceMode === null ||
                    saving
                  }
                  onClick={() =>
                    setMaintenanceMode(
                      !maintenanceMode,
                    )
                  }
                  className={[
                    "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
                    maintenanceMode
                      ? "bg-[var(--usus-primary)]"
                      : "bg-[var(--usus-border)]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                      maintenanceMode
                        ? "left-6"
                        : "left-1",
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Platform access */}
          <section className="mt-6 rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            <div className="border-b border-[var(--usus-border)] px-6 py-5">
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                Platform Access
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                Platform-wide access and account
                configuration.
              </p>
            </div>

            <div className="divide-y divide-[var(--usus-border-soft)]">
              <SettingRow
                title="User registration"
                description="Control how new users are added to the platform."
                value="Managed by administrators"
              />

              <SettingRow
                title="Organisation access"
                description="Control access between customer organisations."
                value="Organisation isolated"
              />

              <SettingRow
                title="Role management"
                description="Platform roles used for access control."
                value="4 roles"
              />
            </div>
          </section>

          {/* System configuration */}
          <section className="mt-6 rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            <div className="border-b border-[var(--usus-border)] px-6 py-5">
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                System Configuration
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                Information about the current platform
                configuration.
              </p>
            </div>

            <div className="divide-y divide-[var(--usus-border-soft)]">
              <SettingRow
                title="Environment"
                description="Current application environment."
                value={environment}
              />

              <SettingRow
                title="Authentication"
                description="Authentication mechanism used by USUS."
                value="JWT"
              />

              <SettingRow
                title="Theme"
                description="Appearance preference for the platform."
                value="Light / Dark"
              />
            </div>
          </section>

          {/* Save */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="cursor-pointer rounded-lg bg-[var(--usus-primary)] px-4 py-2.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SettingRow({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--usus-text)]">
          {title}
        </p>

        <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
          {description}
        </p>
      </div>

      <span className="w-fit rounded-md border border-[var(--usus-border)] bg-[var(--usus-surface-soft)] px-3 py-1.5 text-xs font-medium text-[var(--usus-text-muted)]">
        {value}
      </span>
    </div>
  );
};
