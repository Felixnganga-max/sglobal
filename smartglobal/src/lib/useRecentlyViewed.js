import { useSyncExternalStore } from "react";
import { createListStore, toSnapshot, EMPTY_LIST } from "./localLists";

const MAX_ITEMS = 8;
const store = createListStore("sg_recent");

/** Call when a shopper opens a product. Newest first, no duplicates. */
export function recordView(product) {
  if (!product) return;
  const snap = toSnapshot(product);
  if (!snap.id) return;
  const rest = store.getSnapshot().filter((item) => item.id !== snap.id);
  store.set([snap, ...rest].slice(0, MAX_ITEMS));
}

export function useRecentlyViewed() {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => EMPTY_LIST,
  );
}
