"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    id: "scenarios",
    label: "Scenario Practice",
    title: "Practise real workplace situations.",
    description:
      "Give employees the opportunity to explore realistic workplace challenges, make decisions and develop practical confidence.",
    image:
      "https://placehold.co/1400x850/f1f5ed/252624?text=USUS+Scenario+Practice+Screenshot",
    alt: "Placeholder for the USUS scenario practice interface",
    background: "var(--usus-primary-soft)",
    accent: "rgba(143,184,62,0.10)",
  },
  {
    id: "roleplay",
    label: "AI Roleplay",
    title: "Learn through interactive conversations.",
    description:
      "Create opportunities for employees to practise workplace conversations and develop their communication skills.",
    image:
      "https://placehold.co/1400x850/f1f1ed/252624?text=USUS+AI+Roleplay+Screenshot",
    alt: "Placeholder for the USUS AI roleplay interface",
    background: "var(--usus-surface-soft)",
    accent: "rgba(143,184,62,0.08)",
  },
  {
    id: "knowledge",
    label: "Knowledge",
    title: "Make workplace knowledge accessible.",
    description:
      "Help employees understand organisational information, procedures and the knowledge required to perform their roles.",
    image:
      "https://placehold.co/1400x850/eef2e7/252624?text=USUS+Knowledge+Screenshot",
    alt: "Placeholder for the USUS workplace knowledge interface",
    background: "var(--usus-primary-soft)",
    accent: "rgba(143,184,62,0.14)",
  },
  {
    id: "feedback",
    label: "Feedback",
    title: "Turn practice into improvement.",
    description:
      "Give employees meaningful feedback that helps them understand their performance and identify opportunities to improve.",
    image:
      "https://placehold.co/1400x850/f3f0e9/252624?text=USUS+Feedback+Screenshot",
    alt: "Placeholder for the USUS feedback interface",
    background: "var(--usus-surface-soft)",
    accent: "rgba(200,148,50,0.09)",
  },
  {
    id: "evaluation",
    label: "Evaluation",
    title: "Understand learning and development.",
    description:
      "Bring learning outcomes and performance insights together to help organisations understand employee development.",
    image:
      "https://placehold.co/1400x850/edf1e8/252624?text=USUS+Evaluation+Screenshot",
    alt: "Placeholder for the USUS evaluation interface",
    background: "var(--usus-primary-soft)",
    accent: "rgba(143,184,62,0.11)",
  },
];

type Feature = (typeof features)[number];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M4 10h12M10 4l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProductShowcase({ feature }: { feature: Feature }) {
  return (
    <div
      key={feature.id}
      className="usus-image-enter relative z-10 mx-auto w-[96%] max-w-[1100px]"
    >
      <div className="overflow-hidden rounded-xl border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[0_18px_55px_rgba(37,38,36,0.12)]">
        <Image
          src={feature.image}
          alt={feature.alt}
          width={1400}
          height={850}
          sizes="(max-width: 768px) 96vw, 1100px"
          unoptimized
          priority
          className="block h-auto w-full object-contain"
        />
      </div>
    </div>
  );
}

export function AIPoweredTraining() {
  const [activeFeature, setActiveFeature] = useState("scenarios");

  const selectedFeature =
    features.find((feature) => feature.id === activeFeature) ?? features[0];

  return (
    <section
      id="ai-training"
      className="relative overflow-hidden border-b border-[var(--usus-border-soft)] bg-[var(--usus-background)] py-20 sm:py-24 lg:py-28"
    >
      <style>{`
        @keyframes ususImageEnter {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .usus-image-enter {
          animation: ususImageEnter 500ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .usus-image-enter {
            animation: none;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Section heading */}
        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[760px]">
            <span className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--usus-primary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--usus-primary)]" />
              AI-POWERED WORKPLACE TRAINING
            </span>

            <h2 className="max-w-[760px] text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-[var(--usus-text)] sm:text-4xl lg:text-[54px]">
              Put AI to work across
              <br className="hidden sm:block" />
              your readiness platform.
            </h2>

            <p className="mt-5 max-w-[650px] text-sm leading-7 text-[var(--usus-text-muted)] sm:text-base">
              Move beyond traditional training with AI-powered workplace
              experiences that help employees practise, receive feedback and
              develop practical confidence.
            </p>
          </div>

          <div className="lg:pb-1">
            <Link
              href="#solutions"
              className="inline-flex h-11 items-center justify-center gap-3 bg-[var(--usus-primary)] px-6 text-[10px] font-semibold uppercase tracking-wider text-[#252624] transition-colors hover:bg-[var(--usus-primary-hover)]"
            >
              Learn More
              <ArrowIcon />
            </Link>
          </div>
        </div>

        {/* Feature navigation */}
        <div className="mt-9 flex justify-center overflow-x-auto pb-3">
          <div
            role="tablist"
            aria-label="USUS training capabilities"
            className="flex min-w-max items-center gap-2"
          >
            {features.map((feature) => {
              const isActive = activeFeature === feature.id;

              return (
                <button
                  key={feature.id}
                  id={`usus-tab-${feature.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="usus-product-preview"
                  onClick={() => setActiveFeature(feature.id)}
                  className={`
                    whitespace-nowrap border px-5 py-3 text-[11px] font-medium
                    transition-all duration-300
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-[var(--usus-primary)]
                    ${
                      isActive
                        ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] text-[var(--usus-text)]"
                        : "border-[var(--usus-border-soft)] bg-[var(--usus-surface)] text-[var(--usus-text-muted)] hover:border-[var(--usus-primary)] hover:text-[var(--usus-text)]"
                    }
                  `}
                >
                  {feature.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image showcase */}
        <div
          className="relative mt-10 min-h-[260px] sm:mt-12 sm:min-h-[400px] lg:min-h-[560px]"
        >
          {/* Dynamic background */}
          <div
            className="absolute inset-x-0 top-8 bottom-0 overflow-hidden rounded-[16px] border border-[var(--usus-border)] transition-colors duration-700 ease-in-out"
            style={{
              backgroundColor: selectedFeature.background,
            }}
          >
            {/* Subtle grid */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: `
                  linear-gradient(var(--usus-grid) 1px, transparent 1px),
                  linear-gradient(90deg, var(--usus-grid) 1px, transparent 1px)
                `,
                backgroundSize: "56px 56px",
              }}
            />

            {/* Soft decorative glow */}
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl transition-colors duration-700"
              style={{
                backgroundColor: selectedFeature.accent,
              }}
            />
          </div>

          {/* Product screenshot */}
          <div
            id="usus-product-preview"
            role="tabpanel"
            aria-labelledby={`usus-tab-${activeFeature}`}
            className="relative z-10 pt-0 sm:pt-2"
          >
            <ProductShowcase feature={selectedFeature} />
          </div>
        </div>

      </div>
    </section>
  );
}