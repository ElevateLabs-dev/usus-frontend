import { getHistory } from "@/services/history";

import { SessionHistory } from "@/components/history/session-history";

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-7xl
        px-6
        py-8
        lg:px-8
      "
    >
      {/* Page header */}
      <div className="mb-8">
        <p className="text-sm text-[var(--usus-text-muted)]">
          Trainee / History
        </p>

        <h1
          className="
            mt-2
            text-3xl
            font-bold
            text-[var(--usus-text)]
          "
        >
          Training history
        </h1>

        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            text-[var(--usus-text-muted)]
          "
        >
          Review your previous simulations, scores,
          skills and performance.
        </p>
      </div>

      {/* Session history */}
      <SessionHistory sessions={history.sessions} />
    </main>
  );
};