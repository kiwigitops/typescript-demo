import {
  difficulties,
  filterByDifficulty,
  findRoadmapItem,
  getRoadmapSummary,
  roadmapItems,
  type Difficulty,
} from "../../src/shared/roadmap";

const selectedDifficulty: Difficulty = difficulties[1] ?? "intermediate";
const matchingLessons = filterByDifficulty(selectedDifficulty);
const summary = getRoadmapSummary(roadmapItems);
const featured = findRoadmapItem("api-and-frontend");

console.log(`Selected difficulty: ${selectedDifficulty}`);
console.log(`Matching lessons: ${matchingLessons.map((lesson) => lesson.title).join(", ")}`);
console.log(`Completion: ${summary.completedItems}/${summary.totalItems} (${summary.completionPercent}%)`);
console.log(`Featured next step: ${featured?.title ?? "No featured lesson"}`);

