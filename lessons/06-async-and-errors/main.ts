type Result<T, E> = { ok: true; value: T } | { error: E; ok: false };

type CourseRecord = {
  slug: string;
  title: string;
};

const records: readonly CourseRecord[] = [
  { slug: "hello-world", title: "Hello World" },
  { slug: "async-and-errors", title: "Async And Errors" },
];

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function findCourse(slug: string): Promise<Result<CourseRecord, string>> {
  await wait(20);
  const match = records.find((record) => record.slug === slug);

  if (!match) {
    return { error: `No course found for ${slug}`, ok: false };
  }

  return { ok: true, value: match };
}

const result = await findCourse("async-and-errors");

if (result.ok) {
  console.log(`Loaded: ${result.value.title}`);
} else {
  console.log(`Could not load course: ${result.error}`);
}

