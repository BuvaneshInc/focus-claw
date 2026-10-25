import { describe, it, expect } from "vitest";
import { canonicalConsent, consentReceiptHash, hmacContact, normalizeConsent } from "./consent.js";

const sample = {
  consentVersion: "v1",
  deviceTokenHash: "a".repeat(64),
  channels: { sms: true, calls: true, whatsapp: false, email: true, sync: false }
};

describe("consent helpers", () => {
  it("normalizes explicit boolean channel choices", () => {
    expect(normalizeConsent(sample).channels.whatsapp).toBe(false);
  });
  it("creates a deterministic canonical payload and receipt hash", () => {
    expect(canonicalConsent(sample)).toBe(canonicalConsent(sample));
    expect(consentReceiptHash(sample)).toMatch(/^[a-f0-9]{64}$/);
  });
  it("rejects missing consent fields", () => {
    expect(() => normalizeConsent({ ...sample, channels: {} })).toThrow(/must be a boolean/);
  });
  it("HMACs contact data without returning the original", () => {
    const result = hmacContact("contact@example.test", "s".repeat(32));
    expect(result).toMatch(/^[a-f0-9]{64}$/);
    expect(result).not.toContain("contact");
  });
});
