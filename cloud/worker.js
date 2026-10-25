/**
 * Cloudflare Worker starter for minimal consent receipts.
 * Security posture: strict JSON size limit, strict schema, CORS allowlist,
 * no message bodies/contact identifiers, no unauthenticated websocket sync.
 *
 * Required bindings:
 *   CONSENT_KV: KV namespace
 *   ALLOWED_ORIGIN: exact allowed origin, e.g. https://app.example.com
 *   RECEIPT_HMAC_KEY: secret, >= 32 chars (Worker secret)
 */
const MAX_BODY_BYTES = 1024;
const MAX_TOKEN_AGE_SECONDS = 10 * 60;

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers }
  });
}
function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin || origin !== env.ALLOWED_ORIGIN) return {};
  return { "access-control-allow-origin": origin, "vary": "Origin", "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type, authorization" };
}
async function readLimitedJson(request) {
  const declared = Number(request.headers.get("content-length") || "0");
  if (declared > MAX_BODY_BYTES) throw new Error("body_too_large");
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) throw new Error("body_too_large");
  return JSON.parse(raw);
}
function validDigest(value) { return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value); }
function validReceipt(body) {
  const allowed = ["sms", "calls", "whatsapp", "email", "sync"];
  return body && typeof body === "object" &&
    body.version === 1 &&
    validDigest(body.deviceTokenHash) &&
    validDigest(body.receiptHash) &&
    typeof body.createdAt === "number" &&
    Math.abs(Date.now() - body.createdAt) <= MAX_TOKEN_AGE_SECONDS * 1000 &&
    body.channels && Object.keys(body.channels).every(k => allowed.includes(k)) &&
    allowed.every(k => typeof body.channels[k] === "boolean");
}
export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") {
      if (!cors["access-control-allow-origin"]) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: cors });
    }
    const url = new URL(request.url);
    if (url.pathname !== "/consent") return json({ error: "not_found" }, 404, cors);
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, { ...cors, allow: "POST, OPTIONS" });
    if (!cors["access-control-allow-origin"]) return json({ error: "origin_not_allowed" }, 403);
    if (!env.CONSENT_KV || !env.RECEIPT_HMAC_KEY || env.RECEIPT_HMAC_KEY.length < 32) return json({ error: "server_misconfigured" }, 500, cors);
    let body;
    try { body = await readLimitedJson(request); }
    catch (error) { return json({ error: error.message === "body_too_large" ? "payload_too_large" : "invalid_json" }, 400, cors); }
    if (!validReceipt(body)) return json({ error: "invalid_consent_receipt" }, 400, cors);
    // This is an idempotent receipt record, not proof of authenticated user identity.
    // Deployments should add platform authentication / rate limiting and sign/verify receipt hashes.
    const key = `consent:v1:${body.deviceTokenHash}:${body.receiptHash}`;
    const value = JSON.stringify({ version: 1, receiptHash: body.receiptHash, channels: body.channels, createdAt: body.createdAt });
    await env.CONSENT_KV.put(key, value, { expirationTtl: 30 * 24 * 60 * 60 });
    return json({ ok: true, receiptHash: body.receiptHash, expiresInSeconds: 30 * 24 * 60 * 60 }, 201, cors);
  }
};
