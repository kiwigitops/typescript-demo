# Typed Node API

This example uses Node's built-in `http` module so the request and response flow stays visible.

Run it:

```bash
pnpm dev:api
```

Default URL:

```text
http://127.0.0.1:4174
```

## Routes

| Route | Description |
| --- | --- |
| `GET /api/health` | Basic health check |
| `GET /api/roadmap` | All roadmap items and summary |
| `GET /api/roadmap?difficulty=beginner` | Filter by difficulty |
| `GET /api/roadmap/:id` | Fetch one roadmap item |

The API returns typed JSON shapes, but it still validates runtime inputs such as query strings and unknown IDs.

