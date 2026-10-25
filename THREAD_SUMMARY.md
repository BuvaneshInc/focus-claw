# metaChat — Consolidated Project Summary

## Product direction
Build a chat experience using server-rendered HTML and HTMX for most page behavior, with React islands only where interactive UI benefits from component state. Use Node.js/Express as the web server. PostgreSQL is the intended durable store; Redis and cross-client realtime are future additions, not implemented in this starter.

## Architecture
- Browser: server-rendered HTML + HTMX requests.
- React islands: message composer and small interactive components.
- Express: page route and JSON/HTML message endpoints.
- Prototype storage: in-memory map (data is lost on restart).
- Planned: PostgreSQL persistence, authentication/authorization, WebSockets or SSE, rate limiting and observability.
- Delivery: Docker and GitHub Actions; Fly.io deployment configuration is supplied but must be configured and tested in the target account.

## Important implementation boundaries
- PostgreSQL is provisioned in Compose, but the starter server does not yet use it.
- Redis is not included in the running implementation.
- A local custom browser event refreshes the current browser only; it does not broadcast to other users.
- Authentication, authorization, rate limiting, moderation, and production session security are not implemented.
- Do not treat this prototype as a production messaging service until the above gaps are addressed.

## Product/design principles captured in planning
1. **Zero "But" Rule** — if there's a “but” after it works, it doesn't work. Every action finishes in 1 tap.
2. **Privacy Is The Product, Not The Footnote** — 0 contacts uploaded. On-device first, verified on-chain. Always.
3. **Consistent Taste Over Random Features** — same premium feel in light/dark, free/pro, Chennai or California. Features get a first try. Taste gets a repeat.

## Planned design assets
```text
assets/global/light/{time-saved.png,fomo-killer.png,data-diet.png,pricing.png}
assets/global/dark/{time-saved.png,fomo-killer.png,data-diet.png,pricing.png}
assets/global/all-8-global.jpg
assets/principles/3-laws-of-taste.png
```
The source images were not available in this package; placeholder folders are provided.

## Deployment
1. Install dependencies and build.
2. Run local smoke tests.
3. Configure the Fly.io app name and `FLY_API_TOKEN` GitHub Actions secret.
4. Deploy only after reviewing environment variables, health checks, logs, and rollback procedures.
5. Use `npm ci` with a committed lockfile once one has been generated and verified.

## Recommended next work
1. Add PostgreSQL migrations and a repository layer.
2. Implement authentication and room membership authorization.
3. Add WebSocket/SSE transport for cross-client updates.
4. Add integration tests, rate limiting, request validation, structured logging, and security headers.
5. Add CI dependency locking and deployment verification.
