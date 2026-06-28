type LessonSummary = {
  complete: boolean;
  minutes: number;
  title: string;
};

function greet(name: string): string {
  return `Hello, ${name}. Welcome to TypeScript.`;
}

const learnerName = "future TypeScript pro";
const summary: LessonSummary = {
  complete: true,
  minutes: 10,
  title: "Hello World",
};

console.log(greet(learnerName));
console.log(`${summary.title} takes about ${summary.minutes} minutes.`);
console.log(`Complete: ${summary.complete ? "yes" : "not yet"}`);

