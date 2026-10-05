interface RecommendationsProps {
  recommendations: string[];
}

export function Recommendations({
  recommendations,
}: RecommendationsProps) {
  return (
    <section className="rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6 shadow-[var(--usus-shadow)]">
      <h2 className="font-semibold text-[var(--usus-text)]">
        Recommended next steps
      </h2>

      <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
        Use this feedback to guide your next training session.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {recommendations.map((recommendation, index) => (
          <div
            key={`${recommendation}-${index}`}
            className="rounded-xl border border-[var(--usus-border)] bg-[var(--usus-surface-soft)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--usus-primary)] hover:shadow-md"
          >
            <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--usus-primary-soft)] text-xs font-bold text-[var(--usus-text)]">
              {index + 1}
            </div>

            <p className="text-sm leading-6 text-[var(--usus-text)]">
              {recommendation}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};