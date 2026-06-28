import { describe, expect, it } from "vitest";
import { filterByDifficulty, findRoadmapItem, getRoadmapSummary, isDifficulty, roadmapItems } from "../src/shared/roadmap";

describe("roadmap domain model", () => {
  it("summarizes completion and time", () => {
    const summary = getRoadmapSummary(roadmapItems);

    expect(summary.totalItems).toBe(9);
    expect(summary.completedItems).toBe(3);
    expect(summary.completionPercent).toBe(33);
    expect(summary.totalMinutes).toBe(285);
  });

  it("filters by difficulty", () => {
    const beginnerItems = filterByDifficulty("beginner");

    expect(beginnerItems.map((item) => item.id)).toEqual(["hello-world", "types-and-values", "functions-and-objects"]);
  });

  it("finds known items and rejects unknown difficulty labels", () => {
    expect(findRoadmapItem("frontend-workspace")?.difficulty).toBe("advanced");
    expect(isDifficulty("expert")).toBe(false);
  });
});
