export const difficulties = ["beginner", "intermediate", "advanced"] as const;

export type Difficulty = (typeof difficulties)[number];
export type LessonStatus = "todo" | "doing" | "done";

export type RoadmapItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly difficulty: Difficulty;
  readonly minutes: number;
  readonly status: LessonStatus;
  readonly topics: readonly string[];
};

export type RoadmapSummary = {
  readonly completedItems: number;
  readonly completionPercent: number;
  readonly totalItems: number;
  readonly totalMinutes: number;
};

export const roadmapItems: readonly RoadmapItem[] = [
  {
    id: "hello-world",
    title: "Hello World",
    description: "Run a TypeScript file and learn where annotations help.",
    difficulty: "beginner",
    minutes: 10,
    status: "done",
    topics: ["setup", "inference", "annotations"],
  },
  {
    id: "types-and-values",
    title: "Types And Values",
    description: "Model primitives, literal values, arrays, tuples, and readonly data.",
    difficulty: "beginner",
    minutes: 20,
    status: "done",
    topics: ["primitives", "literals", "arrays", "tuples"],
  },
  {
    id: "unions-and-narrowing",
    title: "Unions And Narrowing",
    description: "Represent multiple states and let control flow narrow each branch.",
    difficulty: "intermediate",
    minutes: 30,
    status: "doing",
    topics: ["unions", "narrowing", "exhaustive checks"],
  },
  {
    id: "api-and-frontend",
    title: "API And Frontend",
    description: "Share types between a Node API and a browser UI.",
    difficulty: "advanced",
    minutes: 45,
    status: "todo",
    topics: ["node", "api", "fetch", "vite"],
  },
];

export function isDifficulty(value: string): value is Difficulty {
  return (difficulties as readonly string[]).includes(value);
}

export function filterByDifficulty(
  difficulty: Difficulty,
  items: readonly RoadmapItem[] = roadmapItems,
): RoadmapItem[] {
  return items.filter((item) => item.difficulty === difficulty);
}

export function findRoadmapItem(id: string, items: readonly RoadmapItem[] = roadmapItems): RoadmapItem | undefined {
  return items.find((item) => item.id === id);
}

export function getRoadmapSummary(items: readonly RoadmapItem[] = roadmapItems): RoadmapSummary {
  const totalItems = items.length;
  const completedItems = items.filter((item) => item.status === "done").length;
  const totalMinutes = items.reduce((sum, item) => sum + item.minutes, 0);

  return {
    completedItems,
    completionPercent: totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100),
    totalItems,
    totalMinutes,
  };
}

