import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, Heart, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { useCart } from "../context/Cartcontext";
import { useWishlist, removeFromWishlist } from "../lib/useWishlist";
import { FALLBACK_IMG } from "../lib/useProducts";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A–Z" },
];

const CSS = `
  .ns-bar { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
  .ns-search { position: relative; flex: 1 1 200px; min-width: 0; }
  .ns-search input {
    width: 100%; padding: 0.85rem 3rem 0.85rem 1.25rem; border-radius: 999px; border: 1px solid transparent;
    background: #fff; font-family: var(--font-body); font-size: 0.8rem; color: var(--color-text);
    box-shadow: 0 1px 2px rgba(1,0,40,0.04), 0 8px 24px rgba(1,0,40,0.05);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ns-search input::placeholder { color: #9ca3af; }
  .ns-search input:focus { outline: none; border-color: var(--color-blue); box-shadow: 0 0 0 3px rgba(1,0,40,0.1); }
  .ns-search-ico { position: absolute; right: 1.1rem; top: 50%; transform: translateY(-50%); color: var(--color-muted); pointer-events: none; }

  .ns-controls { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

  .ns-pill {
    display: inline-flex; align-items: center; gap: 6px; height: 44px; padding: 0 1rem; border-radius: 999px;
    border: 1px solid transparent; background: #fff; cursor: pointer; white-space: nowrap;
    font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; color: var(--color-text);
    box-shadow: 0 1px 2px rgba(1,0,40,0.04), 0 8px 24px rgba(1,0,40,0.05);
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }
  .ns-pill:hover { border-color: var(--color-blue); }
  .ns-pill:focus-visible, .ns-select select:focus-visible, .ns-search input:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }
  .ns-pill.on { background: var(--color-blue); color: #fff; }

  .ns-select { position: relative; }
  .ns-select select {
    appearance: none; -webkit-appearance: none; height: 44px; padding: 0 2.2rem 0 1rem; border-radius: 999px;
    border: 1px solid transparent; background: #fff; cursor: pointer;
    font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; color: var(--color-text);
    box-shadow: 0 1px 2px rgba(1,0,40,0.04), 0 8px 24px rgba(1,0,40,0.05);
  }
  .ns-select select:hover { border-color: var(--color-blue); }
  .ns-select.on select { background: var(--color-blue); color: #fff; }
  .ns-select svg { position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--color-muted); }
  .ns-select.on svg { color: #fff; }

  .ns-icon-btn { width: 44px; padding: 0; justify-content: center; position: relative; }
  .ns-badge {
    position: absolute; top: -3px; right: -3px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px;
    background: var(--color-red); color: #fff; font-size: 0.6rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; border: 2px solid #f5f6fb;
  }
  .ns-only-mobile { display: inline-flex; }
  @media (min-width: 1024px) { .ns-only-mobile { display: none; } }
  .ns-hide-xl { display: inline-flex; }
  @media (min-width: 1280px) { .ns-hide-xl { display: none; } }
  @media (max-width: 639px) { .ns-wish-label { display: none; } .ns-wish-btn { width: 44px; padding: 0; justify-content: center; } }

  .ns-wish { position: relative; }
  .ns-wish-panel {
    position: absolute; right: 0; top: calc(100% + 8px); z-index: 50; width: min(340px, 90vw);
    background: #fff; border-radius: 20px; padding: 0.75rem;
    box-shadow: 0 4px 8px rgba(1,0,40,0.06), 0 24px 48px rgba(1,0,40,0.16);
  }
  .ns-wish-head { font-family: var(--font-heading); font-weight: 700; font-size: 0.85rem; color: var(--color-blue); padding: 0.25rem 0.5rem 0.5rem; }
  .ns-wish-list { list-style: none; margin: 0; padding: 0; max-height: 320px; overflow-y: auto; }
  .ns-wish-row { display: flex; align-items: center; gap: 10px; padding: 0.4rem 0.5rem; border-radius: 14px; }
  .ns-wish-row:hover { background: #f3f4f8; }
  .ns-wish-thumb { width: 44px; height: 44px; border-radius: 12px; background: #f3f4f8; object-fit: contain; flex-shrink: 0; }
  .ns-wish-link { flex: 1; min-width: 0; text-decoration: none; }
  .ns-wish-title { display: block; font-family: var(--font-body); font-size: 0.72rem; font-weight: 600; color: var(--color-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ns-wish-price { display: block; font-family: var(--font-body); font-size: 0.68rem; font-weight: 700; color: var(--color-blue); }
  .ns-wish-x { border: none; background: transparent; cursor: pointer; color: #9ca3af; padding: 6px; border-radius: 50%; }
  .ns-wish-x:hover { color: var(--color-red); background: #fdecec; }
  .ns-wish-empty { font-family: var(--font-body); font-size: 0.72rem; color: var(--color-muted); padding: 0.5rem; line-height: 1.5; }

  .ns-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-top: 0.75rem; }
  .ns-chip {
    display: inline-flex; align-items: center; gap: 6px; padding: 4px 6px 4px 12px; border-radius: 999px;
    background: var(--color-blue-tint); color: var(--color-blue);
    font-family: var(--font-body); font-size: 0.7rem; font-weight: 600;
  }
  .ns-chip button { display: flex; border: none; background: rgba(1,0,40,0.08); border-radius: 50%; padding: 3px; cursor: pointer; color: inherit; }
  .ns-chip button:hover { background: var(--color-blue); color: #fff; }
  .ns-clear { border: none; background: transparent; cursor: pointer; font-family: var(--font-body); font-size: 0.7rem; font-weight: 700; color: var(--color-red); text-decoration: underline; margin-left: 0.25rem; }
`;

export default function ProductToolbar({ onOpenCategories, onOpenCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { totalItems } = useCart();
  const { items: wishItems, count: wishCount } = useWishlist();

  const urlQ = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const inStock = searchParams.get("inStock") === "true";

  const [queryInput, setQueryInput] = useState(urlQ);
  const [wishOpen, setWishOpen] = useState(false);

  // pushedRef = the q value we believe is currently in the URL. It lets the
  // box follow q when something else changes it (e.g. a brand click in the
  // sidebar) without fighting the debounce while the shopper is typing.
  const pushedRef = useRef(urlQ);
  const paramsRef = useRef(searchParams);
  paramsRef.current = searchParams;
  const wishRef = useRef(null);

  useEffect(() => {
    if (urlQ !== pushedRef.current) {
      pushedRef.current = urlQ;
      setQueryInput(urlQ);
    }
  }, [urlQ]);

  // Debounce the search box before pushing it into the URL / triggering a fetch.
  useEffect(() => {
    const handle = setTimeout(() => {
      const next = queryInput.trim();
      if (next === pushedRef.current) return;
      pushedRef.current = next;
      const params = new URLSearchParams(paramsRef.current);
      if (next) params.set("q", next);
      else params.delete("q");
      params.delete("page");
      setSearchParams(params);
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInput]);

  // Close the wishlist menu on outside click / Escape.
  useEffect(() => {
    if (!wishOpen) return;
    const onDown = (e) => {
      if (wishRef.current && !wishRef.current.contains(e.target))
        setWishOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setWishOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [wishOpen]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === undefined || value === "" || value === false) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    params.delete("page");
    setSearchParams(params);
  };

  const clearQuery = () => {
    setQueryInput("");
    pushedRef.current = "";
    updateParam("q", undefined);
  };

  const clearAll = () => {
    setQueryInput("");
    pushedRef.current = "";
    setSearchParams({});
  };

  const activeFilters = [
    category !== "all" && { key: "category", label: category },
    inStock && { key: "inStock", label: "In stock only" },
  ].filter(Boolean);

  const hasFilters =
    activeFilters.length > 0 || urlQ || queryInput.trim() || sort !== "newest";

  return (
    <div>
      <style>{CSS}</style>

      <div className="ns-bar">
        <button
          type="button"
          className="ns-pill ns-icon-btn ns-only-mobile"
          onClick={onOpenCategories}
          aria-label="Browse categories"
        >
          <Menu size={18} />
        </button>

        <div className="ns-search">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search for products, brands and more..."
            aria-label="Search products"
          />
          <Search size={17} className="ns-search-ico" />
        </div>

        <div className="ns-controls">
          <div className={`ns-select${sort !== "newest" ? " on" : ""}`}>
            <select
              value={sort}
              onChange={(e) =>
                updateParam(
                  "sort",
                  e.target.value === "newest" ? undefined : e.target.value,
                )
              }
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} />
          </div>

          <button
            type="button"
            className={`ns-pill${inStock ? " on" : ""}`}
            aria-pressed={inStock}
            onClick={() => updateParam("inStock", !inStock)}
          >
            In stock
          </button>

          <div className="ns-wish" ref={wishRef}>
            <button
              type="button"
              className="ns-pill ns-wish-btn"
              onClick={() => setWishOpen((v) => !v)}
              aria-expanded={wishOpen}
              aria-label={`Wishlist, ${wishCount} saved`}
              style={{ position: "relative" }}
            >
              <Heart size={16} />
              <span className="ns-wish-label">Wishlist</span>
              {wishCount > 0 && <span className="ns-badge">{wishCount}</span>}
            </button>

            {wishOpen && (
              <div
                className="ns-wish-panel"
                role="dialog"
                aria-label="Saved products"
              >
                <div className="ns-wish-head">Wishlist ({wishCount})</div>
                {wishItems.length === 0 ? (
                  <p className="ns-wish-empty">
                    Nothing saved yet. Tap the heart on any product to keep it
                    here.
                  </p>
                ) : (
                  <ul className="ns-wish-list">
                    {wishItems.map((item) => (
                      <li key={item.id} className="ns-wish-row">
                        <img
                          className="ns-wish-thumb"
                          src={item.image || FALLBACK_IMG}
                          alt=""
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMG;
                          }}
                        />
                        <Link
                          to={`/product/${item.id}`}
                          className="ns-wish-link"
                          onClick={() => setWishOpen(false)}
                        >
                          <span className="ns-wish-title">{item.title}</span>
                          <span className="ns-wish-price">
                            KSh {Number(item.price).toLocaleString()}
                          </span>
                        </Link>
                        <button
                          type="button"
                          className="ns-wish-x"
                          onClick={() => removeFromWishlist(item.id)}
                          aria-label={`Remove ${item.title} from wishlist`}
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="ns-pill ns-icon-btn ns-hide-xl"
            onClick={onOpenCart}
            aria-label={`Open cart, ${totalItems} items`}
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && <span className="ns-badge">{totalItems}</span>}
          </button>
        </div>
      </div>

      {hasFilters && (
        <div className="ns-chips">
          {urlQ && (
            <span className="ns-chip">
              {`"${urlQ}"`}
              <button
                type="button"
                onClick={clearQuery}
                aria-label={`Remove search "${urlQ}"`}
              >
                <X size={11} />
              </button>
            </span>
          )}
          {activeFilters.map((f) => (
            <span key={f.key} className="ns-chip">
              {f.label}
              <button
                type="button"
                onClick={() => updateParam(f.key, undefined)}
                aria-label={`Remove ${f.label} filter`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <button type="button" onClick={clearAll} className="ns-clear">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
