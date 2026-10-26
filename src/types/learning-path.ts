export type LearningLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export interface LearningLevelProgress {
  id: string;
  name: LearningLevel;
  description: string;
  completed: number;
  total: number;
  percentage: number;
  status: "locked" | "current" | "completed";
  /** What to do to unlock a locked level. */
  lockedReason: string | null;
}

export interface TrainingCategory {
  id: string;
  name: string;
  description: string;
  completed: number;
  total: number;
  percentage: number;
}

export interface LearningPathData {
  overall: {
    percentage: number;
    completed: number;
    total: number;
  };

  currentLevel: LearningLevel;

  levels: LearningLevelProgress[];

  categories: TrainingCategory[];
}