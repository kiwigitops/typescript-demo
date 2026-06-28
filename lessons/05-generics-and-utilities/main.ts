type ApiEnvelope<T> = {
  data: T;
  receivedAt: string;
};

type Lesson = {
  difficulty: "beginner" | "intermediate" | "advanced";
  id: string;
  minutes: number;
  title: string;
};

type LessonPreview = Pick<Lesson, "id" | "title">;
type LessonPatch = Partial<Pick<Lesson, "difficulty" | "minutes">>;
type PublishedLesson = Readonly<Lesson>;

function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

function envelope<T>(data: T): ApiEnvelope<T> {
  return {
    data,
    receivedAt: new Date("2026-06-28T00:00:00.000Z").toISOString(),
  };
}

function groupBy<T, K extends PropertyKey>(items: readonly T[], keyFor: (item: T) => K): Partial<Record<K, T[]>> {
  return items.reduce<Partial<Record<K, T[]>>>((groups, item) => {
    const key = keyFor(item);
    const bucket = groups[key] ?? [];
    groups[key] = [...bucket, item];
    return groups;
  }, {});
}

const lessons: readonly PublishedLesson[] = [
  { difficulty: "beginner", id: "hello", minutes: 10, title: "Hello World" },
  { difficulty: "beginner", id: "values", minutes: 20, title: "Types And Values" },
  { difficulty: "intermediate", id: "unions", minutes: 30, title: "Unions" },
];

const preview: LessonPreview = { id: "hello", title: "Hello World" };
const patch: LessonPatch = { minutes: 12 };
const firstLesson = first(lessons);
const grouped = groupBy(lessons, (lesson) => lesson.difficulty);

console.log(envelope({ firstLesson, grouped, patch, preview }));

