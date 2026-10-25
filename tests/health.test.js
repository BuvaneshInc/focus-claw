import test from "node:test";
import assert from "node:assert/strict";

test("health endpoint response contract", () => {
  const response = { status: "ok", storage: "in-memory-prototype" };
  assert.equal(response.status, "ok");
  assert.equal(response.storage, "in-memory-prototype");
});
