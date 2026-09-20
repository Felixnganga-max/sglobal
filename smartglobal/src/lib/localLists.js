import { getProductImage, FALLBACK_IMG } from "./useProducts";

/**
 * Tiny localStorage-backed list that any component can subscribe to with
 * useSyncExternalStore. No provider needed, and every component (and every
 * browser tab) stays in sync.
 */
export function createListStore(key) {
  const listeners = new Set();

  const read = () => {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  let snapshot = typeof window === "undefined" ? [] : read();
  const emit = () => listeners.forEach((listener) => listener());

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === key) {
        snapshot = read();
        emit();
      }
    });
  }

  return {
    subscribe(callback) {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    getSnapshot: () => snapshot,
    set(next) {
      snapshot = next;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* storage full or blocked: the in-memory list still works */
      }
      emit();
    },
  };
}

// Stable reference for the server snapshot of useSyncExternalStore.
export const EMPTY_LIST = [];

/** The few product fields the wishlist / recently-viewed lists need. */
export function toSnapshot(product) {
  const image = getProductImage(product);
  return {
    id: product._id || product.id,
    title: product.title || product.name || "Product",
    image: image && image !== FALLBACK_IMG ? image : "",
    price: product.totalPrice ?? product.price ?? 0,
    category: product.category || "",
  };
}
