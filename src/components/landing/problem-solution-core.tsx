"use client";

import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  ChartNoAxesCombined,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const problems = [
  {
    number: "01",
    title: "Move beyond theory.",
    description:
      "Give learners opportunities to explore practical situations and apply what they learn.",
    label: "PRACTICAL LEARNING",
    theme: "navy",
    visual: "scenario",
  },
  {
    number: "02",
    title: "Practise real conversations.",
    description:
      "Create opportunities to practise workplace interactions through AI-powered role-play.",
    label: "AI ROLE-PLAY",
    theme: "blue",
    visual: "conversation",
  },
  {
    number: "03",
    title: "Turn practice into progress.",
    description:
      "Use feedback and evaluation to help learners recognise strengths and areas for improvement.",
    label: "LEARNER DEVELOPMENT",
    theme: "green",
    visual: "feedback",
  },
];

const solutions = [
  {
    number: "01",
    category: "INTELLIGENT LEARNING",
    title: "AI-powered training",
    description:
      "Create more engaging learning experiences with AI-supported training.",
    icon: BrainCircuit,
    visual: "ai",
    size: "solution-wide",
  },
  {
    number: "02",
    category: "PRACTICAL EXPERIENCE",
    title: "Scenario-based learning",
    description:
      "Explore realistic situations and develop practical knowledge.",
    icon: Target,
    visual: "scenario",
    size: "solution-tall",
  },
  {
    number: "03",
    category: "INTERACTIVE PRACTICE",
    title: "AI role-play",
    description:
      "Practise conversations and workplace interactions.",
    icon: MessageSquareText,
    visual: "roleplay",
    size: "solution-small",
  },
  {
    number: "04",
    category: "CONTINUOUS IMPROVEMENT",
    title: "Feedback and evaluation",
    description:
      "Understand performance and identify opportunities to improve.",
    icon: ChartNoAxesCombined,
    visual: "evaluation",
    size: "solution-small",
  },
  {
    number: "05",
    category: "PEOPLE DEVELOPMENT",
    title: "Build skills with confidence",
    description:
      "Support continuous learning through practice, reflection and development.",
    icon: Users,
    visual: "development",
    size: "solution-wide",
  },
];

/* --------------------------------
   SECTION 4: PROBLEM / SOLUTION
--------------------------------- */

export function ProblemSolution() {
  return (
    <section className="usus-problem-section" id="why-usus">
      <div className="usus-section-container">
        <div className="usus-section-heading">
          <div>
            <span className="usus-eyebrow">
              <Sparkles size={14} />
              THE USUS APPROACH
            </span>

            <h2>
              Training people is easy.
              <br />
              <span>Preparing them for reality is different.</span>
            </h2>

            <p>
              Move beyond passive learning. Give people opportunities to
              practise, develop practical skills and build confidence.
            </p>
          </div>

          <div className="usus-heading-note">
            <span className="usus-heading-note-icon">
              <BrainCircuit size={20} />
            </span>
            <span>
              Learning designed
              <br />
              around people.
            </span>
          </div>
        </div>

        <div className="usus-problem-grid">
          {problems.map((item) => (
            <article
              key={item.number}
              className={`usus-problem-card problem-${item.theme}`}
            >
              <div className="usus-problem-card-top">
                <span className="usus-card-number">{item.number}</span>
                <span className="usus-card-arrow">
                  <ArrowUpRight size={19} />
                </span>
              </div>

              <div className={`usus-problem-visual visual-${item.visual}`}>
                {item.visual === "scenario" && (
                  <div className="scenario-visual">
                    <div className="scenario-top">
                      <span className="scenario-dot" />
                      <span>LEARNING SCENARIO</span>
                    </div>

                    <div className="scenario-question">
                      How would you handle this situation?
                    </div>

                    <div className="scenario-options">
                      <span>A</span>
                      <div />
                      <span>B</span>
                      <div />
                      <span>C</span>
                      <div />
                    </div>
                  </div>
                )}

                {item.visual === "conversation" && (
                  <div className="conversation-visual">
                    <div className="conversation-avatar">AI</div>
                    <div className="conversation-bubble bubble-ai">
                      How would you respond to a difficult customer?
                    </div>
                    <div className="conversation-bubble bubble-user">
                      I would first listen and understand their concern.
                    </div>
                    <div className="conversation-input">
                      <span>Continue the conversation...</span>
                      <MessageSquareText size={15} />
                    </div>
                  </div>
                )}

                {item.visual === "feedback" && (
                  <div className="feedback-visual">
                    <div className="feedback-score">
                      <div className="feedback-ring">
                        <span>85</span>
                      </div>
                      <div>
                        <small>LEARNING PROGRESS</small>
                        <strong>Room to grow</strong>
                      </div>
                    </div>

                    <div className="feedback-bars">
                      <div>
                        <span>Communication</span>
                        <i style={{ width: "85%" }} />
                      </div>
                      <div>
                        <span>Problem solving</span>
                        <i style={{ width: "70%" }} />
                      </div>
                      <div>
                        <span>Confidence</span>
                        <i style={{ width: "92%" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="usus-problem-card-content">
                <span className="usus-card-label">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------
   SECTION 5: CORE SOLUTIONS
--------------------------------- */

export function CoreSolutions() {
  return (
    <section className="usus-solutions-section" id="solutions">
      <div className="usus-section-container">
        <div className="usus-solutions-heading">
          <div>
            <span className="usus-eyebrow">
              <Sparkles size={14} />
              WHAT USUS OFFERS
            </span>

            <h2>
              Everything your organisation needs to develop{" "}
              <span>confident people.</span>
            </h2>

            <p>
              One learning environment for creating engaging experiences,
              practising real-world situations and supporting continuous
              development.
            </p>
          </div>
        </div>

        <div className="usus-solutions-grid">
          {solutions.map((solution) => {
            const Icon = solution.icon;

            return (
              <article
                key={solution.number}
                className={`usus-solution-card ${solution.size}`}
              >
                <div className="usus-solution-content">
                  <div className="usus-solution-top">
                    <span className="usus-solution-icon">
                      <Icon size={18} />
                    </span>
                    <span className="usus-solution-number">
                      {solution.number}
                    </span>
                  </div>

                  <span className="usus-solution-category">
                    {solution.category}
                  </span>

                  <h3>{solution.title}</h3>
                  <p>{solution.description}</p>
                </div>

                <div
                  className={`usus-solution-visual solution-visual-${solution.visual}`}
                  aria-hidden="true"
                >
                  {solution.visual === "ai" && (
                    <div className="ai-visual">
                      <div className="ai-orbit orbit-one" />
                      <div className="ai-orbit orbit-two" />
                      <div className="ai-core">
                        <BrainCircuit size={34} />
                      </div>
                      <span className="ai-tag tag-one">AI LEARNING</span>
                      <span className="ai-tag tag-two">SMART CONTENT</span>
                      <span className="ai-tag tag-three">TRAINING</span>
                    </div>
                  )}

                  {solution.visual === "scenario" && (
                    <div className="solution-scenario">
                      <div className="mini-window-header">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="mini-scenario-content">
                        <small>YOUR NEXT SCENARIO</small>
                        <strong>Make the right decision.</strong>
                        <div className="mini-choice active">
                          <span>A</span>
                          <i />
                        </div>
                        <div className="mini-choice">
                          <span>B</span>
                          <i />
                        </div>
                        <div className="mini-choice">
                          <span>C</span>
                          <i />
                        </div>
                      </div>
                    </div>
                  )}

                  {solution.visual === "roleplay" && (
                    <div className="roleplay-visual">
                      <div className="roleplay-person">
                        <Bot size={23} />
                      </div>
                      <div className="roleplay-lines">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="roleplay-message">
                        <MessageSquareText size={18} />
                        <span>Practice conversation</span>
                      </div>
                    </div>
                  )}

                  {solution.visual === "evaluation" && (
                    <div className="evaluation-visual">
                      <div className="evaluation-top">
                        <ChartNoAxesCombined size={20} />
                        <span>PERFORMANCE</span>
                      </div>
                      <div className="evaluation-chart">
                        {[35, 55, 42, 75, 62, 90, 78].map(
                          (height, index) => (
                            <i
                              key={index}
                              style={{ height: `${height}%` }}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {solution.visual === "development" && (
                    <div className="development-visual">
                      <div className="development-node node-one">
                        <Target size={17} />
                      </div>
                      <div className="development-line line-one" />
                      <div className="development-node node-two">
                        <BrainCircuit size={17} />
                      </div>
                      <div className="development-line line-two" />
                      <div className="development-node node-three">
                        <ShieldCheck size={17} />
                      </div>
                      <div className="development-caption">
                        <span>LEARN</span>
                        <span>PRACTISE</span>
                        <span>GROW</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="usus-solution-footer">
                  <span>EXPLORE SOLUTION</span>
                  <ArrowUpRight size={17} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}