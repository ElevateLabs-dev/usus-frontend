import Link from "next/link";

interface AskAdminNoteProps {
  message: string;
}

/**
 * Accounts are created by each organisation, so
 * password resets go through an admin.
 */
export function AskAdminNote({
  message,
}: AskAdminNoteProps) {
  return (
    <div className="text-center">
      <p className="text-sm leading-6 text-[var(--usus-text-muted)]">
        {message}
      </p>

      <Link
        href="/login"
        className="mt-6 inline-block text-sm font-medium text-[var(--usus-primary)] hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  );
}
