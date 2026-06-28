type Task = {
  readonly id: string;
  title: string;
  done: boolean;
};

function complete(task: Task): Task {
  return { ...task, done: true };
}

console.log(complete({ id: "1", title: "learn functions", done: false }).done);
