import type { TranscriptMessage } from "@/types/history";

interface SessionTranscriptProps {
  messages: TranscriptMessage[];
  customerName?: string;
}

/**
 * The conversation of a finished session,
 * text or voice (voice calls are transcribed).
 */
export function SessionTranscript({
  messages,
  customerName = "Customer",
}: SessionTranscriptProps) {
  return (
    <section className="rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6">
      <h2 className="text-lg font-semibold text-[var(--usus-text)]">
        Conversation
      </h2>

      <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
        Everything you and the customer said in
        this session.
      </p>

      {messages.length === 0 ? (
        <p className="mt-5 text-sm text-[var(--usus-text-muted)]">
          No messages were exchanged in this
          session.
        </p>
      ) : (
        <ol className="mt-5 space-y-3">
          {messages.map((message) => (
            <li
              key={message.id}
              className={
                message.speaker === "trainee"
                  ? "ml-auto max-w-[85%] rounded-2xl bg-[var(--usus-primary-soft)] px-4 py-3"
                  : "mr-auto max-w-[85%] rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-background)] px-4 py-3"
              }
            >
              <p className="text-[11px] font-semibold text-[var(--usus-text-muted)]">
                {message.speaker === "trainee"
                  ? "You"
                  : customerName}
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--usus-text)]">
                {message.content}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
