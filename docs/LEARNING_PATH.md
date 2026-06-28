# Learning Path

This repo is organized as a climb. Each section introduces one idea, then reuses it in a slightly more realistic place later.

## Stage 1: Foundations

Start here if TypeScript is new:

- `01-hello-world`: annotations, inference, and running a `.ts` file.
- `02-types-and-values`: primitives, literals, arrays, tuples, and readonly values.
- `03-functions-and-objects`: function signatures, object shapes, optional fields, and immutability.

Success signal: you can read a function signature and predict what values are allowed in and out.

## Stage 2: Modeling Real States

Move here once basic syntax feels boring:

- `04-unions-and-narrowing`: model different states without boolean soup.
- `05-generics-and-utilities`: write reusable helpers without losing type information.
- `06-async-and-errors`: make success and failure explicit.

Success signal: you can represent "loading", "failed", and "ready" states without comments explaining which fields exist.

## Stage 3: Application Shape

Now TypeScript starts helping with architecture:

- `07-modules-and-domain-modeling`: split domain types and logic into reusable modules.
- `examples/api`: expose shared data through a typed Node API.
- `apps/frontend`: fetch the API and render it in a browser.
- `tests`: check runtime behavior that static types cannot prove.

Success signal: backend, frontend, and tests all agree on the same domain model.

## What To Avoid

- Do not use `any` as a panic button. Use `unknown` at boundaries and narrow it.
- Do not create huge types before the code needs them.
- Do not trust API responses just because you wrote a TypeScript type.
- Do not fight strict mode. It is showing you where the code is vague.

