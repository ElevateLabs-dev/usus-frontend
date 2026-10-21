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
  user_id: string | null;
  scenario_id: string;
  status: SimulationStatus;
  created_at: string;
  ended_at: string | null;
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

export interface BackendDimensionScore {
  id: string;
  evaluation_id: string;
  /**
   * accuracy | empathy | clarity | policy |
   * resolution | de_escalation | efficiency
   */
  dimension_key: string | null;
  dimension_name: string;
  /** 0-100 */
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
  /** 0-100: average of the 7 dimension scores */
  overall_score: number | null;
  summary: string | null;
  strengths: string[];
  improvements: string[];
  missed_opportunities: string[];
  recommendations: string[];
  dimension_scores: BackendDimensionScore[];
  red_flags: BackendRedFlag[];
  created_at: string;
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

/**
 * End the session.
 *
 * The backend returns immediately with the
 * session marked "completed" and generates the
 * evaluation in the background. Use
 * getEvaluation() to wait for the result.
 */
export async function endSimulation(
  sessionId: string,
): Promise<SimulationSession> {
  return apiClient<SimulationSession>(
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
/*
 * ============================================================
 * VOICE (Vapi)
 * ============================================================
 */

/** Public Vapi key; voice role-play is hidden without it. */
export const VAPI_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "";

export const voiceAvailable =
  VAPI_PUBLIC_KEY.length > 0;

/**
 * Create the AI customer for a voice call.
 * Pass the returned id to vapi.start().
 */
export async function startVoiceCall(
  sessionId: string,
): Promise<string> {
  const data = await apiClient<{
    assistant_id: string;
  }>(`/simulations/${sessionId}/voice`, {
    method: "POST",
  });

  return data.assistant_id;
}

/**
 * End a voice session: the backend saves the
 * call's transcript and starts the evaluation,
 * like endSimulation(). Can take a few seconds.
 */
export async function endVoiceSimulation(
  sessionId: string,
  callId: string,
): Promise<SimulationSession> {
  return apiClient<SimulationSession>(
    `/simulations/${sessionId}/voice/end`,
    {
      method: "POST",
      body: JSON.stringify({
        call_id: callId,
      }),
    },
  );
}
