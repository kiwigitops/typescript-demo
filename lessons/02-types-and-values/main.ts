type Difficulty = "beginner" | "intermediate" | "advanced";
type LessonTuple = readonly [id: number, title: string, difficulty: Difficulty];

const title = "Types And Values";
const lessonNumber = 2;
const isFoundational = true;
const difficulty: Difficulty = "beginner";
const topics: readonly string[] = ["primitives", "literals", "arrays", "tuples"];
const lesson: LessonTuple = [lessonNumber, title, difficulty];

function describeDifficulty(value: Difficulty): string {
  if (value === "beginner") return "Start here and move slowly.";
  if (value === "intermediate") return "You are ready for bigger shapes.";
  return "You are modeling application boundaries now.";
}

console.log({ title, lessonNumber, isFoundational });
console.log(`Tuple lesson: #${lesson[0]} ${lesson[1]} (${lesson[2]})`);
console.log(`Topics: ${topics.join(", ")}`);
console.log(describeDifficulty(difficulty));

