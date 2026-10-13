"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  createOrganisation,
  setOrganisationActive,
} from "@/services/organisations-service";

export default function CreateOrganisationPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      /*
       * Creates the organisation, its starter
       * scenarios and its company admin, who is
       * emailed an invitation.
       */
      const organisation =
        await createOrganisation({
          name: name.trim(),
          adminEmail: email.trim(),
          adminFullName: contactName.trim(),
        });

      if (status === "inactive") {
        await setOrganisationActive(
          organisation.id,
          false,
        );
      }

      router.push(
        "/platform-admin/organisations",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create the organisation.",
      );

      setLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-3xl">
          {/* Back */}
          <Link
            href="/platform-admin/organisations"
            className="text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)]"
          >
            ← Back to Organisations
          </Link>

          {/* Heading */}
          <div className="mt-6">
            <p className="text-xs font-medium text-[var(--usus-primary)]">
              Platform
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              Create Organisation
            </h1>

            <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
              Create a customer organisation that will use
              the USUS platform.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6 shadow-[var(--usus-shadow)]"
          >
            <div className="space-y-6">
              {/* Organisation name */}
              <div>
                <label
                  htmlFor="organisation-name"
                  className="mb-2 block text-sm font-medium text-[var(--usus-text)]"
                >
                  Organisation name
                </label>

                <input
                  id="organisation-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter organisation name"
                  required
                  className="h-11 w-full rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-3 text-sm text-[var(--usus-text)] outline-none transition-colors placeholder:text-[var(--usus-text-soft)] focus:border-[var(--usus-primary)] focus:ring-2 focus:ring-[var(--usus-primary-soft)]"
                />
              </div>

              {/* Organisation email */}
              <div>
                <label
                  htmlFor="organisation-email"
                  className="mb-2 block text-sm font-medium text-[var(--usus-text)]"
                >
                  Company admin email
                </label>

                <input
                  id="organisation-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="organisation@example.com"
                  required
                  className="h-11 w-full rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-3 text-sm text-[var(--usus-text)] outline-none transition-colors placeholder:text-[var(--usus-text-soft)] focus:border-[var(--usus-primary)] focus:ring-2 focus:ring-[var(--usus-primary-soft)]"
                />

                <p className="mt-2 text-xs text-[var(--usus-text-muted)]">
                  This person becomes the organisation&apos;s
                  company admin and receives an invitation
                  email with a temporary password.
                </p>
              </div>

              {/* Contact person */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-medium text-[var(--usus-text)]"
                >
                  Primary contact
                </label>

                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(event) =>
                    setContactName(event.target.value)
                  }
                  placeholder="Enter primary contact name"
                  required
                  className="h-11 w-full rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-3 text-sm text-[var(--usus-text)] outline-none transition-colors placeholder:text-[var(--usus-text-soft)] focus:border-[var(--usus-primary)] focus:ring-2 focus:ring-[var(--usus-primary-soft)]"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="organisation-status"
                  className="mb-2 block text-sm font-medium text-[var(--usus-text)]"
                >
                  Status
                </label>

                <select
                  id="organisation-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-3 text-sm text-[var(--usus-text)] outline-none transition-colors focus:border-[var(--usus-primary)] focus:ring-2 focus:ring-[var(--usus-primary-soft)]"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>
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

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--usus-border)] pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/platform-admin/organisations",
                  )
                }
                className="rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 py-2.5 text-xs font-medium text-[var(--usus-text)] transition-colors hover:border-[var(--usus-primary)] hover:text-[var(--usus-primary)]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[var(--usus-primary)] px-4 py-2.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating..."
                  : "Create Organisation"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};