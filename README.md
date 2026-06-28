# TypeScript Demo

A zero-to-hero TypeScript tutorial that starts with `hello world`, then climbs through strict typing, functions, objects, unions, generics, async code, Node APIs, tests, and a small frontend that talks to a local API.

The goal is not to memorize syntax. The goal is to learn how TypeScript helps you design code that is easier to change without guessing what will break.

## What You Will Build

- Console lessons you can run one at a time.
- A shared typed domain model used by both backend and frontend code.
- A tiny Node API with typed responses and predictable error shapes.
- A Vite frontend that fetches API data and renders a learning roadmap.
- Tests for domain logic so you can see where TypeScript ends and runtime checks begin.

## Quick Start

```bash
pnpm install
pnpm check
pnpm lesson:01
```

Run the frontend and API in two terminals:

```bash
pnpm dev:api
pnpm dev:web
```

Then open the Vite URL printed by `pnpm dev:web`.

## Learning Path

| Step | Topic | Run |
| --- | --- | --- |
| 01 | Hello world, annotations, inference | `pnpm lesson:01` |
| 02 | Primitives, literals, arrays, tuples | `pnpm lesson:02` |
| 03 | Functions, objects, readonly data | `pnpm lesson:03` |
| 04 | Unions, narrowing, exhaustive checks | `pnpm lesson:04` |
| 05 | Generics, mapped types, utility types | `pnpm lesson:05` |
| 06 | Async code, result types, error handling | `pnpm lesson:06` |
| 07 | Modules and domain modeling | `pnpm lesson:07` |
| API | Node HTTP API with typed JSON | `pnpm dev:api` |
| Web | Frontend fetching the API | `pnpm dev:web` |

## Practice Docs

- [Full learning path](docs/LEARNING_PATH.md)
- [TypeScript cheatsheet](docs/CHEATSHEET.md)
- [Practice exercises](docs/EXERCISES.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## Repository Map

```text
lessons/        Small, runnable TypeScript lessons from beginner to advanced
src/shared/     Domain types and pure functions shared by API, frontend, and tests
examples/api/   A zero-dependency Node API written in TypeScript
apps/frontend/  A Vite frontend that consumes the local API
tests/          Vitest coverage for the shared domain model
docs/           Study guide, troubleshooting, and project notes
```

## Suggested Study Rhythm

1. Read a lesson README.
2. Run the lesson script.
3. Change one value or type and rerun `pnpm typecheck`.
4. Fix the type error deliberately instead of fighting the compiler.
5. Move on only after you can explain why the type changed.

## Requirements

- Node.js 22 or newer is recommended.
- pnpm 10 or newer is recommended.

The examples avoid frameworks until the frontend chapter. The API uses Node's built-in `http` module so the request/response types stay visible.

## Commands

```bash
pnpm typecheck   # TypeScript only
pnpm test        # Unit tests
pnpm check       # Typecheck + tests
pnpm build       # Typecheck + frontend production build
pnpm dev:api     # Local API on http://127.0.0.1:4174
pnpm dev:web     # Vite frontend with /api proxy
```

## Philosophy

Good TypeScript is not about making every type clever. Prefer simple domain types, narrow inputs at the edges, keep runtime data honest, and let the compiler protect the core of your program.
