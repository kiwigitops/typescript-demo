# Troubleshooting

## `pnpm` is not found

Install pnpm from the official package manager instructions, or run the scripts with another package manager after translating the commands.

## `Cannot find module`

Run:

```bash
pnpm install
```

## The frontend says the API is unavailable

Start the API in a separate terminal:

```bash
pnpm dev:api
```

The API listens on `http://127.0.0.1:4174`. Vite proxies `/api` requests to that server.

## Type errors after editing a lesson

That is the point. Read the error from the first line down, find the expected type, then decide whether the code or the type should change.

## Why so strict?

The repo enables strict options such as `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` because those settings catch real bugs early. The examples show how to work with those checks instead of disabling them.

