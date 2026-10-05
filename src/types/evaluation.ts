export type EvaluationSkill = {
  id: string;
  name: string;
  score: number;
  description?: string;
};

export type EvaluationInsight = {
  id: string;
  category: string;
  title: string;
  description: string;
  type: "positive" | "improvement" | "neutral";
};

export type EvaluationScenario = {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
};

export type EvaluationData = {
  /*
   * Identifies the completed training session.
   *
   * This is generated dynamically and should come
   * from the session/API rather than being hardcoded.
   */
  sessionId: string;

  /*
   * Identifies the scenario that was completed.
   */
  scenarioId: string;

  /*
   * Scenario information displayed on W6.
   */
  scenario: EvaluationScenario;

  /*
   * Overall performance score.
   */
  overallScore: number;

  /*
   * Completion time in seconds.
   */
  completionTime: number;

  /*
   * Overall evaluation summary.
   */
  summary: string;

  /*
   * Individual skill performance.
   */
  skills: EvaluationSkill[];

  /*
   * What the trainee did well.
   */
  strengths: string[];

  /*
   * What the trainee should improve.
   */
  improvements: string[];

  /*
   * Important observations from the conversation.
   */
  insights: EvaluationInsight[];

  /*
   * Recommended next actions.
   */
  recommendations: string[];

  /*
   * Time the evaluation was created.
   */
  createdAt?: string;
};