type LoadState<T> =
  | { status: "idle" }
  | { status: "loading"; message: string }
  | { status: "success"; data: T }
  | { status: "error"; message: string; retryable: boolean };

function assertNever(value: never): never {
  throw new Error(`Unhandled state: ${JSON.stringify(value)}`);
}

function renderState<T>(state: LoadState<T>): string {
  switch (state.status) {
    case "idle":
      return "Nothing loaded yet.";
    case "loading":
      return `Loading: ${state.message}`;
    case "success":
      return `Ready: ${JSON.stringify(state.data)}`;
    case "error":
      return state.retryable ? `Retryable error: ${state.message}` : `Fatal error: ${state.message}`;
    default:
      return assertNever(state);
  }
}

const states: readonly LoadState<{ title: string }>[] = [
  { status: "idle" },
  { status: "loading", message: "Fetching lessons" },
  { status: "success", data: { title: "Unions And Narrowing" } },
  { status: "error", message: "Network offline", retryable: true },
];

console.log(states.map(renderState).join("\n"));

