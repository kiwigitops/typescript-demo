type Track = "Start" | "Types" | "Runtime" | "App";
type Chapter = readonly [number, string, Track];

const chapter: Chapter = [2, "Values", "Start"];

console.log(`${chapter[0]}. ${chapter[1]} (${chapter[2]})`);
