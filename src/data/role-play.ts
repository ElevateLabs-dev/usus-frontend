import type { RolePlayScenario } from "@/types/role-play";

export const rolePlayScenarios: Record<
  string,
  RolePlayScenario
> = {
  "angry-customer-delivery": {
    id: "angry-customer-delivery",

    title: "Handling an Angry Customer",

    category: "De-escalation",

    difficulty: "Intermediate",

    objective:
      "Acknowledge the customer's frustration, understand the problem, explain the situation clearly, and work toward an appropriate resolution.",

    customer: {
      name: "John Smith",
      personality: "Direct and impatient",
      emotionalState: "Frustrated",
      background:
        "John has been a customer for two years and normally has a positive experience with the company.",
    },

    durationMinutes: 8,

    initialMessage:
      "I've been waiting for my order for two days now. I've already contacted support twice and nobody seems to be able to tell me what's going on. This is really frustrating.",

    messages: [
      {
        id: "message-1",
        sender: "customer",
        content:
          "I've been waiting for my order for two days now. I've already contacted support twice and nobody seems to be able to tell me what's going on. This is really frustrating.",
        timestamp: "13:02",
      },
    ],
  },

  "refund-request": {
    id: "refund-request",

    title: "Refund Request",

    category: "Problem Resolution",

    difficulty: "Beginner",

    objective:
      "Understand the customer's request, verify the relevant policy, and provide a clear and appropriate resolution.",

    customer: {
      name: "Sarah Johnson",
      personality: "Calm but persistent",
      emotionalState: "Concerned",
      background:
        "Sarah recently purchased a product that did not meet her expectations.",
    },

    durationMinutes: 7,

    initialMessage:
      "Hi, I'd like to request a refund for the product I purchased. It hasn't worked the way I expected and I'd like to know what my options are.",

    messages: [
      {
        id: "message-1",
        sender: "customer",
        content:
          "Hi, I'd like to request a refund for the product I purchased. It hasn't worked the way I expected and I'd like to know what my options are.",
        timestamp: "13:02",
      },
    ],
  },

  "policy-disagreement": {
    id: "policy-disagreement",

    title: "Policy Disagreement",

    category: "Policy & Compliance",

    difficulty: "Advanced",

    objective:
      "Maintain professionalism, demonstrate empathy, explain the policy clearly, and identify an appropriate resolution without making unauthorised promises.",

    customer: {
      name: "Michael Brown",
      personality: "Assertive and demanding",
      emotionalState: "Angry",
      background:
        "Michael has contacted support because he believes the company's policy is unfair.",
    },

    durationMinutes: 10,

    initialMessage:
      "I don't understand why you're refusing my request. I've been a customer for years and this policy makes absolutely no sense. I expect someone to make an exception.",

    messages: [
      {
        id: "message-1",
        sender: "customer",
        content:
          "I don't understand why you're refusing my request. I've been a customer for years and this policy makes absolutely no sense. I expect someone to make an exception.",
        timestamp: "13:02",
      },
    ],
  },

  "product-complaint": {
    id: "product-complaint",

    title: "Product Complaint",

    category: "Communication",

    difficulty: "Beginner",

    objective:
      "Listen carefully to the customer's complaint, demonstrate empathy, clarify the issue, and work toward an appropriate resolution.",

    customer: {
      name: "David Wilson",
      personality: "Disappointed but cooperative",
      emotionalState: "Upset",
      background:
        "David recently purchased a product and expected it to perform better based on the information provided at the time of purchase.",
    },

    durationMinutes: 6,

    initialMessage:
      "I'm really disappointed with this product. It doesn't work the way I expected it to, and I feel like I was given the wrong impression when I bought it.",

    messages: [
      {
        id: "message-1",
        sender: "customer",
        content:
          "I'm really disappointed with this product. It doesn't work the way I expected it to, and I feel like I was given the wrong impression when I bought it.",
        timestamp: "13:02",
      },
    ],
  },

  "complex-refund": {
    id: "complex-refund",

    title: "Complex Refund Request",

    category: "Problem Resolution",

    difficulty: "Advanced",

    objective:
      "Understand the customer's circumstances, explain the relevant policy clearly, demonstrate empathy, and identify an appropriate escalation or resolution.",

    customer: {
      name: "Emily Davis",
      personality: "Persistent and demanding",
      emotionalState: "Frustrated",
      background:
        "Emily purchased a product outside the normal refund conditions and believes the company should make an exception.",
    },

    durationMinutes: 10,

    initialMessage:
      "I know what your refund policy says, but my situation is different. I've been a customer for years and I expect you to make an exception and give me my money back.",

    messages: [
      {
        id: "message-1",
        sender: "customer",
        content:
          "I know what your refund policy says, but my situation is different. I've been a customer for years and I expect you to make an exception and give me my money back.",
        timestamp: "13:02",
      },
    ],
  },

  "confused-customer": {
    id: "confused-customer",

    title: "Helping a Confused Customer",

    category: "Communication",

    difficulty: "Beginner",

    objective:
      "Identify what the customer does not understand, explain the process in simple steps, and confirm that the customer knows what to do next.",

    customer: {
      name: "Linda Taylor",
      personality: "Polite but confused",
      emotionalState: "Uncertain",
      background:
        "Linda has contacted support because she is having difficulty understanding the steps required to complete a process.",
    },

    durationMinutes: 5,

    initialMessage:
      "I'm sorry, I'm just really confused about what I'm supposed to do next. I've read the instructions several times but I still don't understand the process.",

    messages: [
      {
        id: "message-1",
        sender: "customer",
        content:
          "I'm sorry, I'm just really confused about what I'm supposed to do next. I've read the instructions several times but I still don't understand the process.",
        timestamp: "13:02",
      },
    ],
  },

  "escalated-complaint": {
    id: "escalated-complaint",

    title: "Escalated Customer Complaint",

    category: "De-escalation",

    difficulty: "Advanced",

    objective:
      "De-escalate the customer's emotions, demonstrate ownership, clarify the complaint, and identify an appropriate next step without making unauthorised promises.",

    customer: {
      name: "Robert Anderson",
      personality: "Highly emotional and demanding",
      emotionalState: "Angry",
      background:
        "Robert has already spoken with several support representatives and believes none of them have taken his complaint seriously.",
    },

    durationMinutes: 12,

    initialMessage:
      "I've already spoken to several people about this and nobody has actually helped me. I'm tired of repeating myself. I want someone to take responsibility and fix this now.",

    messages: [
      {
        id: "message-1",
        sender: "customer",
        content:
          "I've already spoken to several people about this and nobody has actually helped me. I'm tired of repeating myself. I want someone to take responsibility and fix this now.",
        timestamp: "13:02",
      },
    ],
  },
};