import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UsusLogo } from "@/components/brand/usus-logo";
import { UsusFAQ } from "@/components/faq/usus-faq";
import { PricingSection } from "@/components/pricing/pricing";
import { LandingNavigation } from "@/components/landing/navigation";
import { LandingHero } from "@/components/landing/hero";
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
      <LandingNavigation />
      

      {/* Hero */}
      <LandingHero />

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