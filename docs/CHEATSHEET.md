# TypeScript Cheatsheet

## Annotations And Inference

```ts
const title = "Hello";       // inferred as string literal "Hello"
let count = 0;               // inferred as number
const minutes: number = 20;  // explicit annotation
```

Prefer inference until a boundary needs clarity.

## Object Types

```ts
type Lesson = {
  readonly id: string;
  title: string;
  minutes?: number;
};
```

- `readonly` means code should not reassign the property.
- `?` means the property may be absent.

## Unions

```ts
type Status = "todo" | "doing" | "done";
```

Use unions when a value must be one of a known set.

## Discriminated Unions

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
```

The `ok` field lets TypeScript narrow the rest of the object.

## Generics

```ts
function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}
```

Generics preserve information from input to output.

## Utility Types

```ts
type Preview = Pick<Lesson, "id" | "title">;
type Patch = Partial<Pick<Lesson, "title" | "minutes">>;
type Frozen = Readonly<Lesson>;
```

Use utility types to derive related shapes from one source type.

## Runtime Boundaries

TypeScript cannot prove that network data is honest.

```ts
const payload = (await response.json()) as unknown;
```

Treat external data as `unknown`, then validate it before using it as a domain type.

