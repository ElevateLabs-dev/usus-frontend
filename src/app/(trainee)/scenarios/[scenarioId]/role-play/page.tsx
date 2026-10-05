"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  getScenario,
  type BackendScenario,
} from "@/services/scenario-service";

import {
  startSimulation,
  sendSimulationMessage,
  endSimulation,
} from "@/services/simulation-service";

import type {
  ConversationMessage,
  SimulationStatus,
} from "@/types/role-play";

import { SimulationHeader } from "@/components/role-play/simulation-header";
import { SessionStatus } from "@/components/role-play/session-status";
import { CustomerPanel } from "@/components/role-play/customer-panel";
import { ConversationWindow } from "@/components/role-play/conversation-window";
import { EndSessionDialog } from "@/components/role-play/end-session-dialog";

interface RolePlayPageProps {
  params: Promise<{
    scenarioId: string;
  }>;
}

interface RolePlayScenario {
  id: string;
  category: string;
  difficulty: BackendScenario["difficulty"];
  title: string;
  durationMinutes: number;
  objective: string;
  customer: {
    name: string;
    personality: string;
    emotionalState: string;
    background: string;
  };
}

function mapBackendScenario(
  scenario: BackendScenario,
): RolePlayScenario {
  const persona =
    scenario.persona.charAt(0).toUpperCase() +
    scenario.persona.slice(1);

  return {
    id: scenario.id,
    category: "Customer scenario",
    difficulty: scenario.difficulty,
    title: scenario.name,
    durationMinutes: 10,
    objective: scenario.description,
    customer: {
      name: "Customer",
      personality: persona,
      emotionalState: persona,
      background: scenario.description,
    },
  };
}

function mapBackendMessage(
  message: {
    id: string;
    role: "user" | "model" | "system";
    content: string;
  },
): ConversationMessage | null {
  if (message.role === "system") {
    return null;
  }

  return {
    id: message.id,
    sender:
      message.role === "model"
        ? "customer"
        : "trainee",
    content: message.content,
    timestamp:
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
  };
}

export default function RolePlayPage({
  params,
}: RolePlayPageProps) {
  const router = useRouter();

  const { scenarioId } = use(params);

  /*
   * ============================================================
   * SCENARIO
   * ============================================================
   */

  const [scenario, setScenario] =
    useState<RolePlayScenario | null>(null);

  const [loadingScenario, setLoadingScenario] =
    useState(true);

  const [scenarioError, setScenarioError] =
    useState("");

  /*
   * ============================================================
   * REAL SIMULATION SESSION
   * ============================================================
   */

  const [sessionId, setSessionId] =
    useState<string | null>(null);

  const [startingSession, setStartingSession] =
    useState(true);

  const [sessionError, setSessionError] =
    useState("");

  /*
   * ============================================================
   * CONVERSATION
   * ============================================================
   */

  const [messages, setMessages] =
    useState<ConversationMessage[]>([]);

  const [status, setStatus] =
    useState<SimulationStatus>("idle");

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [showEndDialog, setShowEndDialog] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /*
   * ============================================================
   * LOAD SCENARIO
   * ============================================================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadScenario() {
      try {
        setLoadingScenario(true);
        setScenarioError("");

        const data =
          await getScenario(scenarioId);

        if (cancelled) {
          return;
        }

        setScenario(
          mapBackendScenario(data),
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setScenarioError(
          error instanceof Error
            ? error.message
            : "Unable to load scenario.",
        );
      } finally {
        if (!cancelled) {
          setLoadingScenario(false);
        }
      }
    }

    loadScenario();

    return () => {
      cancelled = true;
    };
  }, [scenarioId]);

  /*
   * ============================================================
   * START REAL SIMULATION
   * ============================================================
   */

  useEffect(() => {
    if (!scenario) {
      return;
    }

    const currentScenarioId =
      scenario.id;

    let cancelled = false;

    async function createRealSession() {
      try {
        setStartingSession(true);
        setSessionError("");

        const session =
          await startSimulation(
            currentScenarioId,
          );

        if (cancelled) {
          return;
        }

        setSessionId(session.id);
        setStatus("ready");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSessionError(
          error instanceof Error
            ? error.message
            : "Unable to start simulation.",
        );

        setStatus("error");
      } finally {
        if (!cancelled) {
          setStartingSession(false);
        }
      }
    }

    createRealSession();

    return () => {
      cancelled = true;
    };
  }, [scenario]);

  /*
   * ============================================================
   * TIMER
   * ============================================================
   */

  useEffect(() => {
    if (
      !sessionId ||
      status === "session-ended" ||
      status === "error"
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setElapsedSeconds(
          (current) => current + 1,
        );
      }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [sessionId, status]);

  /*
   * ============================================================
   * SEND REAL MESSAGE
   * ============================================================
   */

  async function handleSendMessage(
    content: string,
  ) {
    if (
      !sessionId ||
      status === "sending" ||
      status ===
        "customer-responding" ||
      status === "session-ended" ||
      isSubmitting
    ) {
      return;
    }

    const traineeMessage: ConversationMessage = {
      id: `local-${Date.now()}`,
      sender: "trainee",
      content,
      timestamp:
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };

    /*
     * Show the trainee message immediately.
     */

    setMessages((current) => [
      ...current,
      traineeMessage,
    ]);

    setStatus("customer-responding");
    setSessionError("");

    try {
      const response =
        await sendSimulationMessage(
          sessionId,
          content,
        );

      const customerMessage =
        mapBackendMessage(
          response.ai_reply,
        );

      if (customerMessage) {
        setMessages((current) => [
          ...current,
          customerMessage,
        ]);
      }

      setStatus("ready");
    } catch (error) {
      console.error(
        "Failed to send simulation message:",
        error,
      );

      setSessionError(
        error instanceof Error
          ? error.message
          : "Unable to send your message.",
      );

      setStatus("error");
    }
  }

  /*
   * ============================================================
   * END REAL SESSION
   * ============================================================
   */

  async function handleEndSession() {
    if (
      !scenario ||
      !sessionId ||
      isSubmitting
    ) {
      return;
    }

    const currentScenarioId =
      scenario.id;

    setShowEndDialog(false);
    setIsSubmitting(true);
    setStatus("session-ended");
    setSessionError("");

    try {
      await endSimulation(sessionId);

      router.push(
        `/scenarios/${currentScenarioId}/evaluation?sessionId=${encodeURIComponent(
          sessionId,
        )}&duration=${elapsedSeconds}`,
      );
    } catch (error) {
      console.error(
        "Failed to end simulation:",
        error,
      );

      setIsSubmitting(false);
      setStatus("error");

      setSessionError(
        error instanceof Error
          ? error.message
          : "Unable to complete the simulation.",
      );
    }
  }

  /*
   * ============================================================
   * SCENARIO LOADING
   * ============================================================
   */

  if (loadingScenario) {
    return (
      <main className="min-h-full bg-[var(--usus-background)]">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <p className="text-sm text-[var(--usus-text-muted)]">
            Loading scenario...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * SCENARIO ERROR
   * ============================================================
   */

  if (scenarioError || !scenario) {
    return (
      <main className="min-h-full bg-[var(--usus-background)]">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <h1 className="text-2xl font-bold text-[var(--usus-text)]">
            Scenario not found
          </h1>

          <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
            {scenarioError ||
              "The scenario does not exist or is no longer available."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/scenarios")
            }
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

  /*
   * ============================================================
   * STARTING SESSION
   * ============================================================
   */

  if (startingSession) {
    return (
      <main className="min-h-full bg-[var(--usus-background)]">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <div
            className="
              mx-auto
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-[var(--usus-border)]
              border-t-[var(--usus-primary)]
            "
          />

          <p className="mt-4 text-sm text-[var(--usus-text-muted)]">
            Starting your simulation...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * SESSION ERROR
   * ============================================================
   */

  if (!sessionId) {
    return (
      <main className="min-h-full bg-[var(--usus-background)]">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <h1 className="text-2xl font-bold text-[var(--usus-text)]">
            Unable to start simulation
          </h1>

          <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
            {sessionError ||
              "A simulation session could not be created."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/scenarios")
            }
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
            "
          >
            Back to scenarios
          </button>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <main
        className="
          mx-auto
          w-full
          max-w-[1280px]
          px-5
          py-6
          sm:px-8
          lg:px-10
        "
      >
        <SimulationHeader
          category={scenario.category}
          difficulty={scenario.difficulty}
          title={scenario.title}
          durationMinutes={
            scenario.durationMinutes
          }
          onExit={() =>
            setShowEndDialog(true)
          }
        />

        <div className="mt-6">
          <SessionStatus
            objective={scenario.objective}
            status={status}
            elapsedSeconds={
              elapsedSeconds
            }
          />
        </div>

        {sessionError &&
          status === "error" && (
            <div
              role="alert"
              className="
                mt-4
                rounded-xl
                border
                border-[var(--usus-danger)]
                bg-[var(--usus-surface)]
                px-4
                py-3
                text-sm
                text-[var(--usus-danger)]
              "
            >
              {sessionError}
            </div>
          )}

        <section
          className="
            mt-6
            grid
            gap-6
            lg:grid-cols-[280px_1fr]
          "
        >
          <CustomerPanel
            name={scenario.customer.name}
            personality={
              scenario.customer.personality
            }
            emotionalState={
              scenario.customer
                .emotionalState
            }
            background={
              scenario.customer.background
            }
          />

          <ConversationWindow
            messages={messages}
            customerName={
              scenario.customer.name
            }
            status={status}
            onSend={handleSendMessage}
          />
        </section>
      </main>

      <EndSessionDialog
        open={showEndDialog}
        onClose={() =>
          setShowEndDialog(false)
        }
        onConfirm={handleEndSession}
      />

      {isSubmitting && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/30
            backdrop-blur-sm
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-[var(--usus-border)]
              bg-[var(--usus-surface)]
              px-8
              py-7
              text-center
              shadow-2xl
            "
          >
            <div
              className="
                mx-auto
                h-8
                w-8
                animate-spin
                rounded-full
                border-2
                border-[var(--usus-border)]
                border-t-[var(--usus-primary)]
              "
            />

            <p className="mt-4 text-sm font-semibold text-[var(--usus-text)]">
              Completing your session...
            </p>

            <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
              Generating your evaluation.
            </p>
          </div>
        </div>
      )}
    </div>
  );                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
 };