import { apiClient } from "@/services/api-client";
import {
  getScenarios,
  type BackendScenario,
  type BackendScenarioDifficulty,
} from "@/services/scenario-service";

import type {
  LearningLevel,
  LearningLevelProgress,
  LearningPathData,
} from "@/types/learning-path";

/*
 * GET /scenarios/categories
 */
interface BackendCategory {
  id: string;
  name: string;
  description: string;
  scenario_count: number;
}

const LEVELS: {
  id: BackendScenarioDifficulty;
  name: LearningLevel;
  description: string;
}[] = [
  {
    id: "beginner",
    name: "Beginner",
    description:
      "Build the foundations of effective customer interactions.",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description:
      "Develop stronger problem-solving and communication skills.",
  },
  {
    id: "advanced",
    name: "Advanced",
    description:
      "Handle complex situations with confidence and consistency.",
  },
];

function isCompleted(
  scenario: BackendScenario,
) {
  return (
    scenario.progress.status ===
    "completed"
  );
}

function percentage(
  completed: number,
  total: number,
) {
  return total > 0
    ? Math.round((completed / total) * 100)
    : 0;
}

/**
 * Build the learning path from the
 * real scenarios (with the trainee's
 * own progress) and categories.
 */
export async function getLearningPath(): Promise<LearningPathData> {
  const [scenarios, categories] =
    await Promise.all([
      getScenarios(),
      apiClient<BackendCategory[]>(
        "/scenarios/categories",
      ),
    ]);

  const completedTotal =
    scenarios.filter(isCompleted).length;

  /*
   * The backend decides which levels are
   * locked (a level unlocks once every
   * scenario of the level before is passed).
   */

  const levels: LearningLevelProgress[] =
    LEVELS.map((level) => {
      const inLevel = scenarios.filter(
        (scenario) =>
          scenario.difficulty === level.id,
      );

      const completed =
        inLevel.filter(isCompleted).length;

      const done =
        inLevel.length > 0 &&
        completed === inLevel.length;

      const lockedScenario = inLevel.find(
        (scenario) => scenario.locked,
      );

      let status: LearningLevelProgress["status"];

      if (done) {
        status = "completed";
      } else if (lockedScenario) {
        status = "locked";
      } else {
        status = "current";
      }

      return {
        id: level.id,
        name: level.name,
        description: level.description,
        completed,
        total: inLevel.length,
        percentage: percentage(
          completed,
          inLevel.length,
        ),
        status,
        lockedReason:
          lockedScenario?.locked_reason ?? null,
      };
    });

  const currentLevel: LearningLevel =
    levels.find(
      (level) =>
        level.status === "current",
    )?.name ?? "Advanced";

  return {
    overall: {
      percentage: percentage(
        completedTotal,
        scenarios.length,
      ),
      completed: completedTotal,
      total: scenarios.length,
    },

    currentLevel,

    levels,

    categories: categories.map(
      (category) => {
        const inCategory =
          scenarios.filter(
            (scenario) =>
              scenario.category?.id ===
              category.id,
          );

        const completed =
          inCategory.filter(isCompleted)
            .length;

        return {
          id: category.id,
          name: category.name,
          description:
            category.description,
          completed,
          total: inCategory.length,
          percentage: percentage(
            completed,
            inCategory.length,
          ),
        };
      },
    ),
  };
}
