# Frontend With API

This app is a small TypeScript frontend built with Vite. It fetches the roadmap from the local API and renders progress, filters, and lesson cards.

Run both servers:

```bash
pnpm dev:api
pnpm dev:web
```

Open the Vite URL printed by `pnpm dev:web`.

## What To Notice

- The frontend imports the same `RoadmapItem` and `Difficulty` types as the API.
- API data is treated as `unknown` until a small runtime validator accepts it.
- If the API is offline, the UI falls back to local shared data and tells the user.
- DOM rendering stays typed with helper functions instead of loose selectors.

