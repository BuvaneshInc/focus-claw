# Focus Vault policy (starter)

## Product principles
- Local-first processing: classify content on the user's device wherever the target OS permits it.
- No message body, contact name, or raw phone number may be uploaded by the consent service.
- External LLM calls for private message content are disabled by design.
- Every channel has an independent, revocable consent setting.
- UI preferences are not equivalent to OS-level permissions or legal consent records.

## Priority model (demo policy)
1. Family urgent — explicitly selected trusted contacts or reviewed urgent signals.
2. Action required — account or bank notices that require user action.
3. Direct mention — a direct request or mention.
4. Others — available without interrupting the user.

The shipped UI uses sample items and labels. It does not connect to any real inbox and does not perform live classification.

## Retention
Default display selection: 93 days. Options in the UI are illustrative until a retention service enforces deletion. Production data stores must implement deletion, backup expiry, and auditable retention jobs.

## Consent sync
Only a device-token hash, a receipt hash, explicit channel booleans, version, and timestamp may be considered for sync. Avoid stable identifiers where possible. Do not treat an HMAC or hash as anonymous if it remains linkable.

## Security requirements before production
- Platform authentication and authorization.
- Rate limiting, replay protection, key rotation, audit logging without sensitive payloads.
- Threat modeling, penetration testing, dependency scanning, privacy/legal review.
- Enforced payload schema and strict body limits.
- No secrets in source control or example config.
