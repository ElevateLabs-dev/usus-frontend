interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export function OnboardingProgress({
  currentStep,
  totalSteps = 3,
}: OnboardingProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-10">
      <div className="mb-2 flex items-center justify-between text-xs text-[var(--usus-text-muted)]">
        <span>Workspace setup</span>
        <span>
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden bg-[var(--usus-progress-track)]">
        <div
          className="h-full bg-[var(--usus-primary)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}