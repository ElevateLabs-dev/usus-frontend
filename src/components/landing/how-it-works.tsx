import {
  BookOpen,
  MessageSquareText,
  ChartNoAxesCombined,
} from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    label: "FOUNDATION",
    title: "Learn the fundamentals",
    description:
      "Start with the foundations and understand the principles behind effective interactions.",
  },
  {
    icon: MessageSquareText,
    label: "PRACTICE",
    title: "Practise with scenarios",
    description:
      "Apply what you learn to realistic situations and different customer needs.",
  },
  {
    icon: ChartNoAxesCombined,
    label: "PROGRESS",
    title: "Track your progress",
    description:
      "Review your development and identify the skills you want to strengthen next.",
  },
];

export function HowItWorks() {
  return (
    <section className="usus-how" id="how-it-works">
      <div className="usus-how-inner">
        <div className="usus-how-heading">
          <span className="usus-how-label">HOW IT WORKS</span>

          <h2>A clearer path from learning to doing.</h2>

          <p>
            USUS brings your training activities together so you can focus
            on practising, improving, and building confidence with every
            scenario.
          </p>
        </div>

        <div className="usus-timeline">
          <div className="usus-timeline-line" aria-hidden="true" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div className="usus-timeline-row" key={step.title}>
                <div className="usus-timeline-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <article
                  className={`usus-timeline-card ${
                    index % 2 === 0 ? "left" : "right"
                  }`}
                >
                  <span className="usus-timeline-label">
                    <Icon size={15} strokeWidth={1.7} />
                    {step.label}
                  </span>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}