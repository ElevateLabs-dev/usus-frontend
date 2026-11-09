import {
  Headset,
  BriefcaseBusiness,
  Users,
  Settings2,
  ArrowUpRight,
} from "lucide-react";

const useCases = [
  {
    icon: Headset,
    number: "01",
    title: "Customer Service",
    description:
      "Practise handling customer conversations, enquiries and challenging interactions.",
  },
  {
    icon: BriefcaseBusiness,
    number: "02",
    title: "Sales & Negotiation",
    description:
      "Develop confidence in sales conversations, objection handling and negotiations.",
  },
  {
    icon: Users,
    number: "03",
    title: "People & HR",
    description:
      "Practise important workplace conversations, communication and people management.",
  },
  {
    icon: Settings2,
    number: "04",
    title: "Operations",
    description:
      "Prepare people for practical workplace situations that require sound decisions and communication.",
  },
];

export function UseCases() {
  return (
    <section className="usus-use-cases" id="use-cases">
      <div className="usus-use-cases-inner">
        <div className="usus-use-cases-heading">
          <span className="usus-use-cases-label">WHERE USUS MAKES AN IMPACT</span>

          <h2>
            REALISTIC PRACTICE.
            <br />
            MEANINGFUL PROGRESS.
          </h2>

          <p>
            Give people opportunities to develop the skills and confidence
            needed across different workplace situations.
          </p>
        </div>

        <div className="usus-use-case-grid">
          {useCases.map((item) => {
            const Icon = item.icon;

            return (
              <article className="usus-use-case-card" key={item.number}>
                <div className="usus-use-case-top">
                  <span>{item.number}</span>
                  <Icon size={27} strokeWidth={1.5} />
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <ArrowUpRight
                  className="usus-use-case-arrow"
                  size={20}
                  strokeWidth={1.5}
                />
              </article>
            );
          })}
        </div>

        <div className="usus-impact-strip">
          <div>
            <span>FOR EMPLOYEES</span>
            <h3>Build confidence.</h3>
            <p>Develop practical skills through active practice.</p>
          </div>

          <div>
            <span>FOR TRAINERS</span>
            <h3>Evaluate progress.</h3>
            <p>Use performance evaluations to identify improvement areas.</p>
          </div>

          <div>
            <span>FOR ORGANISATIONS</span>
            <h3>Develop capability.</h3>
            <p>Support consistent learning and workplace readiness.</p>
          </div>
        </div>
      </div>
    </section>
  );
}