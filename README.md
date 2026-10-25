# metaChat

A starter chat application demonstrating server-rendered HTML, HTMX fragment loading, and React islands. It includes development, test, Docker, and Fly.io deployment scaffolding.

## Requirements
- Node.js 22+
- npm 10+
- Optional: Docker with Compose

## Run locally
```bash
npm install
npm run build
npm start
```
Open http://localhost:3000.

For development with file watchers:
```bash
npm run dev
```

## Run with Docker
```bash
docker compose up --build
```

## Endpoints
- `GET /` — chat page.
- `GET /api/health` — health response.
- `GET /api/rooms/:roomId/messages` — JSON by default; HTML fragment for `HX-Request: true`.
- `POST /api/rooms/:roomId/messages` — accepts `{ "text": "...", "author": "..." }`; returns JSON or HTML fragment.

## Tests
```bash
npm test
```

## Deployment
See `THREAD_SUMMARY.md` and `fly.toml`. Before deployment, set a unique Fly app name and add `FLY_API_TOKEN` as a GitHub Actions repository secret.

## Important limitations
This is a starter, not a production-ready chat service. The current message store is in memory; PostgreSQL is provisioned in Compose but not wired into the server. Authentication, authorization, cross-client real-time updates, rate limiting, and full integration tests remain to be implemented. The CI workflow uses `npm install` until a lockfile is committed; generate and validate `package-lock.json`, then switch CI to `npm ci`.
