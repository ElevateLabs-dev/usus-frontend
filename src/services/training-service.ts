import { apiClient } from "@/services/api-client";

/*
 * ============================================================
 * OPTIONS (match the backend enums)
 * ============================================================
 */

export const CATEGORIES = [
  { value: "de_escalation", label: "De-escalation" },
  { value: "communication", label: "Communication" },
  { value: "problem_resolution", label: "Problem Resolution" },
  { value: "empathy", label: "Empathy" },
  { value: "policy_compliance", label: "Policy & Compliance" },
] as const;

export const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export const PERSONAS = [
  { value: "friendly", label: "Friendly" },
  { value: "frustrated", label: "Frustrated" },
  { value: "angry", label: "Angry" },
] as const;

export const SKILLS = [
  { value: "accuracy", label: "Accuracy" },
  { value: "empathy", label: "Empathy" },
  { value: "clarity", label: "Clarity" },
  { value: "policy", label: "Policy" },
  { value: "resolution", label: "Resolution" },
  { value: "de_escalation", label: "De-escalation" },
  { value: "efficiency", label: "Efficiency" },
] as const;

export function optionLabel(
  options: readonly {
    value: string;
    label: string;
  }[],
  value: string | null,
) {
  return (
    options.find((option) => option.value === value)?.label ??
    value ??
    "—"
  );
}

/*
 * ============================================================
 * BACKEND SHAPES
 * ============================================================
 */

export interface ImportantInformation {
  label: string;
  content: string;
}

/** Categories returned by GET /scenarios/categories. */
export interface ScenarioCategory {
  id: string;
  name: string;
  description: string;
  scenario_count: number;
}

/** The fields an editor can write. */
export interface ScenarioInput {
  name: string;
  description: string;
  category: string;
  difficulty: string;
  persona: string;
  skills: string[];
  estimated_minutes: number;
  customer_name: string | null;
  customer_personality: string | null;
  customer_emotion: string | null;
  /** Voice for voice role-play; null = the default voice. */
  voice_id: string | null;
  customer_background: string | null;
  situation: string;
  customer_goal: string | null;
  trainee_objective: string;
  important_information: ImportantInformation[];
  /** Hidden from trainees. */
  escalation_behavior: string | null;
  /** Hidden from trainees; used by the evaluator. */
  success_criteria: string | null;
}

/** A scenario returned by the AI suggestions endpoint. */
export type ScenarioSuggestion = ScenarioInput;

/** Response from POST /scenarios/suggestions. */
export interface ScenarioSuggestionsResponse {
  suggestions: ScenarioSuggestion[];
  skipped_similar: number;
}

/** GET /scenarios/manage: the full scenario. */
export interface ManagedScenario extends ScenarioInput {
  id: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

/*
 * ============================================================
 * SCENARIO CATEGORIES
 * ============================================================
 */

/** Fetch scenario categories from the backend. */
export async function getScenarioCategories(): Promise<
  ScenarioCategory[]
> {
  return apiClient<ScenarioCategory[]>("/scenarios/categories");
}

/*
 * ============================================================
 * AI SCENARIO SUGGESTIONS
 * ============================================================
 */

export interface ScenarioSuggestionsInput {
  count: number;
  category: string;
  difficulty: string;
  metrics: string[];
  focus: string;
  similarity_threshold: number;
}

/** Generate AI scenario suggestions using the Knowledge Base. */
export async function getScenarioSuggestions(
  input: ScenarioSuggestionsInput,
): Promise<ScenarioSuggestionsResponse> {
  return apiClient<ScenarioSuggestionsResponse>(
    "/scenarios/suggestions",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

/*
 * ============================================================
 * VOICE OPTIONS
 * ============================================================
 */

/** A voice a scenario can use (GET /scenarios/voices). */
export interface VoiceOption {
  id: string;
  name: string;
  gender: "female" | "male";
}

export async function getVoices(): Promise<VoiceOption[]> {
  return apiClient<VoiceOption[]>("/scenarios/voices");
}

/**
 * A short Vapi call where the customer introduces
 * themselves in the chosen voice and emotion.
 * Pass the result to vapi.start().
 */
export async function getVoicePreview(input: {
  voice_id: string | null;
  persona: string;
  customer_name: string | null;
  customer_emotion: string | null;
  description: string;
}): Promise<Record<string, unknown>> {
  return apiClient<Record<string, unknown>>(
    "/scenarios/voice-preview",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

/*
 * ============================================================
 * MANAGED SCENARIOS
 * ============================================================
 */

/** Get every scenario, including archived ones. */
export async function getManagedScenarios(): Promise<
  ManagedScenario[]
> {
  return apiClient<ManagedScenario[]>("/scenarios/manage");
}

/** Get one scenario by ID. */
export async function getManagedScenario(
  scenarioId: string,
): Promise<ManagedScenario> {
  return apiClient<ManagedScenario>(
    `/scenarios/${encodeURIComponent(scenarioId)}/manage`,
  );
}

/*
 * ============================================================
 * CREATE SCENARIO
 * ============================================================
 */

/**
 * Create a scenario (409 if the name is
 * already used).
 */
export async function createScenario(
  input: ScenarioInput,
): Promise<ManagedScenario> {
  return apiClient<ManagedScenario>("/scenarios/", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/*
 * ============================================================
 * UPDATE SCENARIO
 * ============================================================
 */

/**
 * Edit a scenario.
 * Sessions already started keep the version they began with.
 */
export async function updateScenario(
  scenarioId: string,
  input: Partial<ScenarioInput> & {
    is_archived?: boolean;
  },
): Promise<ManagedScenario> {
  return apiClient<ManagedScenario>(
    `/scenarios/${encodeURIComponent(scenarioId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

/*
 * ============================================================
 * ARCHIVE SCENARIO
 * ============================================================
 */

/**
 * Archive a scenario: trainees stop seeing it;
 * its history is kept.
 */
export async function archiveScenario(
  scenarioId: string,
): Promise<void> {
  await apiClient<void>(
    `/scenarios/${encodeURIComponent(scenarioId)}`,
    {
      method: "DELETE",
    },
  );
}

/** Restore an archived scenario. */
export async function restoreScenario(
  scenarioId: string,
): Promise<ManagedScenario> {
  return updateScenario(scenarioId, {
    is_archived: false,
  });
}