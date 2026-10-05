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

export interface BackendScenario {
  id: string;
  name: string;
  description: string;
  system_prompt: string | null;
  persona: BackendScenarioPersona;
  difficulty: BackendScenarioDifficulty;
  tenant_id: string;
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
): Promise<BackendScenario> {
  const tenant_id = getTenantId();

  if (!tenant_id) {
    throw new Error(
      "Tenant context required",
    );
  }

  return apiClient<BackendScenario>(
    `/scenarios/${scenarioId}`,
  );
}