export const ALL_TRACKS = "All";

export type Track = "Start" | "Types" | "Runtime" | "App";
export type TrackFilter = Track | typeof ALL_TRACKS;

export type Lesson = {
  readonly id: string;
  readonly chapter: string;
  readonly track: Track;
  readonly title: string;
  readonly summary: string;
  readonly command: string;
  readonly goals: readonly string[];
  readonly source: string;
  readonly output: string;
};

export const tracks: readonly Track[] = ["Start", "Types", "Runtime", "App"];

export const lessons: readonly Lesson[] = [
  {
    id: "hello-world",
    chapter: "01",
    track: "Start",
    title: "Hello World",
    summary: "Run the smallest useful TypeScript program and see a typed function do real work.",
    command: "pnpm lesson:01",
    goals: ["Annotate a parameter", "Return a typed value", "Run the file"],
    source: [
      "function greet(name: string): string {",
      '  return `Hello, ${name}. Welcome to TypeScript.`;',
      "}",
      "",
      'console.log(greet("future TypeScript pro"));',
    ].join("\n"),
    output: "Hello, future TypeScript pro. Welcome to TypeScript.",
  },
  {
    id: "values",
    chapter: "02",
    track: "Start",
    title: "Values",
    summary: "Use strings, numbers, arrays, tuples, and literal unions without making everything loose.",
    command: "pnpm lesson:02",
    goals: ["Create a literal union", "Use a readonly tuple", "Format the value"],
    source: [
      'type Track = "Start" | "Types" | "Runtime" | "App";',
      "type Chapter = readonly [number, string, Track];",
      "",
      'const chapter: Chapter = [2, "Values", "Start"];',
      "console.log(`${chapter[0]}. ${chapter[1]} (${chapter[2]})`);",
    ].join("\n"),
    output: "2. Values (Start)",
  },
  {
    id: "functions",
    chapter: "03",
    track: "Types",
    title: "Functions",
    summary: "Pass typed objects through functions and return new objects instead of mutating old ones.",
    command: "pnpm lesson:03",
    goals: ["Define an object type", "Use readonly fields", "Return a new object"],
    source: [
      "type Task = {",
      "  readonly id: string;",
      "  title: string;",
      "  done: boolean;",
      "};",
      "",
      "function complete(task: Task): Task {",
      "  return { ...task, done: true };",
      "}",
      "",
      'console.log(complete({ id: "1", title: "learn functions", done: false }).done);',
    ].join("\n"),
    output: "true",
  },
  {
    id: "unions",
    chapter: "04",
    track: "Types",
    title: "Unions",
    summary: "Model loading, success, and failure as explicit states instead of boolean soup.",
    command: "pnpm lesson:04",
    goals: ["Create a discriminated union", "Narrow by status", "Handle every case"],
    source: [
      "type LoadState<T> =",
      '  | { status: "loading" }',
      '  | { status: "success"; data: T }',
      '  | { status: "error"; message: string };',
      "",
      "function label<T>(state: LoadState<T>): string {",
      '  if (state.status === "success") return `Ready: ${state.data}`;',
      '  if (state.status === "error") return state.message;',
      '  return "Loading";',
      "}",
      "",
      'console.log(label({ status: "success", data: "lesson 04" }));',
    ].join("\n"),
    output: "Ready: lesson 04",
  },
  {
    id: "generics",
    chapter: "05",
    track: "Types",
    title: "Generics",
    summary: "Write reusable helpers that keep the shape of the data that flows through them.",
    command: "pnpm lesson:05",
    goals: ["Write a generic function", "Preserve literal types", "Avoid duplicate helpers"],
    source: [
      "function first<T>(items: readonly T[]): T | undefined {",
      "  return items[0];",
      "}",
      "",
      'const names = ["Ada", "Grace", "Linus"] as const;',
      "console.log(first(names));",
    ].join("\n"),
    output: "Ada",
  },
  {
    id: "async",
    chapter: "06",
    track: "Runtime",
    title: "Async",
    summary: "Represent async success and failure in a way the compiler can help you handle.",
    command: "pnpm lesson:06",
    goals: ["Use Promise", "Return a Result union", "Narrow before reading data"],
    source: [
      "type Result<T> =",
      "  | { ok: true; value: T }",
      "  | { ok: false; error: string };",
      "",
      "async function loadLesson(): Promise<Result<string>> {",
      '  return { ok: true, value: "async data" };',
      "}",
      "",
      "const result = await loadLesson();",
      'console.log(result.ok ? `Loaded ${result.value}` : result.error);',
    ].join("\n"),
    output: "Loaded async data",
  },
  {
    id: "api-client",
    chapter: "07",
    track: "Runtime",
    title: "API Client",
    summary: "Treat outside data as unknown, validate it, then promote it into a useful type.",
    command: "pnpm lesson:07",
    goals: ["Accept unknown input", "Validate object shape", "Return typed data"],
    source: [
      "type User = { name: string; role: \"admin\" | \"member\" };",
      "",
      "function parseUser(input: unknown): User {",
      '  if (!input || typeof input !== "object") throw new Error("Invalid user");',
      "  const value = input as Record<string, unknown>;",
      '  if (typeof value.name !== "string") throw new Error("Missing name");',
      '  if (value.role !== "admin" && value.role !== "member") throw new Error("Missing role");',
      "  return { name: value.name, role: value.role };",
      "}",
      "",
      'console.log(parseUser({ name: "Grace", role: "admin" }).name);',
    ].join("\n"),
    output: "Grace",
  },
  {
    id: "frontend-state",
    chapter: "08",
    track: "App",
    title: "Frontend State",
    summary: "Build a browser workspace with typed state, DOM events, and predictable rendering.",
    command: "pnpm lesson:08",
    goals: ["Create a state type", "Render from state", "Update from an event"],
    source: [
      "type ViewState = { selectedLesson: string; sidebarOpen: boolean };",
      "",
      "const state: ViewState = {",
      '  selectedLesson: "hello-world",',
      "  sidebarOpen: true,",
      "};",
      "",
      "console.log(`${state.selectedLesson}:${state.sidebarOpen}`);",
    ].join("\n"),
    output: "hello-world:true",
  },
  {
    id: "api-server",
    chapter: "09",
    track: "App",
    title: "API Server",
    summary: "Finish with a tiny Node API that serves typed JSON without hiding HTTP basics.",
    command: "pnpm api",
    goals: ["Start a server", "Return JSON", "Share lesson data"],
    source: [
      'import { createServer } from "node:http";',
      'import { lessons } from "../src/course";',
      "",
      "createServer((_request, response) => {",
      '  response.setHeader("Content-Type", "application/json");',
      "  response.end(JSON.stringify({ lessons }));",
      "}).listen(4174);",
    ].join("\n"),
    output: "TypeScript API listening on http://127.0.0.1:4174",
  },
];

export function lessonsForTrack(track: TrackFilter): Lesson[] {
  if (track === ALL_TRACKS) return [...lessons];
  return lessons.filter((lesson) => lesson.track === track);
}

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function formatRun(lesson: Lesson): string {
  return `$ ${lesson.command}\n${lesson.output}`;
}
