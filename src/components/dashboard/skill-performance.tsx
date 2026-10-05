interface Skill {
  name: string;
  score: number;
}

interface SkillPerformanceProps {
  skills: Skill[];
}

export function SkillPerformance({
  skills,
}: SkillPerformanceProps) {
  return (
    <section
      className="
        rounded-[var(--usus-radius)]
        border
        border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        p-6
        shadow-[var(--usus-shadow)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-[var(--usus-primary)]
        hover:shadow-lg
      "
    >
      <div>
        <h2 className="font-semibold text-[var(--usus-text)]">
          Skill performance
        </h2>

        <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
          Your performance across key training skills.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {skills.map((skill) => {
          const score = Math.min(
            100,
            Math.max(0, skill.score)
          );

          return (
            <div key={skill.name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-[var(--usus-text)]">
                  {skill.name}
                </span>

                <span className="text-sm font-semibold text-[var(--usus-text)]">
                  {score}%
                </span>
              </div>

              <div
                className="
                  h-2
                  w-full
                  overflow-hidden
                  rounded-full
                  bg-[var(--usus-progress-track)]
                "
              >
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
                    width: `${score}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};