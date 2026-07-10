import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { PRODUCT_CATEGORIES } from "../lib/categories";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A–Z" },
];

export default function ProductToolbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryInput, setQueryInput] = useState(searchParams.get("q") || "");

  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const inStock = searchParams.get("inStock") === "true";

  // Debounce the search box before pushing it into the URL / triggering a fetch.
  useEffect(() => {
    const handle = setTimeout(() => {
      const current = searchParams.get("q") || "";
      if (queryInput === current) return;
      const params = new URLSearchParams(searchParams);
      if (queryInput.trim()) params.set("q", queryInput.trim());
      else params.delete("q");
      params.delete("page");
      setSearchParams(params);
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInput]);

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

  const clearAll = () => {
    setQueryInput("");
    setSearchParams({});
  };

  const activeFilters = [
    category !== "all" && { key: "category", label: category },
    inStock && { key: "inStock", label: "In stock only" },
  ].filter(Boolean);

  const hasFilters = activeFilters.length > 0 || queryInput.trim() || sort !== "newest";

  return (
    <div
      className="bg-white rounded-2xl p-4 sm:p-5"
      style={{ border: "1px solid var(--color-border)" }}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--color-muted)" }}
          />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-bg-soft)",
            }}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal
            className="h-4 w-4 hidden sm:block"
            style={{ color: "var(--color-muted)" }}
          />
          <select
            value={category}
            onChange={(e) => updateParam("category", e.target.value === "all" ? undefined : e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm font-semibold focus:outline-none max-w-[9.5rem] sm:max-w-none"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-bg-soft)",
              color: "var(--color-text)",
            }}
          >
            <option value="all">All Categories</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm font-semibold focus:outline-none"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-bg-soft)",
              color: "var(--color-text)",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <label
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer select-none whitespace-nowrap"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: inStock ? "rgba(255,127,17,0.08)" : "var(--color-bg-soft)",
              color: inStock ? "var(--color-orange)" : "var(--color-text)",
            }}
          >
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => updateParam("inStock", e.target.checked)}
              className="accent-current"
            />
            In stock
          </label>
        </div>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {queryInput.trim() && (
            <FilterChip
              label={`"${queryInput.trim()}"`}
              onClear={() => setQueryInput("")}
            />
          )}
          {activeFilters.map((f) => (
            <FilterChip
              key={f.key}
              label={f.label}
              onClear={() => updateParam(f.key, undefined)}
            />
          ))}
          <button
            onClick={clearAll}
            className="text-xs font-bold underline ml-1"
            style={{ color: "var(--color-red)" }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onClear }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: "var(--color-bg-soft)",
        color: "var(--color-text)",
        border: "1px solid var(--color-border)",
      }}
    >
      {label}
      <button onClick={onClear} aria-label={`Remove ${label} filter`}>
        <X size={12} />
      </button>
    </span>
  );
}
