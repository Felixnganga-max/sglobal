import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../../lib/useProducts";
import { isPriority, isCubes, mixPriority } from "../../lib/priorityMix";
import ProductTile from "../ProductTile";
import { assets } from "../../assets/assets";

const DEALS_COUNT = 6; // ~50% cubes (3), the rest Kent/Spuds first
const SLIDE_MS = 6000; // each new slide appears after 6 seconds
const FADE_MS = 350;

// One poster per slide, filling the whole panel
const SLIDES = [
  { image: assets.newcubs, caption: "Hot deals this week" },
  { image: assets.bst, caption: "Best picks, best prices" },
  { image: assets.st, caption: "Grab yours while stocks last" },
].filter((s) => s.image);

// Poster fit inside the panel:
//   "contain" = whole poster visible, edge to edge on its long side (nothing cut)
//   "cover"   = poster fills every pixel of the panel (edges may be cropped)
const IMAGE_FIT = "contain";

const CSS = `
  .bd-panel {
    position: relative; overflow: hidden;
    min-height: 380px; height: 100%;
    border-radius: 20px;
    background: linear-gradient(160deg, var(--color-orange) 0%, var(--color-orange-dark) 100%);
    box-shadow: 0 12px 32px rgba(217, 104, 0, 0.3);
  }

  /* Blurred copy fills any space the poster doesn't cover */
  .bd-bg {
    position: absolute; inset: -30px; z-index: 0;
    width: calc(100% + 60px); height: calc(100% + 60px);
    object-fit: cover; filter: blur(28px) saturate(1.25); opacity: 0.9;
    transition: opacity 0.35s ease;
  }
  .bd-bg.fade-out { opacity: 0; }

  /* Poster takes the entire panel — no padding */
  .bd-img-wrap {
    position: absolute; inset: 0; z-index: 0;
  }
  .bd-img {
    width: 100%; height: 100%; object-fit: ${IMAGE_FIT}; object-position: center;
    display: block;
    transition: opacity 0.35s ease, transform 0.35s ease;
  }
  .bd-img.fade-out { opacity: 0; transform: scale(1.03); }
  @media (prefers-reduced-motion: reduce) {
    .bd-img, .bd-bg { transition: none; }
  }

  /* Warm fade at the bottom so the caption and button stay readable */
  .bd-overlay {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background: linear-gradient(180deg,
      rgba(70,30,0,0) 55%,
      rgba(70,30,0,0.5) 78%,
      rgba(70,30,0,0.85) 100%);
  }

  .bd-badge {
    position: absolute; top: 14px; left: 14px; z-index: 3;
    display: inline-flex; align-items: center; gap: 6px;
    padding: 0.35rem 0.8rem; border-radius: 9999px;
    background: #FFD41D; color: #1a1a1a;
    font-family: var(--font-body); font-size: 0.62rem; font-weight: 900;
    letter-spacing: 0.1em; text-transform: uppercase;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  }

  .bd-content {
    position: absolute; left: 0; right: 0; bottom: 0; z-index: 2;
    padding: 1.25rem 1.25rem 2.75rem;
  }
  .bd-title {
    font-family: var(--font-heading); font-weight: 700; color: #fff;
    font-size: clamp(1.3rem, 2.2vw, 1.7rem); line-height: 1.15; margin: 0 0 12px;
    text-shadow: 0 2px 16px rgba(0,0,0,0.4);
  }

  .bd-dotnav {
    position: absolute; left: 0; right: 0; bottom: 14px; z-index: 3;
    display: flex; justify-content: center; gap: 6px;
  }
  .bd-dot {
    width: 8px; height: 8px; border-radius: 999px; border: none; padding: 0; cursor: pointer;
    background: rgba(255,255,255,0.55); transition: all 0.3s ease;
  }
  .bd-dot.active { width: 24px; background: #FFD41D; }
`;

export default function BestDeals() {
  const { products, loading } = useProducts();
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);

  // Preload all slides so transitions never flash
  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  // Wait SLIDE_MS, fade out, swap slide, fade in. Restarts after any manual
  // click (idx changes) and holds while the mouse is over the panel.
  useEffect(() => {
    if (paused || SLIDES.length < 2) return;
    let fadeTimer;
    const waitTimer = setTimeout(() => {
      setAnimating(true);
      fadeTimer = setTimeout(() => {
        setIdx((i) => (i + 1) % SLIDES.length);
        setAnimating(false);
      }, FADE_MS);
    }, SLIDE_MS);
    return () => {
      clearTimeout(waitTimer);
      clearTimeout(fadeTimer);
    };
  }, [idx, paused]);

  const slide = SLIDES[idx];

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
      <style>{CSS}</style>

      <div className="mb-6 text-center">
        <p className="text-eyebrow mb-1">Limited Time</p>
        <h2 className="text-section-title text-gray-900">Best Deals</h2>
        <div className="section-rule-center mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Hot deals carousel panel */}
        {slide && (
          <div
            className="bd-panel"
            aria-label="Hot deals promo"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className={`bd-bg${animating ? " fade-out" : ""}`}
            />
            <div className="bd-img-wrap">
              <img
                key={idx}
                src={slide.image}
                alt={slide.caption}
                decoding="async"
                className={`bd-img${animating ? " fade-out" : ""}`}
              />
            </div>
            <div className="bd-overlay" aria-hidden="true" />

            <span className="bd-badge">🔥 Hot Deals</span>

            <div className="bd-content">
              <h3 className="bd-title">{slide.caption}</h3>
              <Link
                to="/products"
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.7rem",
                  padding: "0.65rem 1.4rem",
                }}
              >
                Shop now <ArrowRight size={13} />
              </Link>
            </div>

            {SLIDES.length > 1 && (
              <div className="bd-dotnav">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`bd-dot${i === idx ? " active" : ""}`}
                    onClick={() => {
                      setIdx(i);
                      setAnimating(false);
                    }}
                    aria-label={`Slide ${i + 1}`}
                    aria-current={i === idx}
                  />
                ))}
              </div>
            )}
          </div>
        )}

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