import { describe, it, expect } from "vitest";
import { validateSkillManifest } from "./loader.js";

describe("skill manifest validation", () => {
  const valid = { skills: [{ id: "sms_filter", path: "skills/sms_filter/agent.wasm", maxBytes: 1024, consentNeeded: true }] };
  it("accepts a valid manifest", () => expect(validateSkillManifest(valid)).toHaveLength(1));
  it("rejects duplicate IDs", () => expect(() => validateSkillManifest({ skills: [...valid.skills, ...valid.skills] })).toThrow(/Duplicate/));
  it("rejects oversized skills", () => expect(() => validateSkillManifest({ skills: [{ ...valid.skills[0], maxBytes: 6 * 1024 * 1024 }] })).toThrow(/size limit/));
});
