"use client";

import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { useEffect, useState } from "react";

import { ScenarioForm } from "@/components/company-admin/scenario-form";

import {
  getManagedScenario,
  updateScenario,
  type ManagedScenario,
  type ScenarioInput,
} from "@/services/training-service";

/**
 * The editable fields of a scenario. Older
 * scenarios may have empty required fields.
 */
function toInput(
  scenario: ManagedScenario,
): ScenarioInput {
  return {
    name: scenario.name,
    description: scenario.description,
    category:
      scenario.category ?? "de_escalation",
    difficulty: scenario.difficulty,
    persona: scenario.persona,
    skills: scenario.skills,
    estimated_minutes:
      scenario.estimated_minutes,
    customer_name: scenario.customer_name,
    customer_personality:
      scenario.customer_personality,
    customer_emotion: scenario.customer_emotion,
    customer_background:
      scenario.customer_background,
    situation: scenario.situation ?? "",
    customer_goal: scenario.customer_goal,
    trainee_objective:
      scenario.trainee_objective ?? "",
    important_information:
      scenario.important_information,
    escalation_behavior:
      scenario.escalation_behavior,
    success_criteria: scenario.success_criteria,
  };
}

export default function EditScenarioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [scenario, setScenario] =
    useState<ManagedScenario | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getManagedScenario(id)
      .then((data) => {
        if (!cancelled) {
          setScenario(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load the scenario.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/company-admin/training"
            className="text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)]"
          >
            ← Back to Training
          </Link>

          <div className="mb-8 mt-6">
            <p className="text-xs font-medium text-[var(--usus-primary)]">
              Training
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              {scenario?.name ?? "Edit Scenario"}
            </h1>

            <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
              Changes apply to new sessions. Sessions
              already started keep the version they
              began with.
              {scenario?.is_archived &&
                " This scenario is archived; trainees cannot see it."}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-[var(--usus-danger)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-danger)]"
            >
              {error}
            </div>
          )}

          {!scenario && !error && (
            <p className="text-sm text-[var(--usus-text-muted)]">
              Loading scenario...
            </p>
          )}

          {scenario && (
            <ScenarioForm
              initial={toInput(scenario)}
              submitLabel="Save changes"
              onSubmit={async (input) => {
                await updateScenario(id, input);
                router.push(
                  "/company-admin/training",
                );
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
