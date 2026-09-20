import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { useCategoryList } from "../lib/useCatalog";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from "../lib/categoryIcons";

// How many categories show before "More" (the mock shows five plus More).
const VISIBLE = 5;
// Soft washes taken from the brand: navy tint, red, orange, then neutrals.
const TINTS = ["#e9e9f3", "#fdecec", "#fff1e3", "#eef0fb", "#f1f2f6"];

const CSS = `
  .ns-strip-card {
    background: #fff; border-radius: 22px; padding: 1rem 0.75rem;
    box-shadow: 0 1px 2px rgba(1,0,40,0.04), 0 10px 30px rgba(1,0,40,0.05);
  }
  .ns-strip { display: flex; gap: 0.25rem; overflow-x: auto; scrollbar-width: none; }
  .ns-strip::-webkit-scrollbar { display: none; }
  .ns-strip.open {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
    row-gap: 1rem; overflow: visible;
  }
  .ns-strip-item {
    flex: 1 0 84px; display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 0; border: none; background: transparent; cursor: pointer;
  }
  .ns-strip-bubble {
    width: 54px; height: 54px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .ns-strip-item:hover .ns-strip-bubble { transform: translateY(-2px); }
  .ns-strip-item.active .ns-strip-bubble { box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--color-blue); }
  .ns-strip-label {
    font-family: var(--font-body); font-size: 0.68rem; font-weight: 600; line-height: 1.25;
    color: var(--color-text); text-align: center; max-width: 84px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .ns-strip-item.active .ns-strip-label { color: var(--color-blue); font-weight: 700; }
  @keyframes ns-strip-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
  .ns-strip-skel { animation: ns-strip-pulse 1.5s ease-in-out infinite; }
`;

export default function CategoryStrip() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, loading } = useCategoryList();
  const [open, setOpen] = useState(false);

  const active = searchParams.get("category") || null;
  const collapsible = categories.length > VISIBLE + 1;
  const shown =
    collapsible && !open ? categories.slice(0, VISIBLE) : categories;

  function pick(cat) {
    const params = new URLSearchParams(searchParams);
    if (active === cat) params.delete("category");
    else params.set("category", cat);
    params.delete("page");
    setSearchParams(params);
    document
      .getElementById("featured-products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!loading && categories.length === 0) return null;

  return (
    <section aria-label="Shop by category" className="ns-strip-card">
      <style>{CSS}</style>
      <div className={`ns-strip${open ? " open" : ""}`}>
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="ns-strip-item ns-strip-skel"
              aria-hidden="true"
            >
              <div
                className="ns-strip-bubble"
                style={{ background: "#f1f2f6" }}
              />
              <div
                style={{
                  height: 8,
                  width: 46,
                  borderRadius: 4,
                  background: "#f1f2f6",
                }}
              />
            </div>
          ))
        ) : (
          <>
            {shown.map((cat, i) => (
              <button
                key={cat}
                type="button"
                className={`ns-strip-item${active === cat ? " active" : ""}`}
                onClick={() => pick(cat)}
                aria-pressed={active === cat}
              >
                <span
                  className="ns-strip-bubble"
                  style={{ backgroundColor: TINTS[i % TINTS.length] }}
                  aria-hidden="true"
                >
                  {CATEGORY_ICONS[cat] || DEFAULT_CATEGORY_ICON}
                </span>
                <span className="ns-strip-label">{cat}</span>
              </button>
            ))}
            {collapsible && (
              <button
                type="button"
                className="ns-strip-item"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
              >
                <span
                  className="ns-strip-bubble"
                  style={{
                    backgroundColor: "#f1f2f6",
                    color: "var(--color-blue)",
                  }}
                  aria-hidden="true"
                >
                  <LayoutGrid size={20} />
                </span>
                <span className="ns-strip-label">{open ? "Less" : "More"}</span>
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
