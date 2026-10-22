"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Phone, Play } from "lucide-react";

import { getScenarioBrief } from "@/services/scenario-service";
import { voiceAvailable } from "@/services/simulation-service";

import type { ScenarioBrief } from "@/types/scenario-brief";

interface ScenarioBriefPageProps {
  params: Promise<{
    scenarioId: string;
  }>;
}

export default function ScenarioBriefPage({
  params,
}: ScenarioBriefPageProps) {
  const router = useRouter();

  const { scenarioId } = React.use(params);

  const [scenario, setScenario] =
    useState<ScenarioBrief | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadScenario() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getScenarioBrief(scenarioId);

        if (!cancelled) {
          setScenario(data);
        }
      } catch (err) {
        if (!cancelled) {
          setScenario(null);

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load scenario.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadScenario();

    return () => {
      cancelled = true;
    };
  }, [scenarioId]);

  if (loading) {
    return (
      <main className="min-h-full bg-[var(--usus-background)]">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8">
          <p className="text-sm text-[var(--usus-text-muted)]">
            Loading scenario...
          </p>
        </div>
      </main>
    );
  }

  if (!scenario) {
    return (
            <main className="min-h-full bg-[var(--usus-background)]">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8">
          <h1 className="text-2xl font-bold text-[var(--usus-text)]">
            Scenario not found
          </h1>

          <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
            {error ||
              "The scenario you are looking for does not exist or is no longer available."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/scenarios")}
            className="
              mt-6
              cursor-pointer
              rounded-xl
              bg-[var(--usus-primary)]
              px-5
              py-3
              text-sm
              font-semibold
              text-[#111111]
              transition-all
              hover:brightness-95
              hover:shadow-md
            "
          >
            Back to scenarios
          </button>
        </div>
      </main>
    );
  }


  const currentScenarioId = scenario.id;

  function startSimulation() {
    router.push(
      `/scenarios/${currentScenarioId}/role-play`
    );
  }

  function startVoiceSimulation() {
    router.push(
      `/scenarios/${currentScenarioId}/role-play?mode=voice`
    );
  }

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <main className="mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-8 lg:px-10 xl:px-12">

        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/scenarios")}
          className="
            mb-6
            inline-flex
            cursor-pointer
            items-center
            gap-2
            text-sm
            font-medium
            text-[var(--usus-text-muted)]
            transition-colors
            hover:text-[var(--usus-primary-hover)]
          "
        >
          <ArrowLeft size={17} />
          Back to scenarios
        </button>

        {/* =====================================================
            SCENARIO HEADER
        ===================================================== */}
        <section
          className="
            overflow-hidden
            rounded-3xl
            border
            border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            shadow-[var(--usus-shadow)]
          "
        >
          <div className="p-6 sm:p-8 lg:p-10">

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--usus-primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--usus-text)]">
                {scenario.category.name}
              </span>

              <span className="rounded-full bg-[var(--usus-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--usus-text)]">
                {scenario.difficulty}
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--usus-text-muted)]">
                <Clock size={14} />
                ~{scenario.durationMinutes} minutes
              </span>
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-[var(--usus-text)] sm:text-4xl">
              {scenario.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--usus-text-muted)]">
              {scenario.description}
            </p>
          </div>
        </section>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* LEFT */}
          <div className="space-y-6">

            {/* Situation */}
            <section
              className="
                rounded-2xl
                border
                border-[var(--usus-border)]
                bg-[var(--usus-surface)]
                p-6
                shadow-[var(--usus-shadow)]
                sm:p-7
              "
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--usus-text-muted)]">
                Situation
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[var(--usus-text)]">
                What happened?
              </h2>

              <p className="mt-4 text-sm leading-7 text-[var(--usus-text-muted)]">
                {scenario.situation.summary}
              </p>

              {scenario.situation.background && (
                <div className="mt-5 rounded-xl bg-[var(--usus-surface-soft)] p-4">
                  <p className="text-xs font-semibold text-[var(--usus-text)]">
                    Background
                  </p>

                  <p className="mt-1.5 text-sm leading-6 text-[var(--usus-text-muted)]">
                    {scenario.situation.background}
                  </p>
                </div>
              )}

              {scenario.situation.customerGoal && (
                <div className="mt-5 rounded-xl bg-[var(--usus-surface-soft)] p-4">
                  <p className="text-xs font-semibold text-[var(--usus-text)]">
                    What the customer wants
                  </p>

                  <p className="mt-1.5 text-sm leading-6 text-[var(--usus-text-muted)]">
                    {scenario.situation.customerGoal}
                  </p>
                </div>
              )}
            </section>

            {/* Objective */}
            <section
              className="
                rounded-2xl
                border
                border-[var(--usus-border)]
                bg-[var(--usus-surface)]
                p-6
                shadow-[var(--usus-shadow)]
                sm:p-7
              "
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--usus-text-muted)]">
                Your objective
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[var(--usus-text)]">
                What you need to accomplish
              </h2>

              <p className="mt-4 text-sm leading-7 text-[var(--usus-text-muted)]">
                {scenario.objective}
              </p>
            </section>

            {/* Important information */}
            <section
              className="
                rounded-2xl
                border
                border-[var(--usus-border)]
                bg-[var(--usus-surface)]
                p-6
                shadow-[var(--usus-shadow)]
                sm:p-7
              "
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--usus-text-muted)]">
                Important information
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[var(--usus-text)]">
                Keep these details in mind
              </h2>

              <div className="mt-5 space-y-3">
                {scenario.importantInformation.map(
                  (information) => (
                    <div
                      key={information.label}
                      className="
                        rounded-xl
                        border
                        border-[var(--usus-border)]
                        bg-[var(--usus-surface-soft)]
                        p-4
                      "
                    >
                      <p className="text-sm font-semibold text-[var(--usus-text)]">
                        {information.label}
                      </p>

                      <p className="mt-1.5 text-sm leading-6 text-[var(--usus-text-muted)]">
                        {information.content}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="space-y-6">

            {/* Customer profile */}
            <section
              className="
                rounded-2xl
                border
                border-[var(--usus-border)]
                bg-[var(--usus-surface)]
                p-6
                shadow-[var(--usus-shadow)]
              "
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--usus-text-muted)]">
                Customer profile
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[var(--usus-primary-soft)]
                    text-lg
                    font-bold
                    text-[var(--usus-text)]
                  "
                >
                  {scenario.customer.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <h2 className="font-semibold text-[var(--usus-text)]">
                    {scenario.customer.name}
                  </h2>

                  <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                    {scenario.customer.personality}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs text-[var(--usus-text-muted)]">
                    Emotional state
                  </p>

                  <p className="mt-1 text-sm font-medium text-[var(--usus-text)]">
                    {scenario.customer.emotionalState}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--usus-text-muted)]">
                    Background
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[var(--usus-text-muted)]">
                    {scenario.customer.background}
                  </p>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section
              className="
                rounded-2xl
                border
                border-[var(--usus-border)]
                bg-[var(--usus-surface)]
                p-6
                shadow-[var(--usus-shadow)]
              "
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--usus-text-muted)]">
                Skills being tested
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {scenario.skills.map((skill) => (
                  <span
                    key={skill}
                    className="
                      rounded-full
                      bg-[var(--usus-primary-soft)]
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-[var(--usus-text)]
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Start */}
            <section
              className="
                sticky
                top-6
                rounded-2xl
                border
                border-[var(--usus-border)]
                bg-[var(--usus-surface)]
                p-6
                shadow-[var(--usus-shadow)]
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--usus-text-muted)]">
                    Estimated duration
                  </p>

                  <p className="mt-1 font-semibold text-[var(--usus-text)]">
                    ~{scenario.durationMinutes} minutes
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[var(--usus-text-muted)]">
                    Attempts
                  </p>

                  <p className="mt-1 font-semibold text-[var(--usus-text)]">
                    {scenario.attempts}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={!scenario.canStart}
                onClick={startSimulation}
                className="
                  mt-6
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--usus-primary)]
                  px-5
                  py-3.5
                  text-sm
                  font-bold
                  text-[#111111]
                  transition-all
                  duration-200
                  hover:brightness-95
                  hover:shadow-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--usus-primary)]
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Play size={17} fill="currentColor" />
                {voiceAvailable
                  ? "Start Text Simulation"
                  : "Start Simulation"}
              </button>

              {voiceAvailable && (
                <button
                  type="button"
                  disabled={!scenario.canStart}
                  onClick={startVoiceSimulation}
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--usus-primary)] px-5 py-3.5 text-sm font-bold text-[var(--usus-text)] transition-all duration-200 hover:bg-[var(--usus-primary-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--usus-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Phone size={17} />
                  Start Voice Call
                </button>
              )}

              <p className="mt-3 text-center text-[11px] leading-5 text-[var(--usus-text-muted)]">
                Make sure you understand the situation before
                starting the simulation.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};