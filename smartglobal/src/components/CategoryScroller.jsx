import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categorySlug } from "../lib/categories";

const PASTELS = {
  "Craft cooked potato chips": "#fdeccf",
  "Kent sauces": "#fde0e0",
  "Kent syrups": "#fbe3d2",
  "Just fruits": "#dcefc9",
  Hazelnuts: "#f1e4d8",
  Cakemix: "#fdf1c9",
  Water: "#d6eef7",
};

const CSS = `
  .sg-cat-row {
    display: flex; gap: 0.75rem; overflow-x: auto; scroll-snap-type: x mandatory;
    scrollbar-width: none; -ms-overflow-style: none; padding-bottom: 2px;
  }
  .sg-cat-row::-webkit-scrollbar { display: none; }
  .sg-cat-item {
    flex: 0 0 calc((100% - 0.75rem * 2.4) / 2.4);
    scroll-snap-align: start; display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  }
  .sg-cat-img {
    position: relative; width: 100%; aspect-ratio: 1 / 1; overflow: hidden; border-radius: 16px;
    transition: transform .3s ease, box-shadow .3s ease;
  }
  .sg-cat-item:hover .sg-cat-img { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(0,0,0,.12); }
  .sg-cat-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
  .sg-cat-name {
    font-family: var(--font-body); font-weight: 500; font-size: 0.8rem; line-height: 1.25;
    color: #1f2937; text-align: center;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  @media (min-width: 640px)  { .sg-cat-row { gap: 1rem; } .sg-cat-item { flex-basis: calc((100% - 1rem * 3.4) / 3.4); } .sg-cat-name { font-size: 0.9rem; } }
  @media (min-width: 768px)  { .sg-cat-item { flex-basis: calc((100% - 1rem * 4.4) / 4.4); } }
  @media (min-width: 1024px) { .sg-cat-row { gap: 1.25rem; } .sg-cat-item { flex-basis: calc((100% - 1.25rem * 5) / 6); } .sg-cat-name { font-size: 1rem; } }
  @media (prefers-reduced-motion: reduce) { .sg-cat-img { transition: none; } .sg-cat-item:hover .sg-cat-img { transform: none; } }
`;

export default function CategoryScroller({ categories }) {
  const rowRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, categories.length]);

  const scrollBy = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrowCls =
    "w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-gray-200";

  return (
    <>
      <style>{CSS}</style>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="font-heading text-gray-900 font-bold text-xl sm:text-3xl">
          Shop by category
        </h2>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous categories" disabled={!canPrev} onClick={() => scrollBy(-1)} className={arrowCls}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" aria-label="Next categories" disabled={!canNext} onClick={() => scrollBy(1)} className={arrowCls}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={rowRef} onScroll={update} className="sg-cat-row">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products#cat-${categorySlug(cat.id)}`}
            aria-label={`Shop ${cat.title}`}
            className="sg-cat-item"
          >
            <div
              className="sg-cat-img"
              style={{ backgroundColor: PASTELS[cat.id] || "#f3f4f6" }}
            >
              {cat.image && (
                <img loading="lazy" decoding="async" src={cat.image} alt="" />
              )}
            </div>
            <span className="sg-cat-name">{cat.title}</span>
          </Link>
        ))}
      </div>
    </>
  );
}