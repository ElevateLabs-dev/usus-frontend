import { apiClient } from "@/services/api-client";
import { getTenantId } from "@/services/auth-state";
import type { ScenarioBrief } from "@/types/scenario-brief";

export type BackendScenarioDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced";

export type BackendScenarioPersona =
  | "friendly"
  | "frustrated"
  | "angry";

export interface BackendScenarioCategory {
  id: string;
  name: string;
}

export interface BackendScenarioSkill {
  id: string;
  name: string;
}

/**
 * The signed-in user's own history
 * with a scenario.
 */
export interface BackendScenarioProgress {
  status:
    | "new"
    | "in_progress"
    | "completed";
  attempts: number;
  best_score: number | null;
  last_score: number | null;
}

/**
 * A scenario in the browse list
 * (GET /scenarios/).
 */
export interface BackendScenario {
  id: string;
  name: string;
  description: string;
  category: BackendScenarioCategory | null;
  persona: BackendScenarioPersona;
  difficulty: BackendScenarioDifficulty;
  skills: BackendScenarioSkill[];
  estimated_minutes: number;
  progress: BackendScenarioProgress;
  /** The trainee has not unlocked this level yet. */
  locked: boolean;
  /** What to do to unlock it. */
  locked_reason: string | null;
}

/**
 * The pre-roleplay brief
 * (GET /scenarios/{id}).
 */
export interface BackendScenarioBrief
  extends BackendScenario {
  customer: {
    name: string | null;
    personality: string | null;
    emotion: string | null;
    background: string | null;
  };
  situation: string | null;
  customer_goal: string | null;
  trainee_objective: string | null;
  important_information: {
    label: string;
    content: string;
  }[];
}

export async function getScenarios(): Promise<
  BackendScenario[]
> {
  const tenant_id = getTenantId();

  if (!tenant_id) {
    throw new Error(
      "Tenant context required",
    );
  }

  return apiClient<BackendScenario[]>(
    "/scenarios/",
  );
}

export async function getScenario(
  scenarioId: string,
): Promise<BackendScenarioBrief> {
  const tenant_id = getTenantId();

  if (!tenant_id) {
    throw new Error(
      "Tenant context required",
    );
  }

  return apiClient<BackendScenarioBrief>(
    `/scenarios/${scenarioId}`,
  );
}

function formatDifficulty(
  difficulty: BackendScenarioDifficulty,
): ScenarioBrief["difficulty"] {
  switch (difficulty) {
    case "beginner":
      return "Beginner";

    case "intermediate":
      return "Intermediate";

    case "advanced":
      return "Advanced";
  }
}

function formatPersona(
  persona: BackendScenarioPersona,
) {
  return (
    persona.charAt(0).toUpperCase() +
    persona.slice(1)
  );
}

/**
 * Get the pre-roleplay brief in the
 * shape used by the Scenario Brief page.
 */
export async function getScenarioBrief(
  scenarioId: string,
): Promise<ScenarioBrief> {
  const scenario =
    await getScenario(scenarioId);

  const persona =
    formatPersona(scenario.persona);

  return {
    id: scenario.id,

    title: scenario.name,

    description: scenario.description,

    category: scenario.category ?? {
      id: "general",
      name: "Customer scenario",
    },

    difficulty:
      formatDifficulty(
        scenario.difficulty,
      ),

    durationMinutes:
      scenario.estimated_minutes,

    customer: {
      name:
        scenario.customer.name ??
        "Customer",

      personality:
        scenario.customer.personality ??
        persona,

      emotionalState:
        scenario.customer.emotion ??
        persona,

      background:
        scenario.customer.background ??
        "",
    },

    situation: {
      summary:
        scenario.situation ??
        scenario.description,

      customerGoal:
        scenario.customer_goal ??
        undefined,
    },

    objective:
      scenario.trainee_objective ??
      scenario.description,

    skills:
      scenario.skills.map(
        (skill) => skill.name,
      ),

    importantInformation:
      scenario.important_information,

    attempts:
      scenario.progress.attempts,

    canStart: !scenario.locked,

    lockedReason: scenario.locked_reason,
  };
}
