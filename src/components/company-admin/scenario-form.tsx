"use client";

import { useState } from "react";

import {
  CATEGORIES,
  DIFFICULTIES,
  PERSONAS,
  SKILLS,
  type ImportantInformation,
  type ScenarioInput,
} from "@/services/training-service";

const inputClassName =
  "w-full rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-3 py-2 text-sm text-[var(--usus-text)] outline-none transition-colors placeholder:text-[var(--usus-text-soft)] focus:border-[var(--usus-primary)] focus:ring-2 focus:ring-[var(--usus-primary-soft)] disabled:opacity-60";

const labelClassName =
  "mb-2 block text-sm font-medium text-[var(--usus-text)]";

const hintClassName =
  "mt-1 text-xs text-[var(--usus-text-muted)]";

export const EMPTY_SCENARIO: ScenarioInput = {
  name: "",
  description: "",
  category: "de_escalation",
  difficulty: "beginner",
  persona: "frustrated",
  skills: [],
  estimated_minutes: 10,
  customer_name: null,
  customer_personality: null,
  customer_emotion: null,
  customer_background: null,
  situation: "",
  customer_goal: null,
  trainee_objective: "",
  important_information: [],
  escalation_behavior: null,
  success_criteria: null,
};

interface ScenarioFormProps {
  initial: ScenarioInput;
  submitLabel: string;
  onSubmit: (
    input: ScenarioInput,
  ) => Promise<void>;
}

/**
 * Create or edit a scenario. Optional text
 * fields are sent as null when left empty.
 */
export function ScenarioForm({
  initial,
  submitLabel,
  onSubmit,
}: ScenarioFormProps) {
  const [values, setValues] =
    useState<ScenarioInput>(initial);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ScenarioInput>(
    key: K,
    value: ScenarioInput[K],
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function setOptional(
    key:
      | "customer_name"
      | "customer_personality"
      | "customer_emotion"
      | "customer_background"
      | "customer_goal"
      | "escalation_behavior"
      | "success_criteria",
    value: string,
  ) {
    set(key, value === "" ? null : value);
  }

  function toggleSkill(skill: string) {
    set(
      "skills",
      values.skills.includes(skill)
        ? values.skills.filter(
            (item) => item !== skill,
          )
        : [...values.skills, skill],
    );
  }

  function setInformation(
    index: number,
    field: keyof ImportantInformation,
    value: string,
  ) {
    set(
      "important_information",
      values.important_information.map(
        (item, i) =>
          i === index
            ? { ...item, [field]: value }
            : item,
      ),
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        description: values.description.trim(),
        situation: values.situation.trim(),
        trainee_objective:
          values.trainee_objective.trim(),
        important_information:
          values.important_information.filter(
            (item) =>
              item.label.trim() &&
              item.content.trim(),
          ),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the scenario.",
      );
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basics */}
      <FormSection
        title="Scenario"
        description="What trainees see when they browse scenarios."
      >
        <div>
          <label
            htmlFor="scenario-name"
            className={labelClassName}
          >
            Name
          </label>

          <input
            id="scenario-name"
            value={values.name}
            onChange={(event) =>
              set("name", event.target.value)
            }
            required
            minLength={3}
            maxLength={255}
            placeholder="Failed payment at checkout"
            className={`${inputClassName} h-10`}
          />
        </div>

        <div>
          <label
            htmlFor="scenario-description"
            className={labelClassName}
          >
            Description
          </label>

          <textarea
            id="scenario-description"
            value={values.description}
            onChange={(event) =>
              set(
                "description",
                event.target.value,
              )
            }
            required
            minLength={10}
            rows={2}
            placeholder="One or two sentences about the situation."
            className={inputClassName}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField
            id="scenario-category"
            label="Category"
            value={values.category}
            options={CATEGORIES}
            onChange={(value) =>
              set("category", value)
            }
          />

          <SelectField
            id="scenario-difficulty"
            label="Difficulty"
            value={values.difficulty}
            options={DIFFICULTIES}
            onChange={(value) =>
              set("difficulty", value)
            }
          />

          <SelectField
            id="scenario-persona"
            label="Customer mood"
            value={values.persona}
            options={PERSONAS}
            onChange={(value) =>
              set("persona", value)
            }
          />

          <div>
            <label
              htmlFor="scenario-minutes"
              className={labelClassName}
            >
              Minutes
            </label>

            <input
              id="scenario-minutes"
              type="number"
              min={1}
              max={120}
              value={values.estimated_minutes}
              onChange={(event) =>
                set(
                  "estimated_minutes",
                  Number(event.target.value),
                )
              }
              className={`${inputClassName} h-10`}
            />
          </div>
        </div>

        <fieldset>
          <legend className={labelClassName}>
            Skills tested
          </legend>

          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => {
              const selected =
                values.skills.includes(
                  skill.value,
                );

              return (
                <button
                  key={skill.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    toggleSkill(skill.value)
                  }
                  className={[
                    "cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    selected
                      ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] text-[var(--usus-text)]"
                      : "border-[var(--usus-border)] text-[var(--usus-text-muted)] hover:border-[var(--usus-primary)]",
                  ].join(" ")}
                >
                  {skill.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </FormSection>

      {/* Customer */}
      <FormSection
        title="Customer"
        description="Who the AI customer is. All optional."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            id="customer-name"
            label="Name"
            value={values.customer_name}
            placeholder="Chidi"
            onChange={(value) =>
              setOptional("customer_name", value)
            }
          />

          <TextField
            id="customer-personality"
            label="Personality"
            value={values.customer_personality}
            placeholder="Careful with money"
            onChange={(value) =>
              setOptional(
                "customer_personality",
                value,
              )
            }
          />

          <TextField
            id="customer-emotion"
            label="Emotion"
            value={values.customer_emotion}
            placeholder="Worried"
            onChange={(value) =>
              setOptional(
                "customer_emotion",
                value,
              )
            }
          />
        </div>

        <TextAreaField
          id="customer-background"
          label="Background"
          value={values.customer_background}
          placeholder="First-time customer buying a laptop."
          onChange={(value) =>
            setOptional(
              "customer_background",
              value,
            )
          }
        />
      </FormSection>

      {/* Brief */}
      <FormSection
        title="Brief"
        description="What the trainee reads before starting."
      >
        <div>
          <label
            htmlFor="scenario-situation"
            className={labelClassName}
          >
            Situation
          </label>

          <textarea
            id="scenario-situation"
            value={values.situation}
            onChange={(event) =>
              set("situation", event.target.value)
            }
            required
            minLength={10}
            rows={3}
            placeholder="What happened before the customer got in touch."
            className={inputClassName}
          />
        </div>

        <TextAreaField
          id="customer-goal"
          label="Customer goal (optional)"
          value={values.customer_goal}
          placeholder="What the customer wants."
          onChange={(value) =>
            setOptional("customer_goal", value)
          }
        />

        <div>
          <label
            htmlFor="trainee-objective"
            className={labelClassName}
          >
            Trainee objective
          </label>

          <textarea
            id="trainee-objective"
            value={values.trainee_objective}
            onChange={(event) =>
              set(
                "trainee_objective",
                event.target.value,
              )
            }
            required
            minLength={10}
            rows={2}
            placeholder="What the trainee must achieve."
            className={inputClassName}
          />
        </div>

        <div>
          <p className={labelClassName}>
            Important information
          </p>

          <p className={`${hintClassName} -mt-1 mb-3`}>
            Policies and facts the trainee may use,
            for example a refund policy.
          </p>

          <div className="space-y-3">
            {values.important_information.map(
              (item, index) => (
                <div
                  key={index}
                  className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]"
                >
                  <input
                    aria-label={`Information ${index + 1} label`}
                    value={item.label}
                    onChange={(event) =>
                      setInformation(
                        index,
                        "label",
                        event.target.value,
                      )
                    }
                    placeholder="Refund policy"
                    className={`${inputClassName} h-10`}
                  />

                  <input
                    aria-label={`Information ${index + 1} content`}
                    value={item.content}
                    onChange={(event) =>
                      setInformation(
                        index,
                        "content",
                        event.target.value,
                      )
                    }
                    placeholder="Refunds are issued within 5 business days."
                    className={`${inputClassName} h-10`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "important_information",
                        values.important_information.filter(
                          (_, i) => i !== index,
                        ),
                      )
                    }
                    className="cursor-pointer text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-danger)]"
                  >
                    Remove
                  </button>
                </div>
              ),
            )}

            <button
              type="button"
              onClick={() =>
                set("important_information", [
                  ...values.important_information,
                  { label: "", content: "" },
                ])
              }
              className="cursor-pointer text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)]"
            >
              + Add information
            </button>
          </div>
        </div>
      </FormSection>

      {/* Hidden */}
      <FormSection
        title="Evaluation"
        description="Hidden from trainees. Shapes how the AI customer reacts and how sessions are scored."
      >
        <TextAreaField
          id="escalation-behavior"
          label="Escalation behaviour"
          value={values.escalation_behavior}
          placeholder="How the customer reacts to poor handling."
          onChange={(value) =>
            setOptional(
              "escalation_behavior",
              value,
            )
          }
        />

        <TextAreaField
          id="success-criteria"
          label="Success criteria"
          value={values.success_criteria}
          placeholder="What good handling looks like."
          onChange={(value) =>
            setOptional("success_criteria", value)
          }
        />
      </FormSection>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[var(--usus-danger)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-danger)]"
        >
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer rounded-lg bg-[var(--usus-primary)] px-4 py-2.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
      <div className="border-b border-[var(--usus-border)] px-6 py-5">
        <h2 className="text-base font-semibold text-[var(--usus-text)]">
          {title}
        </h2>

        <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
          {description}
        </p>
      </div>

      <div className="space-y-5 px-6 py-5">
        {children}
      </div>
    </section>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`${inputClassName} h-10`}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string | null;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>

      <input
        id={id}
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className={`${inputClassName} h-10`}
      />
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string | null;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>

      <textarea
        id={id}
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={2}
        placeholder={placeholder}
        className={inputClassName}
      />
    </div>
  );
}
