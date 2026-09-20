import { useCallback, useSyncExternalStore } from "react";
import { createListStore, toSnapshot, EMPTY_LIST } from "./localLists";

// Persisted in localStorage under "sg_wishlist" (same naming as "sg_cart").
const store = createListStore("sg_wishlist");

/** Add the product if it isn't saved yet, remove it if it is. */
export function toggleWishlist(product) {
  const snap = toSnapshot(product);
  if (!snap.id) return;
  const current = store.getSnapshot();
  store.set(
    current.some((item) => item.id === snap.id)
      ? current.filter((item) => item.id !== snap.id)
      : [snap, ...current],
  );
}

export function removeFromWishlist(id) {
  store.set(store.getSnapshot().filter((item) => item.id !== id));
}

export function useWishlist() {
  const items = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => EMPTY_LIST,
  );
  const isSaved = useCallback(
    (id) => items.some((item) => item.id === id),
    [items],
  );
  return { items, count: items.length, isSaved };
}