export type ScenarioApiDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced";

export interface ScenarioApiResponse {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  system_prompt: string;
  persona: string;
  difficulty: ScenarioApiDifficulty;
};