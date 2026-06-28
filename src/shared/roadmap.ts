export const difficulties = ["beginner", "intermediate", "advanced"] as const;

export type Difficulty = (typeof difficulties)[number];
export type LessonStatus = "todo" | "doing" | "done";

export type RoadmapItem = {
  readonly command: string;
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly difficulty: Difficulty;
  readonly folder: string;
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
    command: "pnpm lesson:01",
    folder: "lessons/01-hello-world",
    id: "hello-world",
    title: "Hello World",
    description: "Run a TypeScript file and learn where annotations help.",
    difficulty: "beginner",
    minutes: 10,
    status: "done",
    topics: ["setup", "inference", "annotations"],
  },
  {
    command: "pnpm lesson:02",
    folder: "lessons/02-types-and-values",
    id: "types-and-values",
    title: "Types And Values",
    description: "Model primitives, literal values, arrays, tuples, and readonly data.",
    difficulty: "beginner",
    minutes: 20,
    status: "done",
    topics: ["primitives", "literals", "arrays", "tuples"],
  },
  {
    command: "pnpm lesson:03",
    folder: "lessons/03-functions-and-objects",
    id: "functions-and-objects",
    title: "Functions And Objects",
    description: "Describe data moving through functions and return new objects safely.",
    difficulty: "beginner",
    minutes: 25,
    status: "done",
    topics: ["functions", "objects", "readonly", "optional fields"],
  },
  {
    command: "pnpm lesson:04",
    folder: "lessons/04-unions-and-narrowing",
    id: "unions-and-narrowing",
    title: "Unions And Narrowing",
    description: "Represent multiple states and let control flow narrow each branch.",
    difficulty: "intermediate",
    minutes: 30,
    status: "doing",
    topics: ["unions", "narrowing", "exhaustive checks"],
  },
  {
    command: "pnpm lesson:05",
    folder: "lessons/05-generics-and-utilities",
    id: "generics-and-utilities",
    title: "Generics And Utilities",
    description: "Write reusable helpers without losing type information.",
    difficulty: "intermediate",
    minutes: 35,
    status: "todo",
    topics: ["generics", "utility types", "mapped types"],
  },
  {
    command: "pnpm lesson:06",
    folder: "lessons/06-async-and-errors",
    id: "async-and-errors",
    title: "Async And Errors",
    description: "Make async success and failure explicit with result unions.",
    difficulty: "intermediate",
    minutes: 35,
    status: "todo",
    topics: ["async", "promises", "result types"],
  },
  {
    command: "pnpm lesson:07",
    folder: "lessons/07-modules-and-domain-modeling",
    id: "modules-and-domain-modeling",
    title: "Modules And Domain Modeling",
    description: "Move useful types into modules that API, frontend, and tests can share.",
    difficulty: "advanced",
    minutes: 40,
    status: "todo",
    topics: ["modules", "domain modeling", "shared types"],
  },
  {
    command: "pnpm dev:api",
    folder: "examples/api",
    id: "typed-api",
    title: "Typed API",
    description: "Expose shared roadmap data through a zero-dependency Node API.",
    difficulty: "advanced",
    minutes: 45,
    status: "todo",
    topics: ["node", "http", "json", "runtime validation"],
  },
  {
    command: "pnpm dev:web",
    folder: "apps/frontend",
    id: "frontend-workspace",
    title: "Frontend Workspace",
    description: "Render API data in a browser while validating unknown network payloads.",
    difficulty: "advanced",
    minutes: 45,
    status: "todo",
    topics: ["vite", "fetch", "dom", "ui state"],
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
