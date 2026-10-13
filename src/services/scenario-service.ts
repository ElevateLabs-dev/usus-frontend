import { apiClient } from "@/services/api-client";
import { getTenantId } from "@/services/auth-state";

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