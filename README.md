# Focus Claw — privacy-first assistant starter

Focus Claw is a local-first UI and architecture starter for a calmer attention workspace. This bundle includes a React/TypeScript frontend, privacy and consent helpers, a minimal Cloudflare Worker endpoint for consent receipts, an example Solidity timestamp anchor, sample skill contracts, Docker deployment, and CI workflows.

> **Status: starter/demo, not production-ready.** No inbox, SMS, WhatsApp, email, contact, or phone integration is active. The frontend uses sample data. The skill C files are no-op interface examples; no WASM binaries are included. Blockchain code is unaudited. Cloud consent sync requires authentication, rate limiting, deployment configuration, and a security review before production.

## Included screens
- **Focus** — sample priority feed, explain-why panel, clear item action.
- **Others** — sample low-priority items.
- **Dashboard** — illustrative demo metrics and priority breakdown.
- **Privacy Vault** — retention preference and data-handling notes.
- **Consent** — independent opt-in preferences for SMS, calls, WhatsApp, email, and sync.
- **Brain** — transparent, rule-based demo policy.
- **Call Block** — local UI-only block list. It does not intercept cellular calls.

## Quick start

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL (usually `http://localhost:5173`).

## Verify

```bash
npm test
npm run build
```

## Run in Docker

```bash
docker compose up --build
```

Open `http://localhost:8080`.

## Architecture

```text
React / TypeScript UI
  ├── Focus, Others, Dashboard
  ├── Privacy Vault, Consent, Brain, Call Block
  └── local in-memory demo state
          │
          ├── core/consent.js       canonical minimal consent receipts / HMAC helper
          ├── core/loader.js        skill manifest validation
          ├── skills/*/agent.c      no-op WASM interface examples
          ├── cloud/worker.js       optional consent receipt endpoint (KV)
          └── chain/ConsentAnchor.sol optional on-chain receipt timestamp
```

## Privacy boundaries

- The frontend does not call the Cloudflare Worker or any remote API.
- No real communication data is collected by this starter.
- Do not upload message bodies, contact names, raw phone numbers, or private data.
- A hash or HMAC can remain linkable and is not automatically anonymous.
- UI consent toggles are demo state, not OS permissions or legally sufficient consent records.
- The example Worker stores a minimal receipt for 30 days. It does not authenticate a user identity; add an auth layer and rate limits before use.
- The Solidity contract stores only a receipt hash and timestamp. Public-chain data is permanent and may be linkable; do not anchor personal data.
- The browser extension manifest is a shell with `storage` permission only; no message-reading functionality exists.

## Cloudflare Worker setup

1. Create a KV namespace and set its ID in `cloud/wrangler.toml.example`.
2. Copy the example to `cloud/wrangler.toml` (the real config is ignored if you add secrets locally).
3. Set `ALLOWED_ORIGIN` to the exact deployed frontend origin.
4. Add the secret:
   ```bash
   wrangler secret put RECEIPT_HMAC_KEY
   ```
5. Deploy from the `cloud/` directory with a pinned Wrangler version.
6. Add platform authentication, rate limiting, replay controls, logs that exclude sensitive payloads, and a security review before production.

The Worker validates schema and payload size, but a receipt hash sent by the client is not proof of identity or integrity. Production code should recompute/verify the canonical receipt hash and authenticate the caller.

## Skills / WASM

`skills/manifest.json` describes five opt-in skills. Each directory has a C no-op interface and documentation. There are no generated `.wasm` artifacts. Pin and verify your compiler, compile in a controlled pipeline, test memory/fuel limits and hostile inputs, generate checksums/SBOM, then enable only after review. The runtime must sandbox WASM execution in a worker and default-deny network access.

## Deployment notes

- Docker serves the static app with Nginx on port 8080.
- `.github/workflows/ci.yml` runs build and tests.
- `.github/workflows/docker.yml` builds and pushes to GitHub Container Registry on `main` and version tags. Review and pin third-party GitHub Actions to full commit SHAs for hardened production supply-chain security.
- Configure a strict Content Security Policy for your actual hosting needs. This starter references Google Fonts; for a fully offline/local-only UI, self-host the fonts or remove the external font import and tighten CSP.
- Review license, accessibility, threat model, data retention, platform permissions, and jurisdictional compliance before launch.

## Suggested next steps
1. Confirm target platforms (web only, browser extension, Android, iOS, desktop).
2. Define the real message data source and permissions for each channel.
3. Implement a native local classifier with explainable rules and no network by default.
4. Add authentication and abuse protection to the consent service.
5. Implement real retention/deletion jobs and tests.
6. Run privacy/security review and independent audit.
