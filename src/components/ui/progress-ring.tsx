interface ProgressRingProps {
  value: number;
  size?: number;
}

export function ProgressRing({
  value,
  size = 80,
}: ProgressRingProps) {
  const progress = Math.min(Math.max(value, 0), 100);

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        className="-rotate-90"
      >
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-slate-100"
        />

        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-slate-900 transition-all"
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
        {progress}%
      </span>
    </div>
  );
}
