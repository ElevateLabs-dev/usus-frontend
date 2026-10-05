import { apiClient } from "@/services/api-client";

export interface StartSimulationRequest {
  scenario_id: string;
}

export type SimulationStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "evaluated";

export interface SimulationSession {
  id: string;
  tenant_id: string;
  scenario_id: string;
  status: SimulationStatus;
}

export interface SendMessageRequest {
  content: string;
}

export interface BackendMessage {
  id: string;
  tenant_id: string;
  session_id: string;
  role: "user" | "model" | "system";
  content: string;
}

export interface SendMessageResponse {
  user_message: BackendMessage;
  ai_reply: BackendMessage;
}

export interface EndSimulationResponse {
  session: SimulationSession;
  evaluation: BackendEvaluation;
}

export interface BackendDimensionScore {
  id: string;
  evaluation_id: string;
  dimension_name: string;
  score: number;
  rationale: string;
}

export interface BackendRedFlag {
  id: string;
  evaluation_id: string;
  reason: string;
  description: string;
}

export interface BackendEvaluation {
  id: string;
  tenant_id: string;
  session_id: string;
  overall_score: number | null;
  summary: string | null;
  dimension_scores: BackendDimensionScore[];
  red_flags: BackendRedFlag[];
}

export async function startSimulation(
  scenarioId: string,
): Promise<SimulationSession> {
  return apiClient<SimulationSession>(
    "/simulations/start",
    {
      method: "POST",
      body: JSON.stringify({
        scenario_id: scenarioId,
      }),
    },
  );
}

export async function sendSimulationMessage(
  sessionId: string,
  content: string,
): Promise<SendMessageResponse> {
  return apiClient<SendMessageResponse>(
    `/simulations/${sessionId}/message`,
    {
      method: "POST",
      body: JSON.stringify({
        content,
      }),
    },
  );
}

export async function endSimulation(
  sessionId: string,
): Promise<EndSimulationResponse> {
  return apiClient<EndSimulationResponse>(
    `/simulations/${sessionId}/end`,
    {
      method: "POST",
    },
  );
}

export async function getSimulationEvaluation(
  sessionId: string,
): Promise<BackendEvaluation> {
  return apiClient<BackendEvaluation>(
    `/simulations/${sessionId}/evaluation`,
  );
}

export async function getSimulationHealth(): Promise<{
  status: string;
  domain: string;
}> {
  return apiClient<{
    status: string;
    domain: string;
  }>("/simulations/health");
}