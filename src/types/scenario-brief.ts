export interface ScenarioBrief {
  id: string;

  title: string;
  description: string;

  category: {
    id: string;
    name: string;
  };

  difficulty: "Beginner" | "Intermediate" | "Advanced";

  durationMinutes: number;

  customer: {
    name: string;
    personality: string;
    emotionalState: string;
    background: string;
  };

  situation: {
    summary: string;
    background?: string;
    /** What the customer wants. */
    customerGoal?: string;
  };

  objective: string;

  skills: string[];

  importantInformation: {
    label: string;
    content: string;
  }[];

  attempts: number;

  canStart: boolean;
};