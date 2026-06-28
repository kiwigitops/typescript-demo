# TypeScript Demo

A zero-to-hero TypeScript tutorial rebuilt from scratch: runnable lesson files, a dark minimal web studio, and a tiny API chapter at the end.

## Quick Start

```bash
pnpm install
pnpm check
pnpm dev
```

Open the local Vite URL. The studio is local-first: it does not need an API server to browse lessons or press Run.

## What Is Inside

- `lessons/` has small TypeScript files you can run one at a time.
- `src/course.ts` is the typed lesson catalog shared by the studio and tests.
- `src/main.ts` renders the browser studio with typed DOM state.
- `api/server.ts` is the final tiny Node API chapter.
- `docs/` has the learning path and exercises.

## Lesson Commands

```bash
pnpm lesson:01
pnpm lesson:02
pnpm lesson:03
pnpm lesson:04
pnpm lesson:05
pnpm lesson:06
pnpm lesson:07
pnpm lesson:08
pnpm api
```

## Project Commands

```bash
pnpm typecheck
pnpm test
pnpm check
pnpm build
pnpm dev
```

## Study Path

Read [docs/learning-path.md](docs/learning-path.md), then use [docs/exercises.md](docs/exercises.md) to make each lesson your own.
