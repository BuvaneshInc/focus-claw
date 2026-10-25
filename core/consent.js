import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Build a small consent receipt from minimal, non-content fields.
 * Do not pass message bodies, contact names, or raw phone numbers to this module.
 */
export function normalizeConsent(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("Consent input must be an object");
  }
  const allowedChannels = ["sms", "calls", "whatsapp", "email", "sync"];
  const channels = {};
  for (const channel of allowedChannels) {
    if (typeof input.channels?.[channel] !== "boolean") {
      throw new TypeError(`channels.${channel} must be a boolean`);
    }
    channels[channel] = input.channels[channel];
  }
  if (typeof input.consentVersion !== "string" || input.consentVersion.length > 40) {
    throw new TypeError("consentVersion must be a string of at most 40 characters");
  }
  if (typeof input.deviceTokenHash !== "string" || !/^[a-f0-9]{64}$/i.test(input.deviceTokenHash)) {
    throw new TypeError("deviceTokenHash must be a SHA-256 hex digest");
  }
  return { consentVersion: input.consentVersion, deviceTokenHash: input.deviceTokenHash.toLowerCase(), channels };
}

export function canonicalConsent(input) {
  const normalized = normalizeConsent(input);
  return JSON.stringify({
    consentVersion: normalized.consentVersion,
    deviceTokenHash: normalized.deviceTokenHash,
    channels: Object.fromEntries(Object.entries(normalized.channels).sort(([a], [b]) => a.localeCompare(b)))
  });
}

export function consentReceiptHash(input) {
  return createHash("sha256").update(canonicalConsent(input), "utf8").digest("hex");
}

/** HMAC a contact identifier locally. Keep the secret in the OS keychain/secure storage. */
export function hmacContact(contact, secret) {
  if (typeof contact !== "string" || !contact.trim()) throw new TypeError("contact must be a non-empty string");
  if (typeof secret !== "string" || secret.length < 32) throw new TypeError("secret must be at least 32 characters");
  return createHmac("sha256", secret).update(contact.trim(), "utf8").digest("hex");
}

export function verifyHexDigest(expected, actual) {
  if (typeof expected !== "string" || typeof actual !== "string" || !/^[a-f0-9]{64}$/i.test(expected) || !/^[a-f0-9]{64}$/i.test(actual)) return false;
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
}
