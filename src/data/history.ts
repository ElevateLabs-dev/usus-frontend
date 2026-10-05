import type {
  HistoryResponse,
  HistorySession,
} from "@/types/history";

export const historySessions: HistorySession[] = [
  {
    sessionId: "session-001",
    scenarioId: "angry-customer-delivery",
    scenarioTitle: "Angry Customer — Delayed Delivery",
    category: "De-escalation",
    difficulty: "Intermediate",
    score: 78,
    status: "completed",

    startedAt: "2026-08-18T14:18:00Z",
    durationSeconds: 720,

    // Compatibility fields
    completedAt: "2026-08-18T14:30:00Z",
    duration: 12,

    skills: [
      {
        id: "skill-001",
        name: "Empathy",
        score: 82,
      },
      {
        id: "skill-002",
        name: "Communication",
        score: 76,
      },
      {
        id: "skill-003",
        name: "Problem Resolution",
        score: 75,
      },
    ],
  },

  {
    sessionId: "session-002",
    scenarioId: "refund-request",
    scenarioTitle: "Refund Request",
    category: "Problem Resolution",
    difficulty: "Beginner",
    score: 84,
    status: "completed",

    startedAt: "2026-08-17T11:06:00Z",
    durationSeconds: 540,

    completedAt: "2026-08-17T11:15:00Z",
    duration: 9,

    skills: [
      {
        id: "skill-004",
        name: "Accuracy",
        score: 88,
      },
      {
        id: "skill-005",
        name: "Empathy",
        score: 81,
      },
      {
        id: "skill-006",
        name: "Clarity",
        score: 84,
      },
    ],
  },

  {
    sessionId: "session-003",
    scenarioId: "product-complaint",
    scenarioTitle: "Product Complaint",
    category: "Communication",
    difficulty: "Intermediate",
    score: 71,
    status: "completed",

    startedAt: "2026-08-15T16:34:00Z",
    durationSeconds: 660,

    completedAt: "2026-08-15T16:45:00Z",
    duration: 11,

    skills: [
      {
        id: "skill-007",
        name: "Communication",
        score: 73,
      },
      {
        id: "skill-008",
        name: "Empathy",
        score: 69,
      },
      {
        id: "skill-009",
        name: "Clarity",
        score: 72,
      },
    ],
  },

  {
    sessionId: "session-004",
    scenarioId: "policy-disagreement",
    scenarioTitle: "Policy Disagreement",
    category: "Policy & Compliance",
    difficulty: "Advanced",
    score: 68,
    status: "completed",

    startedAt: "2026-08-13T10:05:00Z",
    durationSeconds: 900,

    completedAt: "2026-08-13T10:20:00Z",
    duration: 15,

    skills: [
      {
        id: "skill-010",
        name: "Policy Knowledge",
        score: 72,
      },
      {
        id: "skill-011",
        name: "Communication",
        score: 66,
      },
      {
        id: "skill-012",
        name: "Problem Resolution",
        score: 65,
      },
    ],
  },
];

export const historyData: HistoryResponse = {
  summary: {
    totalSessions: historySessions.length,

    completedSessions: historySessions.filter(
      (session) => session.status === "completed",
    ).length,

    averageScore:
      historySessions.length > 0
        ? Math.round(
            historySessions.reduce(
              (total, session) =>
                total + session.score,
              0,
            ) / historySessions.length,
          )
        : 0,

    bestScore:
      historySessions.length > 0
        ? Math.max(
            ...historySessions.map(
              (session) => session.score,
            ),
          )
        : 0,
  },

  sessions: historySessions,

  performanceTrend: [
    {
      date: "2026-08-01",
      score: 64,
    },
    {
      date: "2026-08-05",
      score: 69,
    },
    {
      date: "2026-08-10",
      score: 74,
    },
    {
      date: "2026-08-15",
      score: 71,
    },
    {
      date: "2026-08-18",
      score: 78,
    },
  ],
};