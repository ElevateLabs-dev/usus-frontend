import type { EvaluationInsight } from "@/types/evaluation";

interface ConversationInsightsProps {
  insights: EvaluationInsight[];
}

export function ConversationInsights({
  insights,
}: ConversationInsightsProps) {
  return (
    <section className="rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
      <div className="border-b border-[var(--usus-border)] p-6">
        <h2 className="font-semibold text-[var(--usus-text)]">
          Conversation insights
        </h2>

        <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
          Key moments identified during your simulation.
        </p>
      </div>

      <div className="divide-y divide-[var(--usus-border)]">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-6 transition hover:bg-[var(--usus-sidebar-hover)]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--usus-muted)] px-2.5 py-1 text-xs font-medium text-[var(--usus-text-muted)]">
                {insight.category}
              </span>

              <span
                className={`text-xs font-medium ${
                  insight.type === "positive"
                    ? "text-[var(--usus-primary-hover)]"
                    : insight.type === "improvement"
                      ? "text-[var(--usus-warning)]"
                      : "text-[var(--usus-text-muted)]"
                }`}
              >
                {insight.type === "positive"
                  ? "Positive"
                  : insight.type === "improvement"
                    ? "Improve"
                    : "Observation"}
              </span>
            </div>

            <h3 className="mt-3 font-medium text-[var(--usus-text)]">
              {insight.title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-[var(--usus-text-muted)]">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};