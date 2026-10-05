export interface SkillPerformance {
  name: string;
  score: number;
  trend?: number;
}

export interface TrainingItem {
  id: string;
  title: string;
  category: string;
  progress: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface RecentSession {
  id: string;
  scenario: string;
  category: string;
  score: number;
  date: string;
  status: "Completed" | "In Progress";
}

export interface RecommendedScenario {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
}

export interface DashboardData {
  user: {
    name: string;
    avatar?: string;
  };

  overall: {
    score: number;
    completion: number;
    scenariosCompleted: number;
    totalScenarios: number;
  };

  skills: SkillPerformance[];

  continueTraining: TrainingItem[];

  recentSessions: RecentSession[];

  recommendations: RecommendedScenario[];
}
