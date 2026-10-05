import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RecommendedScenario {
  id?: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  level: string;
}

interface RecommendedScenariosProps {
  scenarios: RecommendedScenario[];
}

export function RecommendedScenarios({
  scenarios,
}: RecommendedScenariosProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--usus-text)]">
          Recommended scenarios
        </h2>

        <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
          Training selected based on your performance.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {scenarios.map((scenario) => {
          const scenarioId = scenario.id;

          if (!scenarioId) {
            return null;
          }

          return (
            <Link
              key={scenarioId}
              href={`/scenarios/${scenarioId}`}
              className="
                group
                block
                w-full
                cursor-pointer
                rounded-[var(--usus-radius)]
                border
                border-[var(--usus-border)]
                bg-[var(--usus-surface)]
                p-5
                text-left
                shadow-[var(--usus-shadow)]
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-[var(--usus-primary)]
                hover:shadow-lg
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--usus-primary)]
                focus:ring-offset-2
                focus:ring-offset-[var(--usus-background)]
              "
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-medium text-[var(--usus-text-muted)]">
                  {scenario.category}
                </span>

                <span className="text-xs text-[var(--usus-text-muted)]">
                  {scenario.duration}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-[var(--usus-text)]">
                {scenario.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
                {scenario.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span
                  className="
                    rounded-full
                    bg-[var(--usus-primary-soft)]
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-[var(--usus-text)]
                  "
                >
                  {scenario.level}
                </span>

                <span
                  className="
                    flex
                    items-center
                    gap-1
                    text-sm
                    font-semibold
                    text-[var(--usus-text)]
                    transition-colors
                    group-hover:text-[var(--usus-primary-hover)]
                  "
                >
                  Start

                  <ArrowRight
                    size={16}
                    className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};