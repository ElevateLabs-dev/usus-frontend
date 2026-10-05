import type { LearningPathData } from "@/types/learning-path";

export const learningPathData: LearningPathData = {
  overall: {
    percentage: 64,
    completed: 18,
    total: 28,
  },

  currentLevel: "Intermediate",

  levels: [
    {
      id: "beginner",
      name: "Beginner",
      description:
        "Build the foundations of effective customer interactions.",
      completed: 8,
      total: 10,
      percentage: 80,
      status: "completed",
    },
    {
      id: "intermediate",
      name: "Intermediate",
      description:
        "Develop stronger problem-solving and communication skills.",
      completed: 6,
      total: 10,
      percentage: 60,
      status: "current",
    },
    {
      id: "advanced",
      name: "Advanced",
      description:
        "Handle complex situations with confidence and consistency.",
      completed: 4,
      total: 8,
      percentage: 50,
      status: "locked",
    },
  ],

  categories: [
    {
      id: "communication",
      name: "Communication",
      description:
        "Improve clarity, listening, questioning, and response quality.",
      completed: 5,
      total: 7,
      percentage: 71,
    },
    {
      id: "de-escalation",
      name: "De-escalation",
      description:
        "Learn how to manage difficult and emotionally charged interactions.",
      completed: 4,
      total: 6,
      percentage: 67,
    },
    {
      id: "problem-resolution",
      name: "Problem Resolution",
      description:
        "Develop structured approaches to resolving customer problems.",
      completed: 4,
      total: 6,
      percentage: 67,
    },
    {
      id: "policy-compliance",
      name: "Policy & Compliance",
      description:
        "Apply company policies while maintaining a positive customer experience.",
      completed: 3,
      total: 5,
      percentage: 60,
    },
    {
      id: "customer-empathy",
      name: "Customer Empathy",
      description:
        "Recognise customer needs and respond with appropriate empathy.",
      completed: 2,
      total: 4,
      percentage: 50,
    },
  ],
};