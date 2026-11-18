import { apiClient } from "@/services/api-client";

/*
 * ============================================================
 * BACKEND SHAPES
 * ============================================================
 */

export interface UsageTotals {
  sessions: number;
  text_sessions: number;
  voice_sessions: number;
  session_minutes: number;
  voice_minutes: number;
  input_tokens: number;
  output_tokens: number;
  /** OpenAI cost in USD */
  ai_cost: number;
  /** Vapi cost in USD */
  voice_cost: number;
  total_cost: number;
}

export interface OrganizationUsage {
  organization_id: string;
  organization_name: string;
  sessions: number;
  voice_minutes: number;
  ai_cost: number;
  voice_cost: number;
  total_cost: number;
}

export interface SessionUsage {
  session_id: string;
  organization_id: string;
  organization_name: string;
  trainee_name: string | null;
  trainee_email: string | null;
  scenario_name: string | null;
  mode: "text" | "voice";
  status: string;
  started_at: string;
  ended_at: string | null;
  /** null while the session is still in progress */
  duration_seconds: number | null;
  voice_seconds: number;
  input_tokens: number;
  output_tokens: number;
  conversation_cost: number;
  evaluation_cost: number;
  voice_cost: number;
  total_cost: number;
}

export interface UsageReport {
  days: number;
  since: string;
  totals: UsageTotals;
  /** Platform admins only; empty for company admins */
  organizations: OrganizationUsage[];
  /** Latest sessions, newest first */
  sessions: SessionUsage[];
}

/** Usage and cost across all organisations (platform admins). */
export async function getPlatformUsage(
  days = 30,
): Promise<UsageReport> {
  return apiClient<UsageReport>(
    `/platform/usage?days=${days}`,
  );
}

/** Usage and cost of your organisation (company admins). */
export async function getOrganizationUsage(
  days = 30,
): Promise<UsageReport> {
  return apiClient<UsageReport>(
    `/organizations/me/usage?days=${days}`,
  );
}
