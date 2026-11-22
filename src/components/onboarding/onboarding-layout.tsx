import type { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export function OnboardingLayout({
  children,
}: OnboardingLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--usus-background)] px-5 py-12 text-[var(--usus-text)]">
      <div className="w-full max-w-[480px]">
        {children}
      </div>
    </main>
  );
}