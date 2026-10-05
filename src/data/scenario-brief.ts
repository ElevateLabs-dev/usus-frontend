import type { ScenarioBrief } from "@/types/scenario-brief";

export const scenarioBriefs: Record<string, ScenarioBrief> = {
  "angry-customer-delivery": {
    id: "angry-customer-delivery",

    title: "Handling an Angry Customer",

    description:
      "Practice managing an upset customer whose delivery has been delayed.",

    category: {
      id: "de-escalation",
      name: "De-escalation",
    },

    difficulty: "Intermediate",

    durationMinutes: 8,

    customer: {
      name: "John Smith",
      personality: "Direct and impatient",
      emotionalState: "Frustrated",
      background:
        "John has been a customer for two years and normally has a positive experience with the company.",
    },

    situation: {
      summary:
        "John's order was expected two days ago but has still not arrived. He has already contacted customer support twice without receiving a satisfactory explanation.",

      background:
        "The delivery has been delayed because of an unexpected logistics issue.",
    },

    objective:
      "Acknowledge the customer's frustration, understand the problem, explain the situation clearly, and work toward an appropriate resolution.",

    skills: [
      "Empathy",
      "De-escalation",
      "Communication",
      "Resolution",
    ],

    importantInformation: [
      {
        label: "Company policy",
        content:
          "Customers affected by qualifying delivery delays may be eligible for compensation.",
      },
      {
        label: "Known fact",
        content:
          "The customer's order has been delayed and the latest delivery estimate is tomorrow.",
      },
      {
        label: "Important",
        content:
          "Do not promise compensation before confirming that the customer qualifies.",
      },
    ],

    attempts: 2,

    canStart: true,
  },

  "refund-request": {
    id: "refund-request",

    title: "Refund Request",

    description:
      "Help a customer resolve a refund issue while following company policy.",

    category: {
      id: "problem-resolution",
      name: "Problem Resolution",
    },

    difficulty: "Beginner",

    durationMinutes: 7,

    customer: {
      name: "Sarah Johnson",
      personality: "Calm but persistent",
      emotionalState: "Concerned",
      background:
        "Sarah recently purchased a product that did not meet her expectations.",
    },

    situation: {
      summary:
        "Sarah wants a refund and believes she is entitled to one under the company's refund policy.",

      background:
        "The customer wants a clear explanation of her refund options.",
    },

    objective:
      "Understand the customer's request, verify the relevant policy, and provide a clear and appropriate resolution.",

    skills: [
      "Accuracy",
      "Policy",
      "Communication",
      "Resolution",
    ],

    importantInformation: [
      {
        label: "Refund policy",
        content:
          "Refund eligibility depends on the condition of the product and the purchase date.",
      },
      {
        label: "Known fact",
        content:
          "The purchase was made within the standard refund period.",
      },
    ],

    attempts: 1,

    canStart: true,
  },

  "policy-disagreement": {
    id: "policy-disagreement",

    title: "Policy Disagreement",

    description:
      "Handle a customer who strongly disagrees with an important company policy.",

    category: {
      id: "policy-compliance",
      name: "Policy & Compliance",
    },

    difficulty: "Advanced",

    durationMinutes: 10,

    customer: {
      name: "Michael Brown",
      personality: "Assertive and demanding",
      emotionalState: "Angry",
      background:
        "Michael has contacted support because he believes the company's policy is unfair.",
    },

    situation: {
      summary:
        "The customer wants an exception to a company policy and is becoming increasingly frustrated after being told the policy cannot normally be changed.",

      background:
        "The customer expects the support agent to find an acceptable solution without violating company policy.",
    },

    objective:
      "Maintain professionalism, demonstrate empathy, explain the policy clearly, and identify an appropriate resolution without making unauthorised promises.",

    skills: [
      "Policy",
      "Empathy",
      "De-escalation",
      "Resolution",
    ],

    importantInformation: [
      {
        label: "Company policy",
        content:
          "The policy cannot normally be overridden by frontline support staff.",
      },
      {
        label: "Escalation",
        content:
          "Eligible cases may be referred to a supervisor for review.",
      },
    ],

    attempts: 0,

    canStart: true,
  },

  "product-complaint": {
    id: "product-complaint",

    title: "Product Complaint",

    description:
      "Respond professionally to a customer who is unhappy with a product.",

    category: {
      id: "communication",
      name: "Communication",
    },

    difficulty: "Beginner",

    durationMinutes: 6,

    customer: {
      name: "David Wilson",
      personality: "Disappointed but cooperative",
      emotionalState: "Upset",
      background:
        "David recently purchased a product and expected it to perform better based on the information provided at the time of purchase.",
    },

    situation: {
      summary:
        "David is unhappy with a product and has contacted support because the product did not meet his expectations.",

      background:
        "The customer wants to understand what options are available and expects the support agent to take his complaint seriously.",
    },

    objective:
      "Listen carefully to the customer's complaint, demonstrate empathy, clarify the issue, and work toward an appropriate resolution.",

    skills: [
      "Communication",
      "Empathy",
      "Problem Solving",
      "Resolution",
    ],

    importantInformation: [
      {
        label: "Customer concern",
        content:
          "The customer feels that the product did not meet the expectations created before purchase.",
      },
      {
        label: "Important",
        content:
          "Do not dismiss the customer's experience or make assumptions about the problem.",
      },
    ],

    attempts: 0,

    canStart: true,
  },

  "complex-refund": {
    id: "complex-refund",

    title: "Complex Refund Request",

    description:
      "Handle a customer asking for an exception to company refund policy.",

    category: {
      id: "problem-resolution",
      name: "Problem Resolution",
    },

    difficulty: "Advanced",

    durationMinutes: 10,

    customer: {
      name: "Emily Davis",
      personality: "Persistent and demanding",
      emotionalState: "Frustrated",
      background:
        "Emily purchased a product outside the normal refund conditions and believes the company should make an exception.",
    },

    situation: {
      summary:
        "Emily is requesting a refund that may fall outside the normal refund policy and wants the support agent to make an exception.",

      background:
        "The customer believes her circumstances justify an exception and becomes increasingly frustrated when the standard policy is explained.",
    },

    objective:
      "Understand the customer's circumstances, explain the relevant policy clearly, demonstrate empathy, and identify an appropriate escalation or resolution.",

    skills: [
      "Policy",
      "Empathy",
      "Communication",
      "Resolution",
    ],

    importantInformation: [
      {
        label: "Policy",
        content:
          "The standard refund policy may not cover the customer's situation.",
      },
      {
        label: "Important",
        content:
          "Do not promise an exception before confirming that one is authorised.",
      },
      {
        label: "Escalation",
        content:
          "If appropriate, the case may be referred for further review.",
      },
    ],

    attempts: 0,

    canStart: true,
  },

  "confused-customer": {
    id: "confused-customer",

    title: "Helping a Confused Customer",

    description:
      "Guide a customer through a complicated process using clear communication.",

    category: {
      id: "communication",
      name: "Communication",
    },

    difficulty: "Beginner",

    durationMinutes: 5,

    customer: {
      name: "Linda Taylor",
      personality: "Polite but confused",
      emotionalState: "Uncertain",
      background:
        "Linda has contacted support because she is having difficulty understanding the steps required to complete a process.",
    },

    situation: {
      summary:
        "Linda does not understand the process she needs to follow and needs the support agent to explain it clearly.",

      background:
        "The customer has attempted to complete the process before but became confused by the instructions.",
    },

    objective:
      "Identify what the customer does not understand, explain the process in simple steps, and confirm that the customer knows what to do next.",

    skills: [
      "Clarity",
      "Communication",
      "Patience",
      "Empathy",
    ],

    importantInformation: [
      {
        label: "Communication",
        content:
          "Use simple language and avoid unnecessary technical terminology.",
      },
      {
        label: "Important",
        content:
          "Check the customer's understanding before ending the interaction.",
      },
    ],

    attempts: 0,

    canStart: true,
  },

  "escalated-complaint": {
    id: "escalated-complaint",

    title: "Escalated Customer Complaint",

    description:
      "Manage an emotionally charged complaint that requires careful de-escalation.",

    category: {
      id: "de-escalation",
      name: "De-escalation",
    },

    difficulty: "Advanced",

    durationMinutes: 12,

    customer: {
      name: "Robert Anderson",
      personality: "Highly emotional and demanding",
      emotionalState: "Angry",
      background:
        "Robert has already spoken with several support representatives and believes none of them have taken his complaint seriously.",
    },

    situation: {
      summary:
        "Robert has escalated his complaint after several unsuccessful interactions and is demanding immediate action.",

      background:
        "The customer is highly frustrated and expects the support agent to take ownership of the issue.",
    },

    objective:
      "De-escalate the customer's emotions, demonstrate ownership, clarify the complaint, and identify an appropriate next step without making unauthorised promises.",

    skills: [
      "De-escalation",
      "Empathy",
      "Communication",
      "Resolution",
    ],

    importantInformation: [
      {
        label: "Customer history",
        content:
          "The customer has already contacted support multiple times.",
      },
      {
        label: "Important",
        content:
          "Remain professional even if the customer becomes confrontational.",
      },
      {
        label: "Escalation",
        content:
          "The case may require escalation if it cannot be resolved at frontline support level.",
      },
    ],

    attempts: 0,

    canStart: true,
  },
};