import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";

const navigation = [
  { label: "Solutions", href: "#solutions", dropdown: true },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources", dropdown: true },
  { label: "Enterprise", href: "#enterprise" },
];

export function LandingNavigation() {
  return (
    <header
      className="
        fixed inset-x-0 top-0 z-50
        border-b border-[var(--usus-border)]
        bg-[var(--usus-header)]
        text-[var(--usus-text)]
        transition-colors duration-200
      "
    >
      <div
        className="
          mx-auto flex h-[76px] w-full max-w-[1600px]
          items-center justify-between
          px-5 sm:px-8 lg:px-12
        "
      >
        {/* LOGO */}
        <Link
          href="/"
          aria-label="USUS home"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/brand/logos/Usus-black.svg"
            alt="USUS"
            width={150}
            height={40}
            priority
            className="usus-logo-light h-auto w-[120px] md:w-[145px]"
          />

          <Image
            src="/brand/logos/Usus-white.svg"
            alt="USUS"
            width={150}
            height={40}
            priority
            className="usus-logo-dark h-auto w-[120px] md:w-[145px]"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="
                group flex items-center gap-1.5
                text-[11px] font-semibold uppercase tracking-wide
                text-[var(--usus-text)]
                transition-colors
                hover:text-[var(--usus-primary)]
              "
            >
              {item.label}

              {item.dropdown && (
                <svg
                  className="h-3 w-3 transition-transform group-hover:rotate-180"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          <Link
            href="/login"
            className="
              inline-flex h-[40px] items-center justify-center
              border border-[var(--usus-border)]
              bg-transparent px-5
              text-[10px] font-semibold uppercase tracking-wider
              text-[var(--usus-text)]
              transition-colors
              hover:border-[var(--usus-primary)]
              hover:text-[var(--usus-primary)]
            "
          >
            Login
          </Link>

          <Link
            href="#demo"
            className="
              inline-flex h-[40px] items-center justify-center
              bg-[var(--usus-primary)] px-5
              text-[10px] font-semibold uppercase tracking-wider
              text-[#252624]
              transition-colors
              hover:bg-[var(--usus-primary-hover)]
            "
          >
            Book a Demo
          </Link>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />

          <details className="group relative">
            <summary
              aria-label="Toggle navigation menu"
              className="
                flex h-10 w-10 cursor-pointer list-none
                items-center justify-center
                border border-[var(--usus-border)]
                text-[var(--usus-text)]
                transition-colors
                hover:border-[var(--usus-primary)]
              "
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </summary>

            <div
              className="
                absolute right-0 top-12
                w-[280px]
                border border-[var(--usus-border)]
                bg-[var(--usus-surface)]
                p-5
                shadow-[var(--usus-shadow)]
              "
            >
              <nav aria-label="Mobile navigation" className="flex flex-col">
                {navigation.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="
                      border-b border-[var(--usus-border-soft)]
                      py-4
                      text-xs font-semibold uppercase tracking-wide
                      text-[var(--usus-text)]
                      transition-colors
                      hover:text-[var(--usus-primary)]
                    "
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/login"
                  className="
                    flex h-11 items-center justify-center
                    border border-[var(--usus-border)]
                    text-xs font-semibold uppercase tracking-wide
                    text-[var(--usus-text)]
                  "
                >
                  Login
                </Link>

                <Link
                  href="#demo"
                  className="
                    flex h-11 items-center justify-center
                    bg-[var(--usus-primary)]
                    text-xs font-semibold uppercase tracking-wide
                    text-[#252624]
                  "
                >
                  Book a Demo
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}