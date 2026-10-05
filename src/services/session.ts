import type { ConversationMessage } from "@/types/role-play";

export interface CreateSessionInput {
  scenarioId: string;
  messages: ConversationMessage[];
  elapsedSeconds: number;
}

export interface SessionRecord {
  sessionId: string;
  scenarioId: string;
  messages: ConversationMessage[];
  elapsedSeconds: number;
  startedAt: string;
  completedAt: string;
  status: "completed";
}

const STORAGE_KEY = "usus_sessions";

/*
 * ============================================================
 * SESSION STORAGE
 * ============================================================
 *
 * Temporary frontend storage.
 *
 * Later this service can be replaced with:
 *
 * POST /api/sessions
 *
 * without changing the Role-Play UI.
 */

function getStoredSessions(): SessionRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(
      STORAGE_KEY
    );

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as SessionRecord[];
  } catch {
    return [];
  }
}

function saveSessions(
  sessions: SessionRecord[]
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(sessions)
  );
}

/*
 * ============================================================
 * CREATE SESSION
 * ============================================================
 */

export async function createSession(
  input: CreateSessionInput
): Promise<SessionRecord> {
  /*
   * Temporary mock network delay.
   *
   * Remove this when the real API is connected.
   */

  await new Promise((resolve) => {
    window.setTimeout(resolve, 500);
  });

  const now = new Date();

  const session: SessionRecord = {
    sessionId: `session-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    scenarioId: input.scenarioId,

    messages: input.messages,

    elapsedSeconds: input.elapsedSeconds,

    startedAt: new Date(
      now.getTime() -
        input.elapsedSeconds * 1000
    ).toISOString(),

    completedAt: now.toISOString(),

    status: "completed",
  };

  const sessions = getStoredSessions();

  sessions.push(session);

  saveSessions(sessions);

  return session;
}

/*
 * ============================================================
 * GET SESSION
 * ============================================================
 */

export async function getSession(
  sessionId: string
): Promise<SessionRecord | null> {
  const sessions = getStoredSessions();

  return (
    sessions.find(
      (session) =>
        session.sessionId === sessionId
    ) ?? null
  );
}

/*
 * ============================================================
 * GET ALL SESSIONS
 * ============================================================
 */

export async function getSessions(): Promise<
  SessionRecord[]
> {
  return getStoredSessions();
}