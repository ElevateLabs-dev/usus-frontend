import { apiClient } from "@/services/api-client";

/*
 * ============================================================
 * ONBOARDING CHECKLIST TYPES
 * ============================================================
 */

export interface OnboardingStep {
  key: string;
  title: string;
  description: string;
  done: boolean;
}

export interface OnboardingChecklist {
  steps: OnboardingStep[];
  completed: number;
  total: number;
}

/*
 * ============================================================
 * API REQUESTS
 * ============================================================
 */

/**
 * Retrieves the signed-in organisation's setup checklist.
 *
 * GET /api/v1/onboarding/checklist
 *
 * Company admin / manager only.
 *
 * The backend automatically determines completed steps.
 */
export async function getOnboardingChecklist(): Promise<OnboardingChecklist> {
  return apiClient<OnboardingChecklist>("/onboarding/checklist");
}