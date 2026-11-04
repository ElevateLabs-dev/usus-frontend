"use client";

import { useState } from "react";

const faqs = [
  {
    question: "WHAT IS USUS AND HOW DOES IT WORK?",
    answer:
      "USUS is a training platform designed to help you develop practical customer interaction skills. Work through structured learning activities, practise realistic scenarios, and build confidence as you progress.",
  },
  {
    question: "HOW DOES PRACTISING WITH SCENARIOS WORK?",
    answer:
      "You work through realistic customer situations that help you apply what you have learned. These scenarios give you an opportunity to practise your responses, improve your approach, and build confidence.",
  },
  {
    question: "CAN I TRACK MY LEARNING PROGRESS?",
    answer:
      "USUS helps you review your development, understand your strengths, and identify areas where you can improve as you continue training.",
  },
  {
    question: "DO I NEED EXPERIENCE TO USE USUS?",
    answer:
      "You can build your skills progressively through structured learning and practical scenarios. Start with the fundamentals and develop your confidence as you practise.",
  },
  {
    question: "HOW DO I ACCESS MY TRAINING DASHBOARD?",
    answer:
      "Sign in to your USUS account to access your training dashboard and the learning activities available to you.",
  },
];

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M5.2 3.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4ZM3.3 9.5h3.8v11H3.3v-11Zm6.1 0H13v1.5h.1a4.1 4.1 0 0 1 3.7-2c4 0 4.7 2.6 4.7 6v5.5h-3.8v-4.9c0-1.2 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8v5H9.4v-11Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.6 22H2.5l7.3-8.4L2 2h6.5l4.4 6.9L18.9 2Zm-1.1 18h1.7L7.5 3.9H5.7L17.8 20Z" />
      </svg>
    ),
  },
];

export function UsusFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="border-t border-[var(--usus-border)] bg-[var(--usus-background)] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Left column */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--usus-primary)]">
            Questions
          </p>

          <h2 className="mt-5 max-w-md text-3xl font-medium uppercase leading-tight tracking-[-0.045em] text-[var(--usus-text)] sm:text-4xl">
            Frequently
            <br />
            asked questions
          </h2>

          <p className="mt-8 text-sm text-[var(--usus-text-muted)]">
            Ask AI about USUS
          </p>

          {/* Social links box */}
          <div className="mt-4 inline-flex border border-[var(--usus-border)]">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit USUS on ${social.name}`}
                title={social.name}
                className={`flex h-14 w-14 items-center justify-center text-[var(--usus-text-muted)] transition-colors hover:bg-[var(--usus-surface)] hover:text-[var(--usus-primary)] ${
                  index !== socialLinks.length - 1
                    ? "border-r border-[var(--usus-border)]"
                    : ""
                }`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right column: FAQ accordion */}
        <div className="border-t border-[var(--usus-border)]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const answerId = `usus-faq-answer-${index}`;
            const buttonId = `usus-faq-question-${index}`;

            return (
              <div
                key={faq.question}
                className="border-b border-[var(--usus-border)]"
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex min-h-[76px] w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-xs font-medium uppercase leading-6 tracking-[0.07em] text-[var(--usus-text)] sm:text-sm">
                    {faq.question}
                  </span>

                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl font-light text-[var(--usus-text)] transition-transform duration-300"
                  >
                    <span
                      className={`block transition-transform duration-300 ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </span>
                </button>

                {/* Smoothly expand and collapse the answer */}
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 pr-8 text-sm leading-7 text-[var(--usus-text-muted)]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}