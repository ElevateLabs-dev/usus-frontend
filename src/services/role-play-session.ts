import type {
  ConversationMessage,
  SimulationStatus,
} from "@/types/role-play";

export interface PersistedRolePlaySession {
  sessionId: string;
  scenarioId: string;
  messages: ConversationMessage[];
  elapsedSeconds: number;
  status: SimulationStatus;
  startedAt: number;
  lastUpdatedAt: number;
}

const STORAGE_PREFIX =
  "usus:role-play-session:";

function getStorageKey(
  scenarioId: string,
) {
  return `${STORAGE_PREFIX}${scenarioId}`;
}

/*
 * ============================================================
 * CREATE SESSION
 * ============================================================
 */

export function createLocalRolePlaySession(
  scenarioId: string,
  initialMessages: ConversationMessage[],
): PersistedRolePlaySession {
  const now = Date.now();

  return {
    sessionId: `local-${scenarioId}-${now}`,
    scenarioId,
    messages: initialMessages,
    elapsedSeconds: 0,
    status: "ready",
    startedAt: now,
    lastUpdatedAt: now,
  };
}

/*
 * ============================================================
 * SAVE SESSION
 * ============================================================
 */

export function saveRolePlaySession(
  session: PersistedRolePlaySession,
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      getStorageKey(session.scenarioId),
      JSON.stringify({
        ...session,
        lastUpdatedAt: Date.now(),
      }),
    );
  } catch (error) {
    console.error(
      "Failed to save role-play session:",
      error,
    );
  }
}

/*
 * ============================================================
 * LOAD SESSION
 * ============================================================
 */

export function loadRolePlaySession(
  scenarioId: string,
): PersistedRolePlaySession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored =
      localStorage.getItem(
        getStorageKey(scenarioId),
      );

    if (!stored) {
      return null;
    }

    const session =
      JSON.parse(
        stored,
      ) as PersistedRolePlaySession;

    /*
     * Make sure the stored session actually
     * belongs to this scenario.
     */

    if (
      session.scenarioId !==
      scenarioId
    ) {
      return null;
    }

    return session;
  } catch (error) {
    console.error(
      "Failed to load role-play session:",
      error,
    );

    return null;
  }
}

/*
 * ============================================================
 * DELETE SESSION
 * ============================================================
 */

export function clearRolePlaySession(
  scenarioId: string,
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(
      getStorageKey(scenarioId),
    );
  } catch (error) {
    console.error(
      "Failed to clear role-play session:",
      error,
    );
  }
};