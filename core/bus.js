/**
 * Small in-process event bus for UI/core modules.
 * Payloads should contain identifiers and classification results, never message bodies.
 */
export function createBus() {
  const listeners = new Map();
  return Object.freeze({
    on(event, listener) {
      if (typeof listener !== "function") throw new TypeError("listener must be a function");
      const set = listeners.get(event) ?? new Set();
      set.add(listener);
      listeners.set(event, set);
      return () => {
        set.delete(listener);
        if (set.size === 0) listeners.delete(event);
      };
    },
    emit(event, payload) {
      for (const listener of listeners.get(event) ?? []) listener(payload);
    },
    clear() {
      listeners.clear();
    }
  });
}
