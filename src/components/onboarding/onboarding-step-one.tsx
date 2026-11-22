"use client";

interface OnboardingStepOneProps {
  companyName: string;
  companyEmail: string;
  fullName: string;
  onCompanyNameChange: (value: string) => void;
  onCompanyEmailChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onContinue: () => void;
}

export function OnboardingStepOne({
  companyName,
  companyEmail,
  fullName,
  onCompanyNameChange,
  onCompanyEmailChange,
  onFullNameChange,
  onContinue,
}: OnboardingStepOneProps) {
  const inputStyles =
    "h-12 w-full border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 text-sm text-[var(--usus-text)] outline-none transition placeholder:text-[var(--usus-text-soft)] focus:border-[var(--usus-primary)] focus:ring-2 focus:ring-[var(--usus-primary-soft)]";

  const labelStyles =
    "mb-2 block text-sm font-medium text-[var(--usus-text)]";

  return (
    <section>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--usus-text)]">
          Create a workspace
        </h1>

        <p className="mt-3 text-sm text-[var(--usus-text-muted)]">
          Let&apos;s start by setting up your organisation.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onContinue();
        }}
        className="space-y-6"
      >
        <div>
          <label htmlFor="companyName" className={labelStyles}>
            Company name
          </label>

          <input
            id="companyName"
            name="companyName"
            type="text"
            placeholder="Enter your company name"
            value={companyName}
            onChange={(event) =>
              onCompanyNameChange(event.target.value)
            }
            autoComplete="organization"
            required
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="companyEmail" className={labelStyles}>
            Company email
          </label>

          <input
            id="companyEmail"
            name="companyEmail"
            type="email"
            placeholder="Enter your company email"
            value={companyEmail}
            onChange={(event) =>
              onCompanyEmailChange(event.target.value)
            }
            autoComplete="email"
            required
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="fullName" className={labelStyles}>
            Your full name
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(event) =>
              onFullNameChange(event.target.value)
            }
            autoComplete="name"
            required
            className={inputStyles}
          />
        </div>

        <button
          type="submit"
          className="h-12 w-full border border-[var(--usus-primary)] bg-[var(--usus-primary)] text-sm font-semibold text-[#252624] transition hover:bg-[var(--usus-primary-hover)]"
        >
          Continue
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-[var(--usus-text-soft)]">
        Powered by Elevate Labs
      </p>
    </section>
  );
}