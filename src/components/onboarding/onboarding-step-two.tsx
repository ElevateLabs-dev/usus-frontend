"use client";

interface OnboardingStepTwoProps {
  companyType: string;
  referralSource: string;
  otherCompanyType: string;
  otherReferralSource: string;
  onCompanyTypeChange: (value: string) => void;
  onReferralSourceChange: (value: string) => void;
  onOtherCompanyTypeChange: (value: string) => void;
  onOtherReferralSourceChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

const companyTypes = [
  "Technology / Software",
  "Education / Training",
  "Healthcare / Medical",
  "Finance / Banking",
  "Manufacturing",
  "Retail / E-commerce",
  "Professional Services / Consulting",
  "Construction / Engineering",
  "Agriculture",
  "Hospitality / Tourism",
  "Logistics / Transportation",
  "Government / Public Sector",
  "Non-profit / Charity",
  "Other",
];

const referralSources = [
  "Google / Search Engine",
  "LinkedIn",
  "Instagram",
  "Facebook",
  "X (Twitter)",
  "YouTube",
  "Referral from a colleague or friend",
  "Company / Business Partner",
  "Event / Conference",
  "Other",
];

const inputStyles =
  "mt-2 h-12 w-full border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 text-sm text-[var(--usus-text)] outline-none transition focus:border-[var(--usus-primary)] focus:ring-2 focus:ring-[var(--usus-primary-soft)]";

const labelStyles =
  "text-sm font-medium text-[var(--usus-text)]";

export function OnboardingStepTwo({
  companyType,
  referralSource,
  otherCompanyType,
  otherReferralSource,
  onCompanyTypeChange,
  onReferralSourceChange,
  onOtherCompanyTypeChange,
  onOtherReferralSourceChange,
  onContinue,
  onBack,
}: OnboardingStepTwoProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (companyType === "Other" && !otherCompanyType.trim()) return;
    if (referralSource === "Other" && !otherReferralSource.trim()) return;

    onContinue();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--usus-text)]">
          Tell us about your organisation
        </h1>

        <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
          Help us understand your organisation and how you discovered USUS.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="companyType" className={labelStyles}>
            What type of company do you operate?
          </label>

          <select
            id="companyType"
            value={companyType}
            onChange={(event) => onCompanyTypeChange(event.target.value)}
            required
            className={inputStyles}
          >
            <option value="" disabled>
              Select company category
            </option>

            {companyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {companyType === "Other" && (
            <input
              type="text"
              value={otherCompanyType}
              onChange={(event) =>
                onOtherCompanyTypeChange(event.target.value)
              }
              placeholder="Enter your company category"
              required
              className={inputStyles}
            />
          )}
        </div>

        <div>
          <label htmlFor="referralSource" className={labelStyles}>
            Where did you hear about Us?
          </label>

          <select
            id="referralSource"
            value={referralSource}
            onChange={(event) => onReferralSourceChange(event.target.value)}
            required
            className={inputStyles}
          >
            <option value="" disabled>
              Select an option
            </option>

            {referralSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>

          {referralSource === "Other" && (
            <input
              type="text"
              value={otherReferralSource}
              onChange={(event) =>
                onOtherReferralSourceChange(event.target.value)
              }
              placeholder="Please specify"
              required
              className={inputStyles}
            />
          )}
        </div>

        <div className="flex items-center gap-4 pt-3">
          <button
            type="button"
            onClick={onBack}
            className="h-12 flex-1 border border-[var(--usus-border)] bg-[var(--usus-surface)] text-sm font-semibold text-[var(--usus-text)] transition hover:bg-[var(--usus-surface-soft)]"
          >
            Back
          </button>

          <button
            type="submit"
            className="h-12 flex-1 border border-[var(--usus-primary)] bg-[var(--usus-primary)] text-sm font-semibold text-[#252624] transition hover:bg-[var(--usus-primary-hover)]"
          >
            Continue
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-xs text-[var(--usus-text-soft)]">
        Powered by Elevate Labs
      </p>
    </div>
  );
}