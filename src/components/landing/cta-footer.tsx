import Link from "next/link";

const footerGroups = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Enterprise", href: "#enterprise" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "AI Practice", href: "#solutions" },
      { label: "Roleplay", href: "#solutions" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { label: "Employee Training", href: "#use-cases" },
      { label: "Onboarding", href: "#use-cases" },
      { label: "Sales Training", href: "#use-cases" },
      { label: "Skills Development", href: "#use-cases" },
    ],
  },
];

function WaveGraphic() {
  return (
    <svg
      className="usus-wave"
      viewBox="0 0 700 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <path
          key={i}
          d={`M 0 ${145 + i * 3} C 120 ${20 + i * 5}, 160 ${
            290 - i * 4
          }, 300 ${155 + i * 2} S 520 ${20 + i * 5}, 700 ${
            90 + i * 4
          }`}
          stroke="currentColor"
          strokeWidth="0.8"
          opacity={0.12 + (i % 5) * 0.035}
        />
      ))}

      {Array.from({ length: 30 }).map((_, i) => (
        <g
          key={`cross-${i}`}
          transform={`translate(${350 + ((i * 83) % 330)}, ${
            (i * 47) % 320
          })`}
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.35"
        >
          <path d="M-4 0H4M0 -4V4" />
        </g>
      ))}
    </svg>
  );
}

export function LandingCTA() {
  return (
    <section className="usus-cta" id="contact">
      <div className="usus-cta-inner">
        <div className="usus-cta-content">
          <span className="usus-cta-eyebrow">READY TO GET STARTED?</span>

          <h2>
            TURN PRACTICE
            <br />
            INTO PERFORMANCE.
          </h2>

          <p>
            Give your people the opportunity to practise, improve and build
            confidence through realistic AI-powered experiences.
          </p>

          <div className="usus-cta-actions">
            <Link href="#book-demo" className="usus-cta-button primary">
              BOOK A DEMO
              <span aria-hidden="true">→</span>
            </Link>

            <Link href="#solutions" className="usus-cta-button secondary">
              EXPLORE USUS
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="usus-cta-visual">
          <WaveGraphic />
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="usus-footer">
      <div className="usus-footer-inner">
        <div className="usus-footer-brand">
          <Link href="/" className="usus-footer-logo">
            <span className="usus-logo-mark">✳</span>
            <span>USUS</span>
          </Link>

          <p>
            Building confidence through
            <br />
            realistic AI-powered practice.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div className="usus-footer-column" key={group.title}>
            <h3>{group.title}</h3>

            {group.links.map((link) => (
              <Link href={link.href} key={link.label}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="usus-footer-bottom">
        <span>© {new Date().getFullYear()} USUS. All rights reserved.</span>

        <div>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}