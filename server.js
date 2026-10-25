import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);

// Prototype-only storage. Replace with PostgreSQL before production.
const messagesByRoom = new Map();

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/vendor", express.static(path.join(__dirname, "node_modules/htmx.org/dist")));
app.use("/styles.css", express.static(path.join(__dirname, "public/styles.css")));

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function roomMessages(roomId) {
  if (!messagesByRoom.has(roomId)) messagesByRoom.set(roomId, []);
  return messagesByRoom.get(roomId);
}

function renderMessage(message) {
  const safeTime = escapeHtml(message.createdAt);
  return `<article class="message" data-message-id="${escapeHtml(message.id)}">
    <div class="message__meta"><strong>${escapeHtml(message.author)}</strong>
    <time datetime="${safeTime}">${escapeHtml(new Date(message.createdAt).toLocaleTimeString())}</time></div>
    <p>${escapeHtml(message.text)}</p>
  </article>`;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", storage: "in-memory-prototype" });
});

app.get("/api/rooms/:roomId/messages", (req, res) => {
  const messages = roomMessages(req.params.roomId);
  if (req.get("HX-Request") === "true") {
    const html = messages.length
      ? messages.map(renderMessage).join("")
      : '<p class="empty-state">No messages yet. Start the conversation.</p>';
    return res.type("html").send(html);
  }
  res.json({ roomId: req.params.roomId, messages });
});

app.post("/api/rooms/:roomId/messages", (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  const author = typeof req.body?.author === "string" ? req.body.author.trim().slice(0, 60) : "You";

  if (!text) return res.status(400).json({ error: "Message text is required." });
  if (text.length > 4000) return res.status(413).json({ error: "Message must be 4000 characters or fewer." });

  const message = {
    id: crypto.randomUUID(),
    roomId: req.params.roomId,
    author: author || "You",
    text,
    createdAt: new Date().toISOString()
  };
  roomMessages(req.params.roomId).push(message);

  if (req.get("HX-Request") === "true") {
    return res.status(201).type("html").send(renderMessage(message));
  }
  res.status(201).json({ message });
});

app.get("/", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f4f7fb">
  <title>metaChat — Simple, focused conversations</title>
  <link rel="stylesheet" href="/styles.css">
  <script src="/vendor/htmx.min.js" defer></script>
</head>
<body>
  <main class="app-shell">
    <header class="app-header">
      <div><p class="eyebrow">PRIVATE BY DESIGN</p><h1>metaChat</h1><p class="header-copy">A calmer space for conversation.</p></div>
      <span class="status-pill">Prototype</span>
    </header>
    <section class="chat-card" aria-label="Chat room">
      <div class="room-heading"><div class="avatar" aria-hidden="true">M</div><div><h2>General room</h2><p>Demo conversation</p></div></div>
      <div id="chat-window" class="message-list" aria-live="polite"
        hx-get="/api/rooms/general/messages" hx-trigger="load" hx-swap="innerHTML">
        <p class="empty-state">Loading messages…</p>
      </div>
      <div id="message-composer-root"></div>
      <noscript><p class="notice">This prototype requires JavaScript enabled.</p></noscript>
    </section>
    <footer>Demo only · messages are held in server memory and disappear when the server restarts.</footer>
  </main>
  <script type="module" src="/assets/ChatWindow.js"></script>
  <script type="module" src="/assets/MessageComposer.js"></script>
</body>
</html>`);
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled request error:", err);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`metaChat listening on http://localhost:${port}`);
});
