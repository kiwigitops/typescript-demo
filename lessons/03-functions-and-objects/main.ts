type CourseTask = {
  readonly id: string;
  done: boolean;
  estimateMinutes?: number;
  title: string;
};

type Course = {
  readonly id: string;
  readonly title: string;
  readonly tasks: readonly CourseTask[];
};

function completeTask(task: CourseTask): CourseTask {
  return {
    ...task,
    done: true,
  };
}

function summarizeCourse(course: Course): string {
  const completed = course.tasks.filter((task) => task.done).length;
  return `${course.title}: ${completed}/${course.tasks.length} tasks complete`;
}

const firstTask: CourseTask = {
  done: false,
  estimateMinutes: 15,
  id: "types",
  title: "Write your first object type",
};

const course: Course = {
  id: "ts-zero-to-hero",
  title: "TypeScript Zero To Hero",
  tasks: [completeTask(firstTask), { done: false, id: "functions", title: "Type a function" }],
};

console.log(summarizeCourse(course));
console.log(course.tasks.map((task) => `${task.done ? "[x]" : "[ ]"} ${task.title}`).join("\n"));

