import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Explore USUS and get started with practical learning.",
    price: "$0",
    period: "Free forever",
    recommended: false,
    features: [
      "Limited text role-play",
      "Basic evaluations",
      "Personal progress overview",
    ],
    button: "Get started",
    href: "/login",
  },
  {
    name: "Standard",
    description: "Build practical skills through regular practice.",
    price: "$12",
    period: "per trainee / month",
    recommended: false,
    features: [
      "Unlimited text role-play",
      "Unlimited evaluations",
      "30 voice minutes per trainee / month",
      "History and progress tracking",
      "Team reports",
    ],
    button: "Get started",
    href: "/login",
  },
  {
    name: "Plus",
    description: "Give your team more opportunities to practise and improve.",
    price: "$20",
    period: "per trainee / month",
    recommended: true,
    features: [
      "Unlimited text role-play",
      "Unlimited evaluations",
      "75 voice minutes per trainee / month",
      "History and progress tracking",
      "Team reports",
    ],
    button: "Get started",
    href: "/login",
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="border-t border-[var(--usus-border)] bg-[var(--usus-background)] px-5 py-20 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--usus-primary)]">
            Pricing
          </p>

          <h2 className="text-4xl font-semibold tracking-tight text-[var(--usus-text)] sm:text-5xl">
            Simple plans.
            <br />
            <span className="text-[var(--usus-text-muted)]">
              Flexible learning.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--usus-text-muted)] sm:text-base">
            Choose the right plan for your team and start building
            practical skills with USUS.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 border border-[var(--usus-border)] md:grid-cols-3">

          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={`flex min-w-0 flex-col p-6 sm:p-8 ${
                index !== 0
                  ? "border-t border-[var(--usus-border)] md:border-l md:border-t-0"
                  : ""
              } ${
                plan.recommended
                  ? "bg-[var(--usus-primary-soft)]"
                  : "bg-[var(--usus-surface)]"
              }`}
            >
              {/* Plan name */}
              <div className="min-h-[112px]">
                <div className="flex min-h-7 items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-[var(--usus-text)]">
                    {plan.name}
                  </h3>

                  {plan.recommended && (
                    <span className="bg-[var(--usus-primary)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">
                      Recommended
                    </span>
                  )}
                </div>

                <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--usus-text-muted)]">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mt-7 min-h-[92px]">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-[var(--usus-text)]">
                    {plan.price}
                  </span>

                  {plan.price !== "$0" && (
                    <span className="text-xs text-[var(--usus-text-muted)]">
                      / month
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-[var(--usus-text-muted)]">
                  {plan.period}
                </p>
              </div>

              {/* Button */}
              <Link
                href={plan.href}
                className={`mt-5 flex h-12 w-full items-center justify-center px-4 text-sm font-semibold ${
                  plan.recommended
                    ? "bg-[var(--usus-primary)] text-black"
                    : "border border-[var(--usus-border)] bg-[var(--usus-background)] text-[var(--usus-text)]"
                }`}
              >
                {plan.button}
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>

              {/* Features */}
              <div className="mt-8 border-t border-[var(--usus-border)] pt-7">
                <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-[var(--usus-text-muted)]">
                  What&apos;s included
                </p>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6 text-[var(--usus-text)]"
                    >
                      <span
                        className="shrink-0 text-[var(--usus-primary)]"
                        aria-hidden="true"
                      >
                        ✓
                      </span>

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

        </div>

        {/* Annual billing */}
        <p className="mt-6 text-xs text-[var(--usus-text-muted)]">
          Annual billing available. Get two months free.
        </p>

      </div>
    </section>
  );
}