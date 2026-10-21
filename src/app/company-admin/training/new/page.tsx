"use client";

import Link from "next/link";
import { useStaffArea } from "@/hooks/use-staff-area";
import { useRouter } from "next/navigation";

import {
  EMPTY_SCENARIO,
  ScenarioForm,
} from "@/components/company-admin/scenario-form";

import { createScenario } from "@/services/training-service";

export default function NewScenarioPage() {
  const area = useStaffArea();

  const router = useRouter();

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href={area.training}
            className="text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)]"
          >
            ← Back to Training
          </Link>

          <div className="mb-8 mt-6">
            <p className="text-xs font-medium text-[var(--usus-primary)]">
              Training
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              New Scenario
            </h1>

            <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
              The AI customer is built from these
              details. Trainees can practise it as soon
              as it is saved.
            </p>
          </div>

          <ScenarioForm
            initial={EMPTY_SCENARIO}
            submitLabel="Create scenario"
            onSubmit={async (input) => {
              await createScenario(input);
              router.push(area.training);
            }}
          />
        </div>
      </section>
    </div>
  );
}
