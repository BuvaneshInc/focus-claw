# Skill contract

Every skill must:
- Be disabled until the user explicitly opts in.
- Declare its input schema, output schema, required consent, maximum memory, fuel/instruction budget, and version.
- Run in a worker/sandbox without network access by default.
- Receive only the minimum data needed; prefer user-selected labels and derived metadata over raw message content.
- Return a classification plus a short, explainable reason.
- Include unit tests, adversarial fixtures, fuzz tests, versioned build provenance, and a checksum.
- Stay below the configured 5 MiB artifact limit.
- Be independently revocable and removable.

Current `skills/*/agent.c` files are interface examples that intentionally return no positive classifications. They are not production classifiers. No WASM binaries are shipped.
