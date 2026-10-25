import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

function ChatWindowIsland() {
  useEffect(() => {
    const target = document.querySelector("#chat-window");
    if (!target) return undefined;

    const refreshMessages = () => {
      if (window.htmx) {
        window.htmx.ajax("GET", "/api/rooms/general/messages", {
          target,
          swap: "innerHTML"
        });
      }
    };

    window.addEventListener("metaChat:newMessage", refreshMessages);
    return () => window.removeEventListener("metaChat:newMessage", refreshMessages);
  }, []);

  return null;
}

const mount = document.createElement("div");
mount.hidden = true;
document.body.appendChild(mount);
createRoot(mount).render(<ChatWindowIsland />);
