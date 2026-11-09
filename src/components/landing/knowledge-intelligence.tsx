const stages = [
  {
    number: "01",
    title: "Your knowledge",
    subtitle: "The organisation",
    description:
      "Bring your organisation's policies, procedures and internal knowledge into the training experience.",
    type: "knowledge",
  },
  {
    number: "02",
    title: "USUS intelligence",
    subtitle: "The AI",
    description:
      "USUS uses organisation-specific knowledge to support relevant training and workplace simulations.",
    type: "intelligence",
  },
  {
    number: "03",
    title: "Employee practice",
    subtitle: "The people",
    description:
      "Employees practise realistic workplace situations, receive evaluations and track their development.",
    type: "practice",
  },
];

function StageIllustration({ type }: { type: string }) {
  if (type === "knowledge") {
    return (
      <div className="relative flex h-36 items-center justify-center">
        <div className="relative flex h-24 w-20 flex-col justify-between border border-white/25 bg-white/[0.04] p-3">
          <div className="space-y-2">
            <span className="block h-1 w-10 bg-[#8fb83e]" />
            <span className="block h-1 w-12 bg-white/25" />
            <span className="block h-1 w-8 bg-white/25" />
          </div>
          <span className="text-[9px] uppercase tracking-wider text-[#b4beb6]">
            Policy
          </span>
        </div>

        <div className="absolute ml-20 mt-14 h-12 w-12 border border-[#8fb83e]/40 bg-[#18332a] p-3">
          <span className="text-xl text-[#a5c66c]">+</span>
        </div>
      </div>
    );
  }

  if (type === "intelligence") {
    return (
      <div className="relative flex h-36 items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full border border-[#8fb83e]/20" />
        <div className="absolute h-24 w-24 rounded-full border border-[#8fb83e]/35" />
        <div className="absolute h-16 w-16 rounded-full border border-[#8fb83e]/50" />

        <div className="relative flex h-12 w-12 items-center justify-center bg-[#8fb83e] text-2xl text-[#10251f]">
          ◈
        </div>

        <span className="absolute right-[20%] top-[25%] h-2 w-2 rounded-full bg-[#8fb83e]" />
        <span className="absolute bottom-[20%] left-[25%] h-2 w-2 rounded-full bg-[#8fb83e]" />
      </div>
    );
  }

  return (
    <div className="relative flex h-36 items-center justify-center">
      <div className="flex h-20 w-20 items-center justify-center border border-[#8fb83e]/40">
        <div className="flex h-12 w-12 items-center justify-center border border-white/30">
          <span className="text-2xl text-[#a5c66c]">◎</span>
        </div>
      </div>

      <div className="absolute bottom-5 right-[22%] flex h-9 w-9 items-center justify-center border border-white/20 bg-[#18332a] text-[#a5c66c]">
        ✓
      </div>
    </div>
  );
}

export function KnowledgeIntelligence() {
  return (
    <section
      id="knowledge"
      className="landing-dark border-b landing-border px-5 py-24 sm:px-8 lg:px-16 lg:py-32"
    >
      <div className="landing-container">
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a5c66c]">
              The USUS approach
            </p>

            <h2 className="max-w-3xl font-serif text-4xl font-normal leading-tight tracking-[-0.035em] text-[#f2f1ed] sm:text-5xl lg:text-6xl">
              From what your business knows to what your people can do.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-[#b4beb6] lg:justify-self-end">
            Effective training starts with understanding how your
            organisation works. USUS connects internal knowledge with
            practical employee development.
          </p>
        </div>

        <div className="grid border-y border-white/15 md:grid-cols-3 md:divide-x md:divide-white/15">
          {stages.map((stage) => (
            <article key={stage.number} className="px-5 py-9 sm:px-8 lg:py-12">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#a5c66c]">
                  {stage.number}
                </span>

                <span className="text-[9px] uppercase tracking-[0.18em] text-[#b4beb6]">
                  {stage.subtitle}
                </span>
              </div>

              <StageIllustration type={stage.type} />

              <h3 className="mt-5 font-serif text-2xl text-[#f2f1ed]">
                {stage.title}
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-7 text-[#b4beb6]">
                {stage.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-[#b4beb6]">
            Your organisation&apos;s knowledge. Training built around its standards.
          </p>

          <a
            href="#platform"
            className="text-xs font-medium text-[#a5c66c] transition-colors hover:text-white"
          >
            Explore platform capabilities →
          </a>
        </div>
      </div>
    </section>
  );
}