import { UsusLogo } from "@/components/brand/usus-logo";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({
  title,
  description,
}: AuthHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-7 flex justify-center">
        <UsusLogo
          size="sm"
        />
      </div>

      <div className="text-center">
        <h1
          className="
            text-2xl
            font-semibold
            tracking-tight
            text-[var(--usus-text)]
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-[var(--usus-text-muted)]
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
};