export const dashboardData = {
  user: {
    name: "John",
  },

  overall: {
    score: 78,
    completion: 64,
    scenariosCompleted: 18,
    totalScenarios: 28,
  },

  skills: [
    {
      name: "Accuracy",
      score: 85,
    },
    {
      name: "Empathy",
      score: 68,
    },
    {
      name: "Clarity",
      score: 82,
    },
  ],

  continueTraining: [
    {
      id: "angry-customer-delivery",
      title: "Handling an Angry Customer",
      category: "De-escalation",
      level: "Intermediate",
      progress: 72,
    },
    {
      id: "refund-request",
      title: "Refund Request",
      category: "Problem Resolution",
      level: "Beginner",
      progress: 45,
    },
    {
      id: "policy-disagreement",
      title: "Policy Disagreement",
      category: "Policy & Compliance",
      level: "Advanced",
      progress: 28,
    },
  ],

  recentSessions: [
    {
      id: "session-001",
      scenarioId: "angry-customer-delivery",
      title: "Angry Customer — Delayed Delivery",
      category: "De-escalation",
      date: "Aug 18",
      score: 78,
    },
    {
      id: "session-002",
      scenarioId: "refund-request",
      title: "Refund Request",
      category: "Problem Resolution",
      date: "Aug 17",
      score: 84,
    },
    {
      id: "session-003",
      scenarioId: "product-complaint",
      title: "Product Complaint",
      category: "Communication",
      date: "Aug 15",
      score: 71,
    },
  ],

  recommendations: [
    {
      id: "angry-customer-delivery",
      title: "Dealing With an Upset Customer",
      category: "De-escalation",
      duration: "8 min",
      description:
        "Practice acknowledging frustration before moving toward a solution.",
      level: "Intermediate",
    },
    {
      id: "complex-refund",
      title: "Complex Refund Request",
      category: "Problem Resolution",
      duration: "10 min",
      description:
        "Handle a customer asking for an exception to company policy.",
      level: "Advanced",
    },
  ],
};