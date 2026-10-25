/**
 * Safe defaults for Focus Claw. No secrets or personal identifiers belong here.
 * Runtime adapters should inject environment-specific values.
 */
export const DEFAULT_CONFIG = Object.freeze({
  appName: "Focus Claw",
  mode: "local-first",
  retentionDays: 93,
  maxConsentPayloadBytes: 1024,
  allowedChannels: ["sms", "calls", "whatsapp", "email"],
  externalLlmEnabled: false
});

export function getConfig(overrides = {}) {
  const config = { ...DEFAULT_CONFIG, ...overrides };
  if (!Number.isInteger(config.retentionDays) || config.retentionDays < 1 || config.retentionDays > 3650) {
    throw new Error("retentionDays must be an integer between 1 and 3650");
  }
  return Object.freeze(config);
}
