interface PerformanceFeedbackProps {
  strengths: string[];
  improvements: string[];
}

function FeedbackList({
  title,
  items,
  type,
}: {
  title: string;
  items: string[];
  type: "positive" | "improvement";
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        type === "positive"
          ? "border-[var(--usus-border)] bg-[var(--usus-surface)]"
          : "border-[var(--usus-border)] bg-[var(--usus-surface-soft)]"
      }`}
    >
      <h3 className="font-semibold text-[var(--usus-text)]">
        {title}
      </h3>

      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex gap-3"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                type === "positive"
                  ? "bg-[var(--usus-primary)] text-black"
                  : "border border-[var(--usus-border)] text-[var(--usus-text-muted)]"
              }`}
            >
              {type === "positive" ? "✓" : "!"}
            </span>

            <p className="text-sm leading-6 text-[var(--usus-text-muted)]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PerformanceFeedback({
  strengths,
  improvements,
}: PerformanceFeedbackProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <FeedbackList
        title="What you did well"
        items={strengths}
        type="positive"
      />

      <FeedbackList
        title="Areas to improve"
        items={improvements}
        type="improvement"
      />
    </section>
  );
};