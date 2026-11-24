"use client";

import { UsageReportView } from "@/components/usage/usage-report";
import { getOrganizationUsage } from "@/services/usage-service";

export default function CompanyUsagePage() {
  return (
    <UsageReportView
      title="Usage & Cost"
      description="Your organisation's training sessions: how long they took and what they cost in AI and voice."
      load={getOrganizationUsage}
    />
  );
}
