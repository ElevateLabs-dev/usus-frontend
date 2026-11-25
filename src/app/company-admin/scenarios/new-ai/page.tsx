"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStaffArea } from "@/hooks/use-staff-area";

import {
  DIFFICULTIES,
  PERSONAS,
  SKILLS,
  createScenario,
  getScenarioCategories,
  getScenarioSuggestions,
  type ScenarioCategory,
  type ScenarioInput,
} from "@/services/training-service";

type ReviewStatus = "draft" | "accepted" | "rejected";

const inputClass =
  "w-full border border-[var(--usus-border)] bg-[var(--usus-surface)] px-3 py-2.5 text-sm text-[var(--usus-text)] outline-none transition-colors placeholder:text-[var(--usus-text-soft)] focus:border-[var(--usus-primary)]";

const labelClass =
  "mb-2 block text-sm font-medium text-[var(--usus-text)]";

export default function NewAIScenarioPage() {
  const area = useStaffArea();
  const router = useRouter();

  const [topic, setTopic] = useState("Customer Service");
  const [audience, setAudience] = useState("Customer Support Team");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<ScenarioCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [duration, setDuration] = useState("15");
  const [instructions, setInstructions] = useState("");

  const [scenario, setScenario] =
    useState<ScenarioInput | null>(null);

  const [status, setStatus] =
    useState<ReviewStatus>("draft");

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
  let active = true;

  async function loadCategories() {
    try {
      const result = await getScenarioCategories();

      if (!active) return;

      setCategories(result);

      if (result.length > 0) {
        setCategory((current) =>
          result.some((item) => item.id === current)
            ? current
            : result[0].id,
        );
      } else {
        setError("No scenario categories are currently available.");
      }
    } catch (err) {
      if (!active) return;

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load scenario categories.",
      );
    } finally {
      if (active) {
        setCategoriesLoading(false);
      }
    }
  }

  void loadCategories();

  return () => {
    active = false;
  };
}, []);

  async function generateScenario() {
    if (!category) {
      setError("Select a scenario category before generating.");
      return;
    }

    setGenerating(true);
    setError("");
    setNotice("");
    setStatus("draft");

    try {
      const response = await getScenarioSuggestions({
        count: 1,
        category,
        difficulty,
        metrics: [],
        focus: [
          `Training topic: ${topic.trim()}`,
          `Target audience: ${audience.trim()}`,
          `Preferred duration: ${duration} minutes`,
          instructions.trim(),
        ]
          .filter(Boolean)
          .join(". "),
        similarity_threshold: 0.5,
      });

      if (response.suggestions.length === 0) {
        setNotice(
          response.skipped_similar > 0
            ? "The backend skipped the suggestion because it was too similar to existing scenarios. Change your requirements and try again."
            : "The backend did not return a scenario. Please try again.",
        );
        return;
      }

      const suggestion = response.suggestions[0];

      const generated: ScenarioInput = {
        ...suggestion,
        voice_id: null,
      };

      setScenario(generated);
      setEditing(false);

      setNotice(
        response.skipped_similar > 0
          ? `Scenario generated successfully. ${response.skipped_similar} similar suggestion(s) were skipped. Review the draft before saving.`
          : "Scenario generated successfully. Review the draft before saving.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate a scenario. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  }

  function updateScenario<K extends keyof ScenarioInput>(
    field: K,
    value: ScenarioInput[K],
  ) {
    setScenario((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );
  }

  function updateInformation(
    index: number,
    field: "label" | "content",
    value: string,
  ) {
    if (!scenario) return;

    const updated = [...scenario.important_information];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    updateScenario("important_information", updated);
  }

  async function acceptScenario() {
    if (!scenario) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const created = await createScenario({
        ...scenario,
        name: scenario.name.trim(),
        description: scenario.description.trim(),
        situation: scenario.situation.trim(),
        trainee_objective: scenario.trainee_objective.trim(),
        important_information:
          scenario.important_information.filter(
            (item) => item.label.trim() && item.content.trim(),
          ),
      });

      setStatus("accepted");

      router.push(`${area.scenarios}/${created.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the scenario.",
      );
    } finally {
      setSaving(false);
    }
  }

  function rejectScenario() {
    setStatus("rejected");
    setNotice("This draft has been rejected. It has not been saved.");
  }

  function requestRevisions() {
    setNotice(
      "Revision request recorded in this preview only. A backend review workflow is required to submit it.",
    );
  }

  function toggleSkill(skill: string) {
    if (!scenario) return;

    const selected = scenario.skills.includes(skill);

    updateScenario(
      "skills",
      selected
        ? scenario.skills.filter((item) => item !== skill)
        : [...scenario.skills, skill],
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* HEADER */}

      <div>
        <Link
          href={area.scenarios}
          className="text-xs font-medium text-[var(--usus-text-muted)] hover:text-[var(--usus-primary)]"
        >
          ← Back to Scenarios
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-medium text-[var(--usus-primary)]">
              Training / AI Scenario Creation
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              Create with AI
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--usus-text-muted)]">
              Generate realistic training scenarios for your
              organisation, then review and approve the result.
            </p>
          </div>

          <span className="w-fit border border-[var(--usus-border)] px-3 py-2 text-xs text-[var(--usus-text-muted)]">
            AI-assisted creation
          </span>
        </div>
      </div>

      {/* GENERATION FORM */}

      <section className="border border-[var(--usus-border)] bg-[var(--usus-surface)]">
        <div className="border-b border-[var(--usus-border)] px-5 py-5">
          <h2 className="font-semibold text-[var(--usus-text)]">
            Scenario requirements
          </h2>

          <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
            Describe the training scenario you want AI to create.
          </p>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              Training topic
            </label>

            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. Customer service"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Target audience
            </label>

            <input
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
              placeholder="e.g. Customer support team"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Scenario category
            </label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={categoriesLoading || categories.length === 0}
              className={inputClass}
            >
              {categoriesLoading ? (
                <option value="">Loading categories...</option>
              ) : categories.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Difficulty level
            </label>

            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className={inputClass}
            >
              {DIFFICULTIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Estimated duration
            </label>

            <select
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className={inputClass}
            >
              {[5, 10, 15, 20, 30, 45, 60].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} minutes
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Additional instructions
            </label>

            <textarea
              value={instructions}
              onChange={(event) =>
                setInstructions(event.target.value)
              }
              rows={4}
              placeholder="Describe the workplace situation, specific challenges, policies or skills you want the scenario to cover..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-[var(--usus-border)] px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-xs text-[var(--usus-text-muted)]">
            Generated content must be reviewed before it is saved.
          </p>

          <button
            type="button"
            disabled={
              generating ||
              categoriesLoading ||
              !category ||
              !topic.trim() ||
              !audience.trim()
            }
            onClick={generateScenario}
            className="bg-[var(--usus-primary)] px-5 py-3 text-sm font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating
              ? "Generating..."
              : scenario
                ? "Generate another scenario"
                : "Generate scenario"}
          </button>
        </div>
      </section>

      {/* NOTIFICATIONS */}

      {notice && (
        <div
          role="status"
          className="border border-[var(--usus-border)] bg-[var(--usus-surface-soft)] p-4 text-sm text-[var(--usus-text-muted)]"
        >
          {notice}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="border border-[var(--usus-danger)] bg-[var(--usus-surface)] p-4 text-sm text-[var(--usus-danger)]"
        >
          {error}
        </div>
      )}

      {/* REVIEW WORKSPACE */}

      {scenario && (
        <section className="border border-[var(--usus-border)] bg-[var(--usus-surface)]">
          {/* REVIEW HEADER */}

          <div className="flex flex-col justify-between gap-4 border-b border-[var(--usus-border)] p-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold text-[var(--usus-text)]">
                  Scenario review
                </h2>

                <StatusBadge status={status} />
              </div>

              <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                Review the generated draft before saving it.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEditing((value) => !value)}
                className="border border-[var(--usus-border)] px-4 py-2 text-xs font-medium text-[var(--usus-text)] hover:bg-[var(--usus-surface-soft)]"
              >
                {editing ? "Finish editing" : "Edit draft"}
              </button>

              <button
                type="button"
                onClick={generateScenario}
                disabled={generating}
                className="border border-[var(--usus-border)] px-4 py-2 text-xs font-medium text-[var(--usus-text)] hover:bg-[var(--usus-surface-soft)] disabled:opacity-50"
              >
                Regenerate
              </button>
            </div>
          </div>

          <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_310px]">
            {/* LEFT: SCENARIO DETAILS */}

            <div className="min-w-0 space-y-7 p-5">
              <div>
                <FieldLabel>Scenario title</FieldLabel>

                {editing ? (
                  <input
                    value={scenario.name}
                    onChange={(event) =>
                      updateScenario("name", event.target.value)
                    }
                    className={`${inputClass} mt-2 text-lg font-semibold`}
                  />
                ) : (
                  <h3 className="mt-2 text-xl font-semibold text-[var(--usus-text)]">
                    {scenario.name}
                  </h3>
                )}
              </div>

              <div>
                <FieldLabel>Description</FieldLabel>

                {editing ? (
                  <textarea
                    rows={3}
                    value={scenario.description}
                    onChange={(event) =>
                      updateScenario("description", event.target.value)
                    }
                    className={`${inputClass} mt-2`}
                  />
                ) : (
                  <p className="mt-2 text-sm leading-7 text-[var(--usus-text-muted)]">
                    {scenario.description}
                  </p>
                )}
              </div>

              <div>
                <FieldLabel>Scenario brief</FieldLabel>

                <ReviewContent
                  title="Situation"
                  value={scenario.situation}
                  editing={editing}
                  onChange={(value) =>
                    updateScenario("situation", value)
                  }
                />

                <ReviewContent
                  title="Customer background"
                  value={scenario.customer_background ?? ""}
                  editing={editing}
                  onChange={(value) =>
                    updateScenario("customer_background", value || null)
                  }
                />

                <ReviewContent
                  title="Customer goal"
                  value={scenario.customer_goal ?? ""}
                  editing={editing}
                  onChange={(value) =>
                    updateScenario("customer_goal", value || null)
                  }
                />

                <ReviewContent
                  title="Trainee objective"
                  value={scenario.trainee_objective}
                  editing={editing}
                  onChange={(value) =>
                    updateScenario("trainee_objective", value)
                  }
                />
              </div>
                            {/* CUSTOMER PROFILE */}

              <div className="border-t border-[var(--usus-border)] pt-6">
                <FieldLabel>AI customer profile</FieldLabel>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <ProfileField
                    label="Customer name"
                    value={scenario.customer_name ?? ""}
                    editing={editing}
                    onChange={(value) =>
                      updateScenario("customer_name", value || null)
                    }
                  />

                  <ProfileField
                    label="Personality"
                    value={scenario.customer_personality ?? ""}
                    editing={editing}
                    onChange={(value) =>
                      updateScenario("customer_personality", value || null)
                    }
                  />

                  <ProfileField
                    label="Emotion"
                    value={scenario.customer_emotion ?? ""}
                    editing={editing}
                    onChange={(value) =>
                      updateScenario("customer_emotion", value || null)
                    }
                  />

                  <div>
                    <FieldLabel>Customer mood</FieldLabel>

                    {editing ? (
                      <select
                        value={scenario.persona}
                        onChange={(event) =>
                          updateScenario("persona", event.target.value)
                        }
                        className={`${inputClass} mt-2`}
                      >
                        {PERSONAS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="mt-2 text-sm text-[var(--usus-text)]">
                        {PERSONAS.find(
                          (item) => item.value === scenario.persona,
                        )?.label ?? scenario.persona}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* IMPORTANT INFORMATION */}

              <div className="border-t border-[var(--usus-border)] pt-6">
                <FieldLabel>Important information</FieldLabel>

                <div className="mt-4 space-y-3">
                  {scenario.important_information.map((item, index) => (
                    <div
                      key={index}
                      className="border border-[var(--usus-border)] p-4"
                    >
                      {editing ? (
                        <div className="space-y-3">
                          <input
                            value={item.label}
                            onChange={(event) =>
                              updateInformation(
                                index,
                                "label",
                                event.target.value,
                              )
                            }
                            className={inputClass}
                            placeholder="Information label"
                          />

                          <textarea
                            value={item.content}
                            onChange={(event) =>
                              updateInformation(
                                index,
                                "content",
                                event.target.value,
                              )
                            }
                            rows={2}
                            className={inputClass}
                            placeholder="Information content"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              updateScenario(
                                "important_information",
                                scenario.important_information.filter(
                                  (_, itemIndex) => itemIndex !== index,
                                ),
                              )
                            }
                            className="text-xs text-[var(--usus-danger)]"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-[var(--usus-text)]">
                            {item.label}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
                            {item.content}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {editing && (
                  <button
                    type="button"
                    onClick={() =>
                      updateScenario("important_information", [
                        ...scenario.important_information,
                        { label: "", content: "" },
                      ])
                    }
                    className="mt-3 text-xs font-medium text-[var(--usus-primary)]"
                  >
                    + Add information
                  </button>
                )}
              </div>

              {/* SKILLS */}

              <div className="border-t border-[var(--usus-border)] pt-6">
                <FieldLabel>Skills being tested</FieldLabel>

                <div className="mt-3 flex flex-wrap gap-2">
                  {SKILLS.map((skill) => {
                    const selected = scenario.skills.includes(skill.value);

                    return (
                      <button
                        key={skill.value}
                        type="button"
                        disabled={!editing}
                        onClick={() => toggleSkill(skill.value)}
                        className={`border px-3 py-2 text-xs ${
                          selected
                            ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] text-[var(--usus-text)]"
                            : "border-[var(--usus-border)] text-[var(--usus-text-muted)]"
                        } disabled:cursor-default`}
                      >
                        {skill.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* EVALUATION */}

              <div className="border-t border-[var(--usus-border)] pt-6">
                <FieldLabel>Evaluation criteria</FieldLabel>

                <ReviewContent
                  title="Escalation behaviour"
                  value={scenario.escalation_behavior ?? ""}
                  editing={editing}
                  onChange={(value) =>
                    updateScenario("escalation_behavior", value || null)
                  }
                />

                <ReviewContent
                  title="Success criteria"
                  value={scenario.success_criteria ?? ""}
                  editing={editing}
                  onChange={(value) =>
                    updateScenario("success_criteria", value || null)
                  }
                />
              </div>
            </div>

            {/* RIGHT: AI REVIEW */}

            <aside className="min-w-0 space-y-6 border-t border-[var(--usus-border)] bg-[var(--usus-surface-soft)] p-5 lg:border-l lg:border-t-0">
              <div>
                <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                  Scenario information
                </h3>

                <div className="mt-4 space-y-4">
                  <InfoRow
                    label="Category"
                    value={
                      categories.find(
                        (item) => item.id === scenario.category,
                      )?.name ?? scenario.category
                    }
                  />

                  <InfoRow
                    label="Difficulty"
                    value={
                      DIFFICULTIES.find(
                        (item) => item.value === scenario.difficulty,
                      )?.label ?? scenario.difficulty
                    }
                  />

                  <InfoRow
                    label="Duration"
                    value={`${scenario.estimated_minutes} minutes`}
                  />

                  <InfoRow
                    label="Skills"
                    value={`${scenario.skills.length} selected`}
                  />
                </div>
              </div>

              <div className="border-t border-[var(--usus-border)] pt-5">
                <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                  AI review findings
                </h3>

                <p className="mt-2 text-xs leading-5 text-[var(--usus-text-muted)]">
                  The scenario content in this workspace was returned by the
                  backend. Review its accuracy, suitability and alignment
                  with your organisation&apos;s training requirements before
                  saving it.
                </p>

                <p className="mt-4 border-t border-[var(--usus-border)] pt-3 text-[11px] leading-5 text-[var(--usus-text-soft)]">
                  Automated review findings are not returned by the current
                  scenario suggestions endpoint.
                </p>
              </div>

              {/* REVIEW DECISION */}

              <div className="border-t border-[var(--usus-border)] pt-5">
                <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                  Review decision
                </h3>

                <p className="mt-2 text-xs leading-5 text-[var(--usus-text-muted)]">
                  Review the content and choose how to proceed.
                </p>

                <label className={`${labelClass} mt-4`}>
                  Review note
                </label>

                <textarea
                  value={reviewNote}
                  onChange={(event) =>
                    setReviewNote(event.target.value)
                  }
                  rows={3}
                  placeholder="Add feedback or approval notes..."
                  className={inputClass}
                />

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={acceptScenario}
                    disabled={
                      saving ||
                      status === "rejected" ||
                      !scenario.name.trim() ||
                      !scenario.description.trim()
                    }
                    className="w-full bg-[var(--usus-primary)] px-4 py-3 text-sm font-medium text-[#111111] hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving scenario..." : "Accept and save"}
                  </button>

                  <button
                    type="button"
                    onClick={requestRevisions}
                    disabled={status === "rejected"}
                    className="w-full border border-[var(--usus-border)] px-4 py-3 text-sm font-medium text-[var(--usus-text)] hover:bg-[var(--usus-surface)] disabled:opacity-50"
                  >
                    Request revisions
                  </button>

                  <button
                    type="button"
                    onClick={rejectScenario}
                    disabled={status === "accepted"}
                    className="w-full border border-[var(--usus-danger)] px-4 py-3 text-sm font-medium text-[var(--usus-danger)] hover:bg-[var(--usus-surface)] disabled:opacity-50"
                  >
                    Reject draft
                  </button>
                </div>

                <p className="mt-3 text-[11px] leading-5 text-[var(--usus-text-soft)]">
                  Accepting saves the scenario using the existing
                  scenario creation endpoint. Review notes and approval
                  workflow are not yet persisted.
                </p>
              </div>
            </aside>
          </div>
        </section>
      )}

      {!scenario && !generating && (
        <div className="border border-dashed border-[var(--usus-border)] bg-[var(--usus-surface)] px-6 py-16 text-center">
          <h3 className="text-base font-semibold text-[var(--usus-text)]">
            Your scenario will appear here
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--usus-text-muted)]">
            Complete the scenario requirements above and generate a
            draft to begin reviewing it.
          </p>
        </div>
      )}

      {generating && (
        <div className="border border-[var(--usus-border)] bg-[var(--usus-surface)] px-6 py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin border-2 border-[var(--usus-border)] border-t-[var(--usus-primary)]" />

          <p className="mt-4 text-sm font-medium text-[var(--usus-text)]">
            Preparing your scenario...
          </p>

          <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
            Waiting for the backend to generate your scenario.
          </p>
        </div>
      )}
    </div>
  );
}
/* ============================================================
   COMPONENTS
============================================================ */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--usus-text-muted)]">
      {children}
    </p>
  );
}

function ReviewContent({
  title,
  value,
  editing,
  onChange,
}: {
  title: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-5">
      <p className="text-sm font-medium text-[var(--usus-text)]">
        {title}
      </p>

      {editing ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className={`${inputClass} mt-2`}
        />
      ) : (
        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[var(--usus-text-muted)]">
          {value || "Not provided"}
        </p>
      )}
    </div>
  );
}

function ProfileField({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>

      {editing ? (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} mt-2`}
        />
      ) : (
        <p className="mt-2 text-sm text-[var(--usus-text)]">
          {value || "Not provided"}
        </p>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-[var(--usus-text-muted)]">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-[var(--usus-text)]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const styles = {
    draft:
      "bg-[var(--usus-surface-soft)] text-[var(--usus-text-muted)]",
    accepted:
      "bg-[var(--usus-primary-soft)] text-[var(--usus-primary)]",
    rejected:
      "bg-[var(--usus-surface-soft)] text-[var(--usus-danger)]",
  };

  const labels = {
    draft: "Awaiting review",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}