type Result<T> = { ok: true; value: T } | { ok: false; error: string };

async function loadLesson(): Promise<Result<string>> {
  return { ok: true, value: "async data" };
}

const result = await loadLesson();

console.log(result.ok ? `Loaded ${result.value}` : result.error);
