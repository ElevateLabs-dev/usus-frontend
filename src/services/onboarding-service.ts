import { apiClient } from "@/services/api-client";

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
  launched_at: string | null;
  dismissed: boolean;
}

export async function getOnboardingChecklist(): Promise<OnboardingChecklist> {
  return apiClient<OnboardingChecklist>("/onboarding/checklist");
}

export async function updateOnboardingChecklist(
  dismissed: boolean,
): Promise<OnboardingChecklist> {
  return apiClient<OnboardingChecklist>("/onboarding/checklist", {
    method: "PATCH",
    body: JSON.stringify({ dismissed }),
  });
}