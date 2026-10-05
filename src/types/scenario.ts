export type ScenarioDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type ScenarioStatus =
  | "new"
  | "in-progress"
  | "completed"
  | "locked";

export interface ScenarioCategory {
  id: string;
  name: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;

  category: ScenarioCategory;

  difficulty: ScenarioDifficulty;

  skills: string[];

  durationMinutes: number;

  status: ScenarioStatus;

  progress: number;

  previousScore?: number;

  recommended: boolean;

  createdAt: string;
}