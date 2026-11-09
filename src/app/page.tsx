import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UsusLogo } from "@/components/brand/usus-logo";
import { TrustTestimonials } from "@/components/testimonials/testimonials";
import { UsusFAQ } from "@/components/faq/usus-faq";
import { PricingSection } from "@/components/pricing/pricing";
import { LandingNavigation } from "@/components/landing/navigation";
import { LandingHero } from "@/components/landing/hero";
import { KnowledgeIntelligence } from "@/components/landing/knowledge-intelligence";
import { AIPoweredTraining } from "@/components/landing/ai-powered-training";
import {
  ProblemSolution,
  CoreSolutions,
} from "@/components/landing/problem-solution-core";
import "@/components/landing/cta-footer.css";
import "@/components/landing/use-cases.css";
import {
  LandingCTA,
  LandingFooter,
} from "@/components/landing/cta-footer";
import { HowItWorks } from "@/components/landing/how-it-works";
import { UseCases } from "@/components/landing/use-cases";
import "@/components/landing/how-it-works.css";



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
    <main className="min-h-screen overflow-x-hidden bg-[var(--usus-background)] text-[var(--usus-text)] transition-colors duration-200 usus-landing">

      {/* Navigation */}
      {/* <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--usus-border)] bg-[var(--usus-background)]/95 px-6 py-4 backdrop-blur-md sm:px-10 lg:px-16">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between"
        >
          <Link
            href="/"
            aria-label="USUS home"
            className="flex items-center"
          >
            <UsusLogo />
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
      </header> */}
      <LandingNavigation />
      

      {/* Hero */}
      <LandingHero />

      {/* <TrustTestimonials /> */}
      {/* <KnowledgeIntelligence /> */}

      <AIPoweredTraining />

      <ProblemSolution />

      <CoreSolutions />

      <UseCases />

      <HowItWorks />

      <UsusFAQ />

      <PricingSection />

      {/* CTA */}
      <LandingCTA />

      {/* Footer */}
      <LandingFooter />


    </main>
  );
}