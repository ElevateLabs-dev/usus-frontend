"use client";

import { UsageReportView } from "@/components/usage/usage-report";
import { getPlatformUsage } from "@/services/usage-service";

export default function PlatformUsagePage() {
  return (
    <UsageReportView
      title="Usage & Cost"
      description="Training sessions across all organisations: how long they took and what they cost in AI (OpenAI) and voice (Vapi)."
      load={getPlatformUsage}
      showOrganizations
    />
  );
}
