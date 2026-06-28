# Exercises

Use these after each lesson. The goal is to make the compiler guide you.

## 01 - Hello World

- Change `learnerName` to a number and read the compiler error.
- Add a `level` field to `LessonSummary`.
- Print the full summary as JSON.

## 02 - Types And Values

- Add `"expert"` to the `Difficulty` union.
- Update `describeDifficulty` to handle it.
- Try to push into the readonly `topics` array and explain the error.

## 03 - Functions And Objects

- Add a required `owner` field to `Course`.
- Make `completeTask` preserve every original field.
- Add a function that calculates total estimated minutes.

## 04 - Unions And Narrowing

- Add a `"refreshing"` state.
- Watch the exhaustive check fail.
- Update `renderState` until the compiler is satisfied.

## 05 - Generics And Utilities

- Write a `last<T>` helper.
- Add a `RequiredLesson` type with `Required<Lesson>`.
- Group lessons by `minutes` and inspect the resulting type.

## 06 - Async And Errors

- Search for a missing course slug.
- Change the error type from `string` to `{ code: string; message: string }`.
- Add a retry function that only retries failed results.

## 07 - Modules And Domain Modeling

- Add a new roadmap item in `src/shared/roadmap.ts`.
- Update tests if the summary changes.
- Add a helper that returns the next non-done item.

## API

- Add `GET /api/summary`.
- Add a test for invalid difficulty query strings.
- Return `405` for `POST /api/roadmap` and test it.

## Frontend

- Add a status filter for `todo`, `doing`, and `done`.
- Add a detail panel when a lesson card is clicked.
- Show the API error code when the backend returns a typed error.

