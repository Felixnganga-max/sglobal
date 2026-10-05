import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "../../lib/useProducts";
import { isPriority, isCubes, mixPriority } from "../../lib/priorityMix";
import ProductTile from "../ProductTile";
import assets from "../../assets/assets";

const DEALS_COUNT = 6; // ~50% cubes (3), the rest Kent/Spuds first
const SLIDE_MS = 3500;

// Each asset is a full-size slide in the red panel carousel
const SLIDES = [
  { img: assets.best, alt: "Best deals", tag: "Hot Deal", line: "Grab it before it's gone" },
  { img: assets.bst, alt: "Best buys", tag: "Best Price", line: "Stock up and save" },
  { img: assets.st, alt: "Special offers", tag: "While Stocks Last", line: "Limited time only" },
].filter((s) => s.img);

export default function BestDeals() {
  const { products, loading } = useProducts();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance; resets whenever the slide changes (including manual clicks)
  useEffect(() => {
    if (paused || SLIDES.length < 2) return;
    const id = setInterval(
      () => setSlide((s) => (s + 1) % SLIDES.length),
      SLIDE_MS,
    );
    return () => clearInterval(id);
  }, [paused, slide]);

  const go = (i) => setSlide((i + SLIDES.length) % SLIDES.length);

  // Badged products first; unbadged cubes and Kent/Spuds follow so the grid
  // still fills with them when few carry a badge. mixPriority then puts
  // cubes at ~50% of the slots and fills the rest with Kent/Spuds.
  const pool = [
    ...products.filter((p) => p.badge),
    ...products.filter((p) => !p.badge && (isCubes(p) || isPriority(p))),
  ];
  const deals = mixPriority(pool, DEALS_COUNT);

  if (!loading && deals.length === 0) return null;

  return (
    <section className="page-x section-y bg-soft">
      <div className="mb-6 text-center">
        <p className="text-eyebrow mb-1">Limited Time</p>
        <h2 className="text-section-title text-gray-900">Best Deals</h2>
        <div className="section-rule-center mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Hot deals carousel panel */}
        <div
          className="relative overflow-hidden rounded-2xl flex flex-col"
          style={{
            background:
              "linear-gradient(160deg, var(--color-red) 0%, var(--color-red-dark) 100%)",
            minHeight: "380px",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Link to="/products" className="group flex-1 flex flex-col p-4">
            {/* Header */}
            <div className="flex items-center gap-2 px-1 pb-3">
              <Flame className="w-6 h-6 text-white animate-pulse" />
              <h3 className="font-heading text-white text-base font-bold leading-tight uppercase tracking-wide">
                Hot Deals This Week
              </h3>
            </div>

            {/* Slides — one big asset at a time, filling the space */}
            <div className="relative flex-1 min-h-[260px] rounded-xl overflow-hidden bg-black/20 shadow-xl">
              {SLIDES.map((s, i) => (
                <div
                  key={s.alt}
                  aria-hidden={i !== slide}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                  style={{
                    opacity: i === slide ? 1 : 0,
                    pointerEvents: i === slide ? "auto" : "none",
                  }}
                >
                  {/* Blurred copy fills the whole slide so no red gaps show */}
                  <img
                    aria-hidden="true"
                    src={s.img}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-70"
                  />
                  {/* The poster itself: as big as possible, never cropped */}
                  <div className="absolute inset-0 pt-11 pb-24 px-4 flex items-center justify-center">
                    <img
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      src={s.img}
                      alt={s.alt}
                      className="w-full h-full object-contain rounded-lg drop-shadow-2xl transition-transform duration-[4000ms] ease-out"
                      style={{ transform: i === slide ? "scale(1.04)" : "scale(0.98)" }}
                    />
                  </div>
                  {/* Salesy overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 pt-10 bg-gradient-to-t from-black/75 via-black/30 to-transparent">
                    <p className="font-heading text-white text-sm font-bold leading-tight">
                      {s.line}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white text-[0.62rem] font-body font-black uppercase tracking-widest px-3 py-1.5 group-hover:bg-yellow-300 transition-colors"
                      style={{ color: "var(--color-red)" }}
                    >
                      Shop Now
                      <svg
                        className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                  <span
                    className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-widest shadow-lg"
                    style={{ backgroundColor: "#FFD41D", color: "#1a1a1a" }}
                  >
                    🔥 {s.tag}
                  </span>
                </div>
              ))}
            </div>
          </Link>

          {/* Controls (outside the Link so clicks don't navigate) */}
          {SLIDES.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous deal"
                onClick={() => go(slide - 1)}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/85 hover:bg-white shadow-md transition-all hover:scale-110"
              >
                <ChevronLeft size={16} className="text-gray-900" />
              </button>
              <button
                type="button"
                aria-label="Next deal"
                onClick={() => go(slide + 1)}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/85 hover:bg-white shadow-md transition-all hover:scale-110"
              >
                <ChevronRight size={16} className="text-gray-900" />
              </button>
              <div className="flex justify-center gap-1.5 pb-3">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.alt}
                    type="button"
                    aria-label={`Show deal ${i + 1}`}
                    onClick={() => go(i)}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === slide ? 22 : 8,
                      backgroundColor:
                        i === slide ? "#fff" : "rgba(255,255,255,0.45)",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Deals grid */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {loading
            ? [...Array(DEALS_COUNT)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 animate-pulse"
                  style={{ height: 220 }}
                />
              ))
            : deals.map((p) => (
                <ProductTile key={p._id || p.id} product={p} />
              ))}
        </div>
      </div>
    </section>
  );
}