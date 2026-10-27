import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UsusLogo } from "@/components/brand/usus-logo";
import { TrustTestimonials } from "@/components/testimonials/testimonials";

const features = [
  {
    number: "01",
    title: "Structured learning",
    description:
      "Build practical skills through structured training levels, guided scenarios, and measurable progress.",
  },
  {
    number: "02",
    title: "Realistic scenarios",
    description:
      "Practise handling different customer situations in a safe environment designed for learning.",
  },
  {
    number: "03",
    title: "Progress tracking",
    description:
      "Understand your strengths, monitor your development, and identify areas where you can improve.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--usus-background)] text-[var(--usus-text)] transition-colors duration-200">

      {/* Navigation */}
<header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--usus-border)] bg-[var(--usus-background)]/95 px-6 py-4 backdrop-blur-md sm:px-10 lg:px-16">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between"
        >
          <Link
            href="/"
            aria-label="USUS home"
            className="flex items-center"
          >
            <UsusLogo size="lg" />
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            <a
              href="#features"
              className="hidden text-sm text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-text)] sm:inline-flex"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hidden text-sm text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-text)] sm:inline-flex"
            >
              Pricing
            </a>

            <a
              href="#how-it-works"
              className="hidden text-sm text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-text)] sm:inline-flex"
            >
              How it works
            </a>

            <ThemeToggle />

            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--usus-primary)] px-5 text-sm font-semibold text-black transition-colors hover:bg-[var(--usus-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--usus-primary)] focus-visible:ring-offset-2"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section
        className="relative isolate flex min-h-screen flex-col overflow-hidden after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-32 after:bg-gradient-to-b after:from-transparent after:to-[var(--usus-background)]"
        style={{
          backgroundColor: "var(--usus-background)",
          backgroundImage: `
            linear-gradient(to right, var(--usus-grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--usus-grid) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center top",
        }}
      >
        {/* Soft overlay keeps the grid subtle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[var(--usus-background)]/60"
        />

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-24 pt-28 text-center sm:px-8 sm:pt-32 lg:pt-36">
          <h1 className="max-w-5xl text-4xl font-medium leading-[1.08] tracking-[-0.055em] text-[var(--usus-text)] sm:text-6xl lg:text-7xl">
            Turn practice into
            <br className="hidden sm:block" />{" "}
            <span className="text-[var(--usus-primary)]">
              real-world confidence.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-[var(--usus-text-muted)] sm:text-lg sm:leading-8">
            Develop stronger customer interaction skills through realistic
            scenarios, structured learning, and progress tracking — all in
            one training platform.
          </p>

          <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[var(--usus-primary)] px-7 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-[var(--usus-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--usus-primary)] focus-visible:ring-offset-2"
            >
              Get started
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>

            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)]/90 px-7 text-sm font-semibold text-[var(--usus-text)] transition-colors hover:border-[var(--usus-primary)] hover:bg-[var(--usus-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--usus-primary)]"
            >
              Explore the platform
            </a>
          </div>

          <p className="mt-5 text-xs leading-5 text-[var(--usus-text-muted)]">
            Sign in to access your training dashboard.
          </p>
        </div>
      </section>

      <TrustTestimonials />


      {/* Features */}
      <section
        id="features"
        className="relative isolate scroll-mt-20 overflow-hidden bg-[var(--usus-muted)] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--usus-primary)]">
              The platform
            </p>

            <h2 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] text-[var(--usus-text)] sm:text-4xl lg:text-5xl">
              Everything you need to
              <br className="hidden sm:block" />{" "}
              <span className="text-[var(--usus-text-muted)]">
                keep getting better.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--usus-text-muted)] sm:text-base">
              Learn at your own pace, work through practical challenges, and
              see how your skills develop over time.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="rounded-xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6 transition-colors duration-200 sm:p-8"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--usus-border)] text-xs font-semibold text-[var(--usus-primary)]">
                  {feature.number}
                </span>

                <h3 className="mt-7 text-lg font-semibold tracking-tight text-[var(--usus-text)]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--usus-text-muted)]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="relative isolate scroll-mt-20 overflow-hidden bg-[var(--usus-background)] px-6 py-24 sm:px-10 lg:px-16"
      >
      

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--usus-primary)]">
              How it works
            </p>

            <h2 className="text-4xl font-semibold tracking-tight text-[var(--usus-text)] sm:text-5xl lg:text-6xl">
              A clearer path from learning to doing.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--usus-text-muted)] sm:text-lg">
              USUS brings your training activities together so you can focus
              on practising, improving, and building confidence with every
              scenario.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative mx-auto max-w-5xl">
            {/* Vertical connecting line */}
            <div
              aria-hidden="true"
              className="absolute bottom-10 left-5 top-10 w-px bg-[var(--usus-border)] sm:bottom-0 sm:left-1/2 sm:top-0 sm:-translate-x-1/2"
            />

            <div className="space-y-12 sm:space-y-16">

              {/* Step 1 */}
              <div className="relative grid grid-cols-[40px_1fr] items-start gap-5 sm:grid-cols-[1fr_72px_1fr] sm:gap-0">
                <div className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--usus-border)] bg-[var(--usus-background)] text-sm font-semibold text-[var(--usus-primary)] sm:col-start-2 sm:row-start-1 sm:mx-auto">
                  01
                </div>

                <article className="relative rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6 sm:col-start-1 sm:row-start-1 sm:p-8">
                  {/* Connector pointing to number 01 */}
                  <span
                    aria-hidden="true"
                    className="absolute -right-8 top-7 hidden h-px w-8 bg-[var(--usus-border)] sm:block"
                  />

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--usus-primary)]">
                    Step 1
                  </p>

                  <h3 className="text-lg font-semibold text-[var(--usus-text)]">
                    Learn the fundamentals
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[var(--usus-text-muted)] sm:text-base">
                    Start with the foundations and understand the principles
                    behind effective interactions.
                  </p>
                </article>
              </div>

              {/* Step 2 */}
              <div className="relative grid grid-cols-[40px_1fr] items-start gap-5 sm:grid-cols-[1fr_72px_1fr] sm:gap-0">
                <div className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--usus-border)] bg-[var(--usus-background)] text-sm font-semibold text-[var(--usus-primary)] sm:col-start-2 sm:row-start-1 sm:mx-auto">
                  02
                </div>

                <article className="relative rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6 sm:col-start-3 sm:row-start-1 sm:p-8">
                  {/* Connector pointing to number 02 */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-8 top-7 hidden h-px w-8 bg-[var(--usus-border)] sm:block"
                  />

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--usus-primary)]">
                    Step 2
                  </p>

                  <h3 className="text-lg font-semibold text-[var(--usus-text)]">
                    Practise with scenarios
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[var(--usus-text-muted)] sm:text-base">
                    Apply what you learn to realistic situations and different
                    customer needs.
                  </p>
                </article>
              </div>

              {/* Step 3 */}
              <div className="relative grid grid-cols-[40px_1fr] items-start gap-5 sm:grid-cols-[1fr_72px_1fr] sm:gap-0">
                <div className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--usus-border)] bg-[var(--usus-background)] text-sm font-semibold text-[var(--usus-primary)] sm:col-start-2 sm:row-start-1 sm:mx-auto">
                  03
                </div>

                <article className="relative rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6 sm:col-start-1 sm:row-start-1 sm:p-8">
                  {/* Connector pointing to number 03 */}
                  <span
                    aria-hidden="true"
                    className="absolute -right-8 top-7 hidden h-px w-8 bg-[var(--usus-border)] sm:block"
                  />

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--usus-primary)]">
                    Step 3
                  </p>

                  <h3 className="text-lg font-semibold text-[var(--usus-text)]">
                    Track your progress
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[var(--usus-text-muted)] sm:text-base">
                    Review your development and identify the skills you want
                    to strengthen next.
                  </p>
                </article>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer className="border-t border-[var(--usus-border)] bg-[var(--usus-background)] px-6 py-8 sm:px-10 lg:px-16">
  <p className="text-center text-xs text-[var(--usus-text-muted)]">
    &copy; {new Date().getFullYear()} USUS. All rights reserved.
  </p>
</footer>


    </main>
  );
}