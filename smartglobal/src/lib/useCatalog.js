import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../api/config";
import { PRODUCT_CATEGORIES } from "./categories";

/**
 * One shared fetch of the product catalogue (the same
 * `${API_BASE_URL}/products?limit=200` request HeroPromo and ShopByCategory
 * each made on their own). Every component that calls useCatalog() on the
 * page now shares a single request, cached for a minute.
 */
const CATALOG_URL = `${API_BASE_URL}/products?limit=200`;
const TTL_MS = 60 * 1000;

let cached = null; // { list, at }
let inflight = null;

function normalize(data) {
  if (data && data.success) return data.data || [];
  return Array.isArray(data) ? data : [];
}

export function loadCatalog() {
  if (cached && Date.now() - cached.at < TTL_MS) {
    return Promise.resolve(cached.list);
  }
  if (inflight) return inflight;
  inflight = fetch(CATALOG_URL)
    .then((r) => r.json())
    .then((data) => {
      const list = normalize(data);
      cached = { list, at: Date.now() };
      return list;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useCatalog() {
  const [state, setState] = useState(() => ({
    products: cached ? cached.list : [],
    loading: !cached,
  }));

  useEffect(() => {
    let active = true;
    loadCatalog()
      .then((list) => active && setState({ products: list, loading: false }))
      .catch(() => active && setState({ products: [], loading: false }));
    return () => {
      active = false;
    };
  }, []);

  return state;
}

/**
 * Categories in the canonical (backend) order, filtered down to the ones that
 * actually have products right now, with any unrecognised category appended
 * at the end. Same rule ShopByCategory always used, plus a product count.
 */
export function useCategoryList() {
  const { products, loading } = useCatalog();

  const data = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const cat = p.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const present = new Set(Object.keys(counts));
    const ordered = PRODUCT_CATEGORIES.filter((c) => present.has(c));
    PRODUCT_CATEGORIES.forEach((c) => present.delete(c));
    return {
      categories: [...ordered, ...present],
      counts,
      total: products.length,
    };
  }, [products]);

  return { ...data, loading };
}
