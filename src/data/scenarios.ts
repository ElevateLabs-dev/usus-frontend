import type { Scenario } from "@/types/scenario";

export const scenarios: Scenario[] = [
  {
    id: "angry-customer-delivery",
    title: "Handling an Angry Customer",
    description:
      "Practice managing an upset customer whose delivery has been delayed.",
    category: {
      id: "de-escalation",
      name: "De-escalation",
    },
    difficulty: "Intermediate",
    skills: [
      "Empathy",
      "De-escalation",
      "Resolution",
    ],
    durationMinutes: 8,
    status: "in-progress",
    progress: 72,
    previousScore: 78,
    recommended: true,
    createdAt: "2026-08-18",
  },

  {
    id: "refund-request",
    title: "Refund Request",
    description:
      "Help a customer resolve a refund issue while following company policy.",
    category: {
      id: "problem-resolution",
      name: "Problem Resolution",
    },
    difficulty: "Beginner",
    skills: [
      "Accuracy",
      "Policy",
      "Resolution",
    ],
    durationMinutes: 7,
    status: "completed",
    progress: 100,
    previousScore: 84,
    recommended: false,
    createdAt: "2026-08-17",
  },

  {
    id: "policy-disagreement",
    title: "Policy Disagreement",
    description:
      "Handle a customer who strongly disagrees with an important company policy.",
    category: {
      id: "policy-compliance",
      name: "Policy & Compliance",
    },
    difficulty: "Advanced",
    skills: [
      "Policy",
      "Empathy",
      "De-escalation",
    ],
    durationMinutes: 10,
    status: "new",
    progress: 0,
    recommended: true,
    createdAt: "2026-08-16",
  },

  {
    id: "product-complaint",
    title: "Product Complaint",
    description:
      "Respond professionally to a customer who is unhappy with a product.",
    category: {
      id: "communication",
      name: "Communication",
    },
    difficulty: "Beginner",
    skills: [
      "Communication",
      "Empathy",
    ],
    durationMinutes: 6,
    status: "completed",
    progress: 100,
    previousScore: 71,
    recommended: false,
    createdAt: "2026-08-15",
  },

  {
    id: "complex-refund",
    title: "Complex Refund Request",
    description:
      "Handle a customer asking for an exception to company refund policy.",
    category: {
      id: "problem-resolution",
      name: "Problem Resolution",
    },
    difficulty: "Advanced",
    skills: [
      "Policy",
      "Resolution",
      "Empathy",
    ],
    durationMinutes: 10,
    status: "new",
    progress: 0,
    recommended: true,
    createdAt: "2026-08-14",
  },

  {
    id: "confused-customer",
    title: "Helping a Confused Customer",
    description:
      "Guide a customer through a complicated process using clear communication.",
    category: {
      id: "communication",
      name: "Communication",
    },
    difficulty: "Beginner",
    skills: [
      "Clarity",
      "Communication",
    ],
    durationMinutes: 5,
    status: "new",
    progress: 0,
    recommended: false,
    createdAt: "2026-08-13",
  },

  {
    id: "escalated-complaint",
    title: "Escalated Customer Complaint",
    description:
      "Manage an emotionally charged complaint that requires careful de-escalation.",
    category: {
      id: "de-escalation",
      name: "De-escalation",
    },
    difficulty: "Advanced",
    skills: [
      "De-escalation",
      "Empathy",
      "Resolution",
    ],
    durationMinutes: 12,
    status: "locked",
    progress: 0,
    recommended: false,
    createdAt: "2026-08-12",
  },
];