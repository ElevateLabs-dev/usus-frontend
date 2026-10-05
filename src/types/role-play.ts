export type MessageSender = "customer" | "trainee";

export type SimulationStatus =
  | "idle"
  | "sending"
  | "customer-responding"
  | "ready"
  | "error"
  | "session-ended";

export interface ConversationMessage {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
}

export interface RolePlayScenario {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";

  objective: string;

  customer: {
    name: string;
    personality: string;
    emotionalState: string;
    background: string;
  };

  durationMinutes: number;

  initialMessage: string;

  messages: ConversationMessage[];
};