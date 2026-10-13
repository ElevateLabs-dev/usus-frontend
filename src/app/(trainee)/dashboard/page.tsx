"use client";

import {
  useAuthUser,
} from "@/hooks/use-auth-user";

import {
  useEffect,
  useState,
} from "react";

import {
  getDashboard,
  type DashboardData,
} from "@/services/dashboard-service";

import {
  OverallProgress,
} from "@/components/dashboard/overall-progress";

import {
  SkillPerformance,
} from "@/components/dashboard/skill-performance";

import {
  ContinueTraining,
} from "@/components/dashboard/continue-training";

import {
  RecentSessions,
} from "@/components/dashboard/recent-sessions";

import {
  RecommendedScenarios,
} from "@/components/dashboard/recommended-scenarios";

import {
  QuickActions,
} from "@/components/dashboard/quick-actions";


export default function DashboardPage() {
  const user =
    useAuthUser();

  const [data, setData] =
    useState<DashboardData | null>(
      null,
    );

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const result =
          await getDashboard();

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your dashboard.",
          );
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <div
        className="
          min-h-full
          bg-[var(--usus-background)]
          text-[var(--usus-text)]
        "
      >
        <main
          className="
            mx-auto
            w-full
            max-w-7xl
            px-4
            py-16
            text-center
            sm:px-6
            lg:px-8
          "
        >
          <p
            role={error ? "alert" : undefined}
            className="
              text-sm
              text-[var(--usus-text-muted)]
            "
          >
            {error ||
              "Loading your dashboard..."}
          </p>
        </main>
      </div>
    );
  }


  return (
    <div
      className="
        min-h-full
        bg-[var(--usus-background)]
        text-[var(--usus-text)]
        transition-colors
        duration-200
      "
    >

      <main
        className="
          mx-auto
          w-full
          max-w-7xl
          space-y-8
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >

        {/* Welcome */}

        <section>

          <p
            className="
              text-sm
              text-[var(--usus-text-muted)]
            "
          >
            Dashboard / Trainee
          </p>


          <h1
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
              text-[var(--usus-text)]
            "
          >
            Welcome back
          </h1>


          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              text-[var(--usus-text-muted)]
            "
          >
            {user?.email ??
              "Loading account..."}
          </p>


          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              text-[var(--usus-text-muted)]
            "
          >
            Keep building your
            customer service skills.
            Your next training session
            is waiting for you.
          </p>

        </section>


        {/* Overall progress */}

        <section
          className="
            grid
            gap-6
            lg:grid-cols-[1.3fr_1fr]
          "
        >

          <OverallProgress
            score={
              data.overall.score
            }
            completion={
              data.overall.completion
            }
            completed={
              data.overall
                .scenariosCompleted
            }
            total={
              data.overall
                .totalScenarios
            }
          />


          <SkillPerformance
            skills={
              data.skills
            }
          />

        </section>


        {/* Continue training */}

        <ContinueTraining
          items={
            data.continueTraining
          }
        />


        {/* Recent sessions */}

        <section
          className="
            grid
            gap-6
            xl:grid-cols-[1.4fr_1fr]
          "
        >

          <RecentSessions
            sessions={
              data.recentSessions
            }
          />


          <QuickActions />

        </section>


        {/* Recommendations */}

        <RecommendedScenarios
          scenarios={
            data.recommendations
          }
        />

      </main>

    </div>
  );
}