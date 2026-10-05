import type { SkillEvaluation } from "@/types/evaluation";

interface SkillBreakdownProps {
  skills: SkillEvaluation[];
}

export function SkillBreakdown({
  skills,
}: SkillBreakdownProps) {
  return (
    <section className="rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
      <div className="border-b border-[var(--usus-border)] p-6">
        <h2 className="font-semibold text-[var(--usus-text)]">
          Skill performance
        </h2>

        <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
          How you performed across the skills tested.
        </p>
      </div>

      <div className="space-y-6 p-6">
        {skills.map((skill) => (
          <div key={skill.id}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-[var(--usus-text)]">
                {skill.name}
              </span>

              <span className="text-sm font-semibold text-[var(--usus-text)]">
                {skill.score}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[var(--usus-progress-track)]">
              <div
                className="h-full rounded-full bg-[var(--usus-primary)] transition-all duration-700"
                style={{
                  width: `${skill.score}%`,
                }}
              />
            </div>

            {skill.description && (
              <p className="mt-2 text-xs leading-5 text-[var(--usus-text-muted)]">
                {skill.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};