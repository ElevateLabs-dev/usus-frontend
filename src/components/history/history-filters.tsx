"use client";

interface HistoryFiltersProps {
  search: string;
  category: string;
  difficulty: string;
  status: string;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function HistoryFilters({
  search,
  category,
  difficulty,
  status,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onStatusChange,
}: HistoryFiltersProps) {
  return (
    <section
      className="
        rounded-2xl
        border border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        p-4
      "
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search sessions..."
          className="
            h-10 rounded-xl
            border border-[var(--usus-border)]
            bg-[var(--usus-surface-soft)]
            px-3 text-sm
            text-[var(--usus-text)]
            outline-none
            transition
            placeholder:text-[var(--usus-text-soft)]
            focus:border-[var(--usus-primary)]
          "
        />

        <select
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
          className="
            h-10 rounded-xl
            border border-[var(--usus-border)]
            bg-[var(--usus-surface-soft)]
            px-3 text-sm
            text-[var(--usus-text)]
            outline-none
            focus:border-[var(--usus-primary)]
          "
        >
          <option value="all">
            All categories
          </option>

          <option value="De-escalation">
            De-escalation
          </option>

          <option value="Problem Resolution">
            Problem Resolution
          </option>

          <option value="Communication">
            Communication
          </option>

          <option value="Policy & Compliance">
            Policy & Compliance
          </option>
        </select>

        <select
          value={difficulty}
          onChange={(event) =>
            onDifficultyChange(event.target.value)
          }
          className="
            h-10 rounded-xl
            border border-[var(--usus-border)]
            bg-[var(--usus-surface-soft)]
            px-3 text-sm
            text-[var(--usus-text)]
            outline-none
            focus:border-[var(--usus-primary)]
          "
        >
          <option value="all">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">
            Intermediate
          </option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          className="
            h-10 rounded-xl
            border border-[var(--usus-border)]
            bg-[var(--usus-surface-soft)]
            px-3 text-sm
            text-[var(--usus-text)]
            outline-none
            focus:border-[var(--usus-primary)]
          "
        >
          <option value="all">All status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">
            In progress
          </option>
          <option value="abandoned">
            Abandoned
          </option>
        </select>
      </div>
    </section>
  );
};