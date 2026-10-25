# Implementation status

| Component | Status in this bundle | Notes |
|---|---|---|
| React UI | Implemented demo | In-memory sample state; no connectors |
| Focus / Others | Implemented demo | Search, priority cards, clear action |
| Dashboard | Implemented demo | Metrics explicitly illustrative |
| Privacy Vault | Implemented demo | Retention choice is not enforced deletion |
| Consent UI | Implemented demo | Toggles do not grant OS permissions |
| Brain rules | Descriptive demo | No live classification or LLM |
| Call Block | UI-only demo | Cannot intercept cellular calls in browser |
| Consent helper | Implemented helper + tests | Node crypto module; use in server/native context, not directly in browser |
| Skill loader | Manifest validation + tests | Does not execute WASM |
| WASM skills | Not implemented | C no-op source only; binaries omitted |
| Cloudflare Worker | Prototype endpoint | Must add authentication, rate limiting, receipt verification |
| Durable Object sync | Not included | Needs separate protocol and threat model |
| Solidity anchor | Prototype contract | Not audited; test on local chain first |
| Browser extension | Manifest shell | No options page/background logic yet |
| Docker | Static frontend container | Nginx health check and basic headers |
| CI | Build + test workflow | Dependency/action pinning recommended for production |
