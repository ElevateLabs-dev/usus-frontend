import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ContinueTrainingItem {
  id?: string;
  title: string;
  category: string;
  level: string;
  progress: number;
}

interface ContinueTrainingProps {
  items: ContinueTrainingItem[];
}

export function ContinueTraining({
  items,
}: ContinueTrainingProps) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--usus-text)]">
            Continue training
          </h2>

          <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
            Pick up where you left off.
          </p>
        </div>

        <Link
          href="/scenarios"
          className="
            text-sm
            font-medium
            text-[var(--usus-text-muted)]
            transition-colors
            hover:text-[var(--usus-primary)]
          "
        >
          View all
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const progress = Math.min(
            100,
            Math.max(0, item.progress),
          );

          const scenarioId = item.id;

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
                  {item.category}
                </span>

                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-[var(--usus-primary-soft)]
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-[var(--usus-text)]
                  "
                >
                  {item.level}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-[var(--usus-text)]">
                {item.title}
              </h3>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-[var(--usus-text-muted)]">
                    Progress
                  </span>

                  <span className="text-xs font-semibold text-[var(--usus-text)]">
                    {progress}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--usus-progress-track)]">
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-[var(--usus-primary)]
                      transition-all
                      duration-700
                      ease-out
                    "
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--usus-text)]">
                Continue

                <ArrowRight
                  size={17}
                  className="
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};