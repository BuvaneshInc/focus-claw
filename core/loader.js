/**
 * Validates a skill manifest before a host application loads a skill.
 * Actual WASM execution should happen in a worker with strict memory/fuel limits.
 */
export function validateSkillManifest(manifest, { maxBytes = 5 * 1024 * 1024 } = {}) {
  if (!manifest || !Array.isArray(manifest.skills)) throw new TypeError("manifest.skills must be an array");
  const seen = new Set();
  return manifest.skills.map((skill) => {
    if (!skill || typeof skill.id !== "string" || !/^[a-z0-9_-]{2,60}$/.test(skill.id)) throw new Error("Invalid skill id");
    if (seen.has(skill.id)) throw new Error(`Duplicate skill id: ${skill.id}`);
    seen.add(skill.id);
    if (typeof skill.path !== "string" || !skill.path.endsWith(".wasm")) throw new Error(`Invalid WASM path for ${skill.id}`);
    if (!Number.isInteger(skill.maxBytes) || skill.maxBytes < 1 || skill.maxBytes > maxBytes) throw new Error(`Invalid size limit for ${skill.id}`);
    if (typeof skill.consentNeeded !== "boolean") throw new Error(`consentNeeded must be boolean for ${skill.id}`);
    return Object.freeze({ ...skill });
  });
}
