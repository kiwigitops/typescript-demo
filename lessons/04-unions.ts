type LoadState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function label<T>(state: LoadState<T>): string {
  if (state.status === "success") return `Ready: ${state.data}`;
  if (state.status === "error") return state.message;
  return "Loading";
}

console.log(label({ status: "success", data: "lesson 04" }));
