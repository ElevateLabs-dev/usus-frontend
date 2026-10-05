import type {
  EvaluationData,
} from "@/types/evaluation";

/*
 * ============================================================
 * LOCAL DEVELOPMENT EVALUATION DATA
 * ============================================================
 *
 * These are temporary mock evaluation results.
 *
 * They exist only until the real evaluation API is connected.
 *
 * IMPORTANT:
 * sessionId is intentionally NOT stored here.
 *
 * The real session ID is generated when the trainee completes
 * the role-play and is injected by evaluation-service.ts.
 */

export type EvaluationTemplate = Omit<
  EvaluationData,
  "sessionId" | "scenarioId" | "completionTime"
>;

export const evaluationData: Record<
  string,
  EvaluationTemplate
> = {
  /*
   * ============================================================
   * ANGRY CUSTOMER DELIVERY
   * ============================================================
   */

  "angry-customer-delivery": {
    scenario: {
      id: "angry-customer-delivery",
      title: "Handling an Angry Customer",
      category: "De-escalation",
      difficulty: "Intermediate",
    },

    overallScore: 82,

    summary:
      "You handled the conversation well and successfully moved the customer toward a resolution. Your strongest performance was in empathy and maintaining a professional tone.",

    skills: [
      {
        id: "empathy",
        name: "Empathy",
        score: 88,
        description:
          "You acknowledged the customer's frustration and demonstrated understanding of their situation.",
      },
      {
        id: "clarity",
        name: "Clarity",
        score: 82,
        description:
          "Your responses were generally clear, concise, and easy for the customer to understand.",
      },
      {
        id: "deescalation",
        name: "De-escalation",
        score: 79,
        description:
          "You reduced tension effectively, although some responses could have been more proactive.",
      },
      {
        id: "problem-solving",
        name: "Problem solving",
        score: 81,
        description:
          "You identified the customer's main issue and worked toward an appropriate solution.",
      },
    ],

    strengths: [
      "You acknowledged the customer's frustration early in the conversation.",
      "You maintained a calm and professional tone throughout the interaction.",
      "You clearly explained the available solution and what the customer could expect next.",
    ],

    improvements: [
      "Ask more clarifying questions before proposing a solution.",
      "Take ownership of the problem earlier in the conversation.",
      "Use more proactive language when explaining the next steps to the customer.",
    ],

    insights: [
      {
        id: "insight-001",
        category: "Empathy",
        title: "Strong emotional acknowledgement",
        description:
          "You recognized the customer's frustration before moving into problem solving.",
        type: "positive",
      },
      {
        id: "insight-002",
        category: "Questioning",
        title: "More discovery was needed",
        description:
          "The conversation could have benefited from additional clarifying questions before suggesting a solution.",
        type: "improvement",
      },
      {
        id: "insight-003",
        category: "Resolution",
        title: "Clear resolution",
        description:
          "You ended the interaction with a clear explanation of what would happen next.",
        type: "positive",
      },
      {
        id: "insight-004",
        category: "Communication",
        title: "Professional tone maintained",
        description:
          "You remained respectful and composed even when the customer expressed frustration.",
        type: "positive",
      },
    ],

    recommendations: [
      "Practice asking clarifying questions before proposing solutions.",
      "Try another de-escalation scenario to strengthen your ability to handle difficult customers.",
      "Focus on taking ownership earlier in your next training session.",
    ],

    createdAt: "2026-08-18T10:00:00.000Z",
  },

  /*
   * ============================================================
   * REFUND REQUEST
   * ============================================================
   */

  "refund-request": {
    scenario: {
      id: "refund-request",
      title: "Refund Request",
      category: "Problem Resolution",
      difficulty: "Beginner",
    },

    overallScore: 84,

    summary:
      "You handled the refund request clearly and maintained a professional approach while working toward an appropriate resolution.",

    skills: [
      {
        id: "accuracy",
        name: "Accuracy",
        score: 86,
        description:
          "You demonstrated good attention to the customer's refund request and the relevant information.",
      },
      {
        id: "policy",
        name: "Policy",
        score: 82,
        description:
          "You showed awareness of the importance of following the refund policy.",
      },
      {
        id: "communication",
        name: "Communication",
        score: 85,
        description:
          "Your responses were clear and easy for the customer to understand.",
      },
      {
        id: "resolution",
        name: "Resolution",
        score: 83,
        description:
          "You worked toward an appropriate resolution for the customer's request.",
      },
    ],

    strengths: [
      "You maintained a professional and helpful tone.",
      "You addressed the customer's refund request directly.",
      "You communicated the next steps clearly.",
    ],

    improvements: [
      "Ask additional questions when information about the purchase is unclear.",
      "Explain relevant policy requirements more explicitly.",
      "Confirm the customer's expectations before finalising the resolution.",
    ],

    insights: [
      {
        id: "refund-insight-001",
        category: "Communication",
        title: "Clear communication",
        description:
          "You communicated with the customer in a clear and professional manner.",
        type: "positive",
      },
      {
        id: "refund-insight-002",
        category: "Policy",
        title: "Policy awareness",
        description:
          "The conversation demonstrated awareness that refund requests must be handled according to policy.",
        type: "positive",
      },
      {
        id: "refund-insight-003",
        category: "Questioning",
        title: "More verification could help",
        description:
          "Additional questions could help verify the customer's eligibility before confirming a resolution.",
        type: "improvement",
      },
    ],

    recommendations: [
      "Practise verifying customer information before confirming refund eligibility.",
      "Continue developing clear policy explanations.",
      "Try a more complex refund scenario next.",
    ],

    createdAt: "2026-08-17T10:00:00.000Z",
  },

  /*
   * ============================================================
   * POLICY DISAGREEMENT
   * ============================================================
   */

  "policy-disagreement": {
    scenario: {
      id: "policy-disagreement",
      title: "Policy Disagreement",
      category: "Policy & Compliance",
      difficulty: "Advanced",
    },

    overallScore: 76,

    summary:
      "You maintained professionalism while handling a difficult disagreement. The main opportunity is to strengthen de-escalation and communicate policy limitations with greater empathy.",

    skills: [
      {
        id: "policy",
        name: "Policy",
        score: 82,
        description:
          "You demonstrated awareness of the need to follow company policy.",
      },
      {
        id: "empathy",
        name: "Empathy",
        score: 74,
        description:
          "You showed some understanding of the customer's frustration but could acknowledge their concerns more explicitly.",
      },
      {
        id: "deescalation",
        name: "De-escalation",
        score: 72,
        description:
          "You remained professional but could use stronger techniques to reduce tension.",
      },
      {
        id: "resolution",
        name: "Resolution",
        score: 76,
        description:
          "You identified an appropriate direction for resolving or escalating the issue.",
      },
    ],

    strengths: [
      "You maintained professionalism during a difficult interaction.",
      "You respected the company's policy requirements.",
      "You avoided making unauthorised promises.",
    ],

    improvements: [
      "Acknowledge the customer's frustration before explaining the policy.",
      "Use more de-escalation language when the customer becomes demanding.",
      "Explain escalation options more clearly.",
    ],

    insights: [
      {
        id: "policy-insight-001",
        category: "Policy",
        title: "Policy boundaries maintained",
        description:
          "You avoided committing to an exception that may not be authorised.",
        type: "positive",
      },
      {
        id: "policy-insight-002",
        category: "Empathy",
        title: "More acknowledgement needed",
        description:
          "The customer would benefit from stronger acknowledgement of their frustration.",
        type: "improvement",
      },
      {
        id: "policy-insight-003",
        category: "Resolution",
        title: "Escalation opportunity",
        description:
          "Eligible cases can be directed toward the appropriate escalation process.",
        type: "neutral",
      },
    ],

    recommendations: [
      "Practise acknowledging emotion before explaining policy.",
      "Strengthen your de-escalation techniques.",
      "Practise explaining escalation options without promising an outcome.",
    ],

    createdAt: "2026-08-16T10:00:00.000Z",
  },

  /*
   * ============================================================
   * PRODUCT COMPLAINT
   * ============================================================
   */

  "product-complaint": {
    scenario: {
      id: "product-complaint",
      title: "Product Complaint",
      category: "Communication",
      difficulty: "Beginner",
    },

    overallScore: 79,

    summary:
      "You handled the product complaint professionally and demonstrated a good foundation in customer communication.",

    skills: [
      {
        id: "communication",
        name: "Communication",
        score: 82,
        description:
          "You communicated clearly and maintained a professional interaction.",
      },
      {
        id: "empathy",
        name: "Empathy",
        score: 78,
        description:
          "You showed awareness of the customer's dissatisfaction.",
      },
      {
        id: "resolution",
        name: "Resolution",
        score: 77,
        description:
          "You moved toward identifying an appropriate solution.",
      },
    ],

    strengths: [
      "You maintained a professional tone.",
      "You acknowledged the customer's complaint.",
      "You worked toward understanding the customer's concern.",
    ],

    improvements: [
      "Ask more questions about the product problem.",
      "Show stronger ownership of the customer's issue.",
      "End with a more specific next step.",
    ],

    insights: [
      {
        id: "product-insight-001",
        category: "Communication",
        title: "Professional interaction",
        description:
          "You maintained clear and professional communication.",
        type: "positive",
      },
      {
        id: "product-insight-002",
        category: "Resolution",
        title: "Resolution could be stronger",
        description:
          "The conversation would benefit from a clearer next step.",
        type: "improvement",
      },
    ],

    recommendations: [
      "Practise asking diagnostic questions about product complaints.",
      "Focus on taking ownership of customer problems.",
      "Clearly communicate the next step before ending the conversation.",
    ],

    createdAt: "2026-08-15T10:00:00.000Z",
  },

  /*
   * ============================================================
   * COMPLEX REFUND
   * ============================================================
   */

  "complex-refund": {
    scenario: {
      id: "complex-refund",
      title: "Complex Refund Request",
      category: "Problem Resolution",
      difficulty: "Advanced",
    },

    overallScore: 73,

    summary:
      "You demonstrated a good understanding of the customer's request, but the complexity of the refund situation requires stronger policy handling and clearer resolution steps.",

    skills: [
      {
        id: "policy",
        name: "Policy",
        score: 75,
        description:
          "You demonstrated awareness that policy requirements must be considered.",
      },
      {
        id: "resolution",
        name: "Resolution",
        score: 72,
        description:
          "You identified possible ways forward but could communicate the resolution more clearly.",
      },
      {
        id: "empathy",
        name: "Empathy",
        score: 74,
        description:
          "You recognised the customer's concern but could provide stronger emotional acknowledgement.",
      },
    ],

    strengths: [
      "You remained professional during a complex request.",
      "You considered policy requirements.",
      "You attempted to move the conversation toward a solution.",
    ],

    improvements: [
      "Verify all relevant information before confirming eligibility.",
      "Explain policy limitations more clearly.",
      "Use escalation appropriately when an exception may require approval.",
    ],

    insights: [
      {
        id: "complex-refund-insight-001",
        category: "Policy",
        title: "Policy verification is important",
        description:
          "Complex refund cases require careful verification before a final decision.",
        type: "neutral",
      },
      {
        id: "complex-refund-insight-002",
        category: "Resolution",
        title: "Clearer next steps needed",
        description:
          "The customer should leave the interaction knowing what will happen next.",
        type: "improvement",
      },
    ],

    recommendations: [
      "Practise handling refund exceptions without making unauthorised promises.",
      "Strengthen your policy explanation skills.",
      "Practise escalating complex cases appropriately.",
    ],

    createdAt: "2026-08-14T10:00:00.000Z",
  },

  /*
   * ============================================================
   * CONFUSED CUSTOMER
   * ============================================================
   */

  "confused-customer": {
    scenario: {
      id: "confused-customer",
      title: "Helping a Confused Customer",
      category: "Communication",
      difficulty: "Beginner",
    },

    overallScore: 81,

    summary:
      "You demonstrated a good ability to communicate with the customer and guide the conversation toward greater clarity.",

    skills: [
      {
        id: "clarity",
        name: "Clarity",
        score: 85,
        description:
          "You provided information in a generally understandable way.",
      },
      {
        id: "communication",
        name: "Communication",
        score: 83,
        description:
          "You maintained a clear and helpful communication style.",
      },
      {
        id: "empathy",
        name: "Empathy",
        score: 76,
        description:
          "You showed patience with the customer's confusion.",
      },
    ],

    strengths: [
      "You maintained patience while assisting the customer.",
      "You communicated the information clearly.",
      "You attempted to simplify the customer's situation.",
    ],

    improvements: [
      "Break complex instructions into smaller steps.",
      "Confirm that the customer understands before continuing.",
      "Avoid unnecessary technical language.",
    ],

    insights: [
      {
        id: "confused-insight-001",
        category: "Clarity",
        title: "Clear guidance",
        description:
          "You made an effort to make the customer's situation easier to understand.",
        type: "positive",
      },
      {
        id: "confused-insight-002",
        category: "Communication",
        title: "Confirm understanding",
        description:
          "Asking the customer to confirm their understanding can improve the interaction.",
        type: "improvement",
      },
    ],

    recommendations: [
      "Practise explaining complex processes in simple steps.",
      "Use confirmation questions to check understanding.",
      "Continue developing concise customer-facing communication.",
    ],

    createdAt: "2026-08-13T10:00:00.000Z",
  },

  /*
   * ============================================================
   * ESCALATED COMPLAINT
   * ============================================================
   */

  "escalated-complaint": {
    scenario: {
      id: "escalated-complaint",
      title: "Escalated Customer Complaint",
      category: "De-escalation",
      difficulty: "Advanced",
    },

    overallScore: 70,

    summary:
      "This scenario required strong emotional management and careful de-escalation. You demonstrated a foundation in professional communication but have room to strengthen your response to highly emotional customers.",

    skills: [
      {
        id: "deescalation",
        name: "De-escalation",
        score: 68,
        description:
          "You maintained professionalism but could use stronger techniques to reduce emotional tension.",
      },
      {
        id: "empathy",
        name: "Empathy",
        score: 72,
        description:
          "You demonstrated some understanding of the customer's frustration.",
      },
      {
        id: "resolution",
        name: "Resolution",
        score: 69,
        description:
          "You identified the need for a suitable resolution but could communicate the next step more clearly.",
      },
    ],

    strengths: [
      "You remained professional during an emotionally difficult conversation.",
      "You acknowledged the customer's concerns.",
      "You avoided responding defensively.",
    ],

    improvements: [
      "Use stronger de-escalation language when emotions increase.",
      "Acknowledge the customer's frustration before explaining limitations.",
      "Provide a clear escalation or resolution path.",
    ],

    insights: [
      {
        id: "escalated-insight-001",
        category: "De-escalation",
        title: "Professional under pressure",
        description:
          "You maintained professionalism during a challenging customer interaction.",
        type: "positive",
      },
      {
        id: "escalated-insight-002",
        category: "Empathy",
        title: "Increase emotional acknowledgement",
        description:
          "More explicit acknowledgement of the customer's frustration could help reduce tension.",
        type: "improvement",
      },
      {
        id: "escalated-insight-003",
        category: "Resolution",
        title: "Clarify the resolution path",
        description:
          "Clearly explain what will happen next so the customer understands the available path forward.",
        type: "improvement",
      },
    ],

    recommendations: [
      "Practise advanced de-escalation techniques.",
      "Work on acknowledging emotion before presenting solutions.",
      "Practise handling escalated complaints while maintaining professional boundaries.",
    ],

    createdAt: "2026-08-12T10:00:00.000Z",
  },
};