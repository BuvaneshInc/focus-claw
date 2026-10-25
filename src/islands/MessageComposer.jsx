import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function MessageComposer() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const messageText = text.trim();
    if (!messageText || sending) return;

    setSending(true);
    setStatus("");
    try {
      const response = await fetch("/api/rooms/general/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: messageText, author: "You" })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to send message.");

      setText("");
      window.dispatchEvent(new CustomEvent("metaChat:newMessage", { detail: payload.message }));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "A network error occurred.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="composer" onSubmit={submit}>
      <label className="sr-only" htmlFor="message-text">Write a message</label>
      <textarea id="message-text" name="text" rows="2" maxLength="4000"
        value={text} onChange={(event) => setText(event.target.value)}
        placeholder="Write a message…" required />
      <div className="composer__bottom">
        <span className="form-status" role="status">{status}</span>
        <span className="character-count">{text.length}/4000</span>
        <button type="submit" disabled={sending || !text.trim()}>
          {sending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

const target = document.querySelector("#message-composer-root");
if (target) createRoot(target).render(<MessageComposer />);
