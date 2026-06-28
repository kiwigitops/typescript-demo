import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    outDir: "../../dist/frontend",
    emptyOutDir: true,
  },
  root: "apps/frontend",
  server: {
    proxy: {
      "/api": "http://127.0.0.1:4174",
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    root: ".",
  },
});
