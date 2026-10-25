# Initial threat model (not a substitute for security review)

## Assets
- Consent preferences and receipts
- Device-linked identifiers or hashes
- User trust and local communication metadata
- Integrity of skill packages and updates

## Threats
- Malicious or compromised skill package
- Consent replay or forged consent receipt
- Abuse of public consent endpoint (spam/cost exhaustion)
- Accidental upload of message bodies or direct identifiers
- Cross-origin request abuse
- Dependency/supply-chain compromise
- False user belief that a UI toggle grants OS access or blocks calls
- Linkability of hashes and public blockchain anchors

## Baseline mitigations in starter
- Frontend has no remote API integration
- No real message collection
- Worker schema and payload-size validation, exact-origin CORS check, no-store headers
- Skill manifest size/path/duplicate-ID validation
- UI text labels demo metrics and nonfunctional platform integrations
- No secret values committed

## Required before production
- Authentication/authorization and rate limiting
- Server-side canonical hash recomputation and signature verification
- Replay protection with nonce/issued-at policy
- Strict schema validation and structured error handling
- Security headers and deployment CSP review
- Dependency lockfile, SBOM, signed/reproducible skill artifacts
- WASM worker isolation, resource quotas, fuzzing, malicious-input tests
- Data protection impact assessment and retention/deletion verification
- External security audit, incident response plan, key rotation and recovery
