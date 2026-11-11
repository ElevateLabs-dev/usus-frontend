import Link from "next/link";

export function LandingHero() {
  return (
    <section
      id="top"
      className="
        relative
        isolate
        overflow-hidden
        bg-[var(--usus-background)]
        px-5
        pb-16
        pt-32
        text-center
        sm:px-8
        sm:pb-20
        sm:pt-36
        lg:pt-40
      "
    >
      {/* Background grid */}
      <div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4]"
  style={{
    backgroundImage: `
      linear-gradient(to right, var(--usus-grid) 1px, transparent 1px),
      linear-gradient(to bottom, var(--usus-grid) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
  }}
/>

      {/* Background overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[var(--usus-background)]/55"
      />

      <div className="relative mx-auto max-w-7xl">

        {/* Introductory label */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--usus-primary)]">
          Workplace Training & Readiness Platform
        </p>

        {/* Main heading */}
        <h1
          className="
            mx-auto
            mt-5
            max-w-5xl
            text-4xl
            font-medium
            leading-[1.08]
            tracking-[-0.045em]
            text-[var(--usus-text)]
            sm:text-5xl
            lg:text-7xl
          "
        >
          Turn workplace knowledge into{" "}
          <span className="text-[var(--usus-primary)]">
            real-world confidence.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[var(--usus-text-muted)] sm:text-base sm:leading-8">
          Help your employees learn your organisation&apos;s procedures,
          simulate realistic workplace situations with AI and improve
          through structured evaluation.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

          <Link
            href="#demo"
            className="
              inline-flex
              h-12
              min-w-[140px]
              items-center
              justify-center
              bg-[var(--usus-primary)]
              px-7
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-[#252624]
              transition-colors
              hover:bg-[var(--usus-primary-hover)]
            "
          >
            Get a Demo
          </Link>

          <a
            href="#product-video"
            className="
              inline-flex
              h-12
              min-w-[140px]
              items-center
              justify-center
              border
              border-[var(--usus-border)]
              bg-[var(--usus-surface)]
              px-7
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-[var(--usus-text)]
              transition-colors
              hover:border-[var(--usus-primary)]
            "
          >
            Take a Tour
          </a>

        </div>

        {/* Explanatory video */}
        <div
          id="product-video demo"
          className="
            relative
            mx-auto
            mt-14
            w-full
            max-w-5xl
            scroll-mt-28
            sm:mt-16
          "
        >
          {/* Video frame */}
          <div
            className="
              relative
              overflow-hidden
              border
              border-[var(--usus-border)]
              bg-[var(--usus-surface)]
              p-2
              sm:p-3
            "
          >
            <div className="relative aspect-video w-full overflow-hidden bg-[#252624]">

              <video
                className="h-full w-full object-contain"
                controls
                playsInline
                preload="metadata"
                poster="/images/usus-video-poster.png"
              >
                <source
                  src="/videos/usus-explainer.mp4"
                  type="video/mp4"
                />

                Your browser does not support video playback.
              </video>

            </div>
          </div>

          {/* Video caption */}
          <p className="mt-4 text-xs tracking-wide text-[var(--usus-text-muted)]">
            Discover how USUS transforms workplace training.
          </p>

        </div>

      </div>
    </section>
  );
}