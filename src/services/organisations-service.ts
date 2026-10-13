import { apiClient } from "@/services/api-client";

import type { OrgUser } from "@/services/users-service";

/*
 * ============================================================
 * BACKEND SHAPES (platform admins only)
 * ============================================================
 */

export interface Organisation {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  users_count: number;
  trainees_count: number;
  /** Active (not archived) scenarios */
  scenarios_count: number;
  /** Evaluated training sessions */
  sessions_completed: number;
}

export interface OrganisationDetail
  extends Organisation {
  /** Company admins and managers */
  staff: OrgUser[];
}

/*
 * ============================================================
 * REQUESTS
 * ============================================================
 */

/**
 * List every organisation with its
 * usage counts.
 */
export async function getOrganisations(): Promise<
  Organisation[]
> {
  return apiClient<Organisation[]>(
    "/organizations/",
  );
}

/**
 * Get one organisation with its company
 * admins and managers.
 */
export async function getOrganisation(
  organisationId: string,
): Promise<OrganisationDetail> {
  return apiClient<OrganisationDetail>(
    `/organizations/${organisationId}`,
  );
}

/**
 * Onboard an organisation.
 *
 * One call creates the organisation, its
 * starter scenarios and its first company
 * admin, who is emailed an invitation with
 * a temporary password.
 */
export async function createOrganisation(input: {
  name: string;
  adminEmail: string;
  adminFullName?: string;
}): Promise<OrganisationDetail> {
  return apiClient<OrganisationDetail>(
    "/organizations/",
    {
      method: "POST",
      body: JSON.stringify({
        name: input.name,
        admin_email: input.adminEmail,
        admin_full_name:
          input.adminFullName || null,
      }),
    },
  );
}

/**
 * Activate or deactivate an organisation.
 *
 * Deactivating immediately stops its users
 * from signing in. Nothing is deleted.
 */
export async function setOrganisationActive(
  organisationId: string,
  isActive: boolean,
): Promise<OrganisationDetail> {
  return apiClient<OrganisationDetail>(
    `/organizations/${organisationId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        is_active: isActive,
      }),
    },
  );
}
