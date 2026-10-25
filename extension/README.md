# Browser extension shell

This is a manifest-only starter. `options.html`, a background service worker, inbox connectors, and browser-specific permission flows are not included yet. It deliberately requests only the `storage` permission and does not read webmail, messages, contacts, or call history.

Do not add host permissions or inbox content access without a concrete threat model, narrow permission scope, clear consent UX, and security review.
