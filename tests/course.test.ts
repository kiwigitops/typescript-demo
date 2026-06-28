import { describe, expect, it } from "vitest";
import { ALL_TRACKS, formatRun, lessons, lessonsForTrack, tracks } from "../src/course";

describe("course data", () => {
  it("has a runnable command and output for every lesson", () => {
    expect(lessons).not.toHaveLength(0);

    for (const lesson of lessons) {
      expect(lesson.command).toMatch(/^pnpm /);
      expect(lesson.output.length).toBeGreaterThan(0);
      expect(formatRun(lesson)).toContain(lesson.command);
    }
  });

  it("filters lessons by track", () => {
    for (const track of tracks) {
      expect(lessonsForTrack(track).every((lesson) => lesson.track === track)).toBe(true);
    }

    expect(lessonsForTrack(ALL_TRACKS)).toHaveLength(lessons.length);
  });
});
