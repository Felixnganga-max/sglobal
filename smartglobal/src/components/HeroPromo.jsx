import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCatalog } from "../lib/useCatalog";

function scrollToProducts() {
  const el = document.getElementById("featured-products");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollBy({ top: window.innerHeight * 0.75, behavior: "smooth" });
  }
}

function getImage(product) {
  if (!product) return null;
  if (product.image?.url) return product.image.url;
  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    const url = typeof first === "string" ? first : first?.url;
    if (url) return url;
  }
  return product.imageUrl || product.img || product.photo || null;
}

// Picks up to `count` distinct products, preferring one per category first
// (for variety) and backfilling with leftover products so the hero always
// has enough items to rotate through, even if the catalog is currently
// concentrated in just a couple of categories.
function pickDiverse(products, count = 6) {
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  const picked = [];
  const seenIds = new Set();
  const seenCats = new Set();

  shuffled.forEach((p) => {
    if (picked.length >= count) return;
    const cat = p.category || "Other";
    if (seenCats.has(cat)) return;
    seenCats.add(cat);
    seenIds.add(p._id || p.id);
    picked.push(p);
  });

  if (picked.length < count) {
    shuffled.forEach((p) => {
      if (picked.length >= count) return;
      const id = p._id || p.id;
      if (seenIds.has(id)) return;
      seenIds.add(id);
      picked.push(p);
    });
  }

  return picked;
}

const CSS = `
  .ns-hero {
    position: relative; overflow: hidden; display: flex; align-items: center;
    min-height: 300px; border-radius: 24px;
    background-color: var(--color-blue);
    box-shadow: 0 12px 32px rgba(1,0,40,0.22);
  }
  @media (max-width: 640px) { .ns-hero { min-height: 250px; border-radius: 20px; } }

  /* flat dot texture + soft circles (no gradients) */
  .ns-hero-dots {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 22px 22px;
  }
  .ns-blob { position: absolute; border-radius: 50%; pointer-events: none; }
  .ns-blob.b1 { width: 380px; height: 380px; right: -70px; bottom: -150px; background: var(--color-blue-light); opacity: 0.55; }
  .ns-blob.b2 { width: 96px; height: 96px; right: 22%; bottom: -30px; background: var(--color-red); }
  .ns-blob.b3 { width: 44px; height: 44px; right: 8%; top: 26px; background: var(--color-orange); }
  @media (max-width: 640px) { .ns-blob.b2 { display: none; } }

  .ns-hero-content {
    position: relative; z-index: 2; max-width: 54%;
    padding: clamp(1.25rem, 3vw, 2.25rem) clamp(1.25rem, 3vw, 2.5rem) 2.75rem;
  }
  @media (max-width: 640px) { .ns-hero-content { max-width: 58%; padding-right: 0.5rem; } }

  .ns-hero-pill {
    display: inline-flex; align-items: center; gap: 6px; margin-bottom: 14px;
    padding: 4px 12px; border-radius: 999px;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.28);
    backdrop-filter: blur(6px);
    font-family: var(--font-body); font-size: 0.65rem; font-weight: 600; color: #fff;
  }
  .ns-hero-pill.gold { background: rgba(255,212,29,0.18); border-color: rgba(255,212,29,0.45); color: #FFD41D; }
  .ns-hero-pill-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--color-orange);
    animation: ns-blink 1.2s ease-in-out infinite;
  }
  @keyframes ns-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
  @media (prefers-reduced-motion: reduce) { .ns-hero-pill-dot { animation: none; } }

  .ns-hero-title {
    font-family: var(--font-heading); font-weight: 700; color: #fff;
    font-size: clamp(1.5rem, 3.4vw, 2.4rem); line-height: 1.15; margin: 0 0 10px;
  }
  .ns-hero-sub {
    font-family: var(--font-body); font-size: clamp(0.68rem, 1.3vw, 0.8rem);
    line-height: 1.65; color: rgba(255,255,255,0.68); margin: 0 0 20px;
  }
  @media (max-width: 480px) { .ns-hero-sub { display: none; } }

  .ns-hero-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .ns-btn-ghost {
    display: inline-flex; align-items: center; padding: 0.65rem 1.3rem; border-radius: 9999px;
    background: transparent; border: 1px solid rgba(255,255,255,0.32); color: rgba(255,255,255,0.9);
    font-family: var(--font-body); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; cursor: pointer; transition: background 0.2s, border-color 0.2s;
  }
  .ns-btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.55); }

  .ns-hero-img-wrap {
    position: absolute; right: 0; top: 0; bottom: 0; width: 46%; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 1.25rem 1.5rem 2.5rem 0; pointer-events: none;
  }
  .ns-hero-img-link { display: block; width: 100%; height: 100%; pointer-events: auto; }
  .ns-hero-img {
    display: block; margin: 0 auto; height: 86%; width: auto; max-width: 100%; object-fit: contain;
    filter: drop-shadow(0 14px 26px rgba(0,0,0,0.4));
    transition: opacity 0.35s ease, transform 0.35s ease;
  }
  .ns-hero-img.fade-out { opacity: 0; transform: scale(0.95) translateX(10px); }
  @media (prefers-reduced-motion: reduce) { .ns-hero-img { transition: none; } }
  .ns-hero-img-skel {
    width: 160px; height: 160px; border-radius: 20px; background: rgba(255,255,255,0.08);
    animation: ns-hero-pulse 1.5s ease-in-out infinite;
  }

  .ns-hero-dotnav {
    position: absolute; left: 0; right: 0; bottom: 14px; z-index: 3;
    display: flex; justify-content: center; gap: 6px;
  }
  .ns-hero-dot {
    width: 8px; height: 8px; border-radius: 999px; border: none; padding: 0; cursor: pointer;
    background: rgba(255,255,255,0.35); transition: all 0.3s ease;
  }
  .ns-hero-dot.active { width: 24px; background: var(--color-orange); }

  @keyframes ns-hero-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  .ns-hero-skel { background: rgba(255,255,255,0.12); border-radius: 8px; animation: ns-hero-pulse 1.5s ease-in-out infinite; }
`;

export default function HeroPromo() {
  const { products: catalog, loading } = useCatalog();
  const [heroIdx, setHeroIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const products = useMemo(() => {
    if (!catalog.length) return [];
    const deduped = pickDiverse(catalog, 6);
    // Whichever product is flagged as the top seller is pinned to the
    // front so it's the first thing shown here.
    const bestSeller = catalog.find((p) => p.isBestSeller) || null;
    return bestSeller
      ? [
          bestSeller,
          ...deduped.filter(
            (p) => (p._id || p.id) !== (bestSeller._id || bestSeller.id),
          ),
        ]
      : deduped;
  }, [catalog]);

  useEffect(() => {
    if (products.length < 2) return;
    intervalRef.current = setInterval(() => {
      setAnimating(true);
      timeoutRef.current = setTimeout(() => {
        setHeroIdx((i) => (i + 1) % Math.min(products.length, 5));
        setAnimating(false);
      }, 350);
    }, 4000);
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [products]);

  const heroProducts = products.slice(0, 5);
  const hero = heroProducts[heroIdx] || null;
  const isBest = !!hero?.isBestSeller;

  return (
    <section aria-label="Hero promo" className="ns-hero">
      <style>{CSS}</style>
      <div className="ns-hero-dots" aria-hidden="true" />
      <div className="ns-blob b1" aria-hidden="true" />
      <div className="ns-blob b2" aria-hidden="true" />
      <div className="ns-blob b3" aria-hidden="true" />

      {/* Text */}
      <div className="ns-hero-content">
        {loading ? (
          <>
            <div
              className="ns-hero-skel"
              style={{
                height: 22,
                width: 110,
                borderRadius: 999,
                marginBottom: 14,
              }}
            />
            <div
              className="ns-hero-skel"
              style={{ height: 30, width: "85%", marginBottom: 8 }}
            />
            <div
              className="ns-hero-skel"
              style={{ height: 30, width: "60%", marginBottom: 16 }}
            />
            <div
              className="ns-hero-skel"
              style={{ height: 36, width: 130, borderRadius: 999 }}
            />
          </>
        ) : (
          <>
            <span className={`ns-hero-pill${isBest ? " gold" : ""}`}>
              {isBest ? (
                <span aria-hidden="true">⭐</span>
              ) : (
                <span className="ns-hero-pill-dot" />
              )}
              {isBest ? "Our #1 Best Seller" : hero?.category || "Featured"}
            </span>

            <h2 className="ns-hero-title">
              Premium food
              <br />
              products
            </h2>

            <p className="ns-hero-sub">
              Quality ingredients. Authentic flavours.
              <br />
              Delivered countrywide.
            </p>

            <div className="ns-hero-actions">
              {hero ? (
                <Link
                  to={`/product/${hero._id || hero.id}`}
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
              ) : (
                <button
                  type="button"
                  onClick={scrollToProducts}
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
                </button>
              )}
              {hero && (
                <button
                  type="button"
                  onClick={scrollToProducts}
                  className="ns-btn-ghost"
                >
                  Browse all
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Product image: tapping it goes straight to that exact product */}
      <div className="ns-hero-img-wrap">
        {loading ? (
          <div className="ns-hero-img-skel" />
        ) : hero && getImage(hero) ? (
          <Link
            to={`/product/${hero._id || hero.id}`}
            aria-label={`View ${hero.title || "this product"}`}
            className="ns-hero-img-link"
          >
            <img
              loading="lazy"
              decoding="async"
              key={heroIdx}
              src={getImage(hero)}
              alt={hero.title || "Featured product"}
              className={`ns-hero-img${animating ? " fade-out" : ""}`}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Link>
        ) : null}
      </div>

      {!loading && heroProducts.length > 1 && (
        <div className="ns-hero-dotnav">
          {heroProducts.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`ns-hero-dot${i === heroIdx ? " active" : ""}`}
              onClick={() => {
                setHeroIdx(i);
                setAnimating(false);
              }}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === heroIdx}
            />
          ))}
        </div>
      )}
    </section>
  );
}
