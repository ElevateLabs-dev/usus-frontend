export function AiThinking({
  customerName,
}: {
  customerName: string;
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%]">
        <p className="mb-1 text-xs font-medium text-[var(--usus-text-muted)]">
          {customerName}
        </p>

        <div
          className="
            inline-flex items-center gap-1
            rounded-2xl rounded-tl-md
            bg-[var(--usus-muted)]
            px-4 py-3
          "
          aria-label="Customer is responding"
        >
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--usus-text-muted)] [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--usus-text-muted)] [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--usus-text-muted)]" />
        </div>
      </div>
    </div>
  );
}