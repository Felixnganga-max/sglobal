import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";

function scrollToProducts() {
  const el = document.getElementById("featured-products");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollBy({ top: window.innerHeight * 0.75, behavior: "smooth" });
  }
}

const API_URL = "https://sglobal-plf6.vercel.app/smartglobal/products";

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

function pickByCategory(products) {
  const map = new Map();
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  shuffled.forEach((p) => {
    const cat = p.category || "Other";
    if (!map.has(cat)) map.set(cat, p);
  });
  return Array.from(map.values());
}

function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else setVal(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <span>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

const TRUST_BADGES = [
  { icon: Truck, label: "Free Delivery", sub: "Over Ksh 5,000" },
  { icon: Shield, label: "Quality Assured", sub: "Premium products" },
  { icon: Zap, label: "Fast Processing", sub: "Same day dispatch" },
];

export default function HeroPromo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => {
        const list = data.success
          ? data.data || []
          : Array.isArray(data)
            ? data
            : [];
        setProducts(pickByCategory(list));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (products.length < 2) return;
    intervalRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setHeroIdx((i) => (i + 1) % Math.min(products.length, 5));
        setAnimating(false);
      }, 350);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [products]);

  const heroProducts = products.slice(0, 5);
  const hero = heroProducts[heroIdx] || null;
  const sideCards = products
    .slice(0, 4)
    .filter((_, i) => i !== heroIdx)
    .slice(0, 3);

  return (
    <section
      aria-label="Hero promo"
      className="page-x"
      style={{ paddingTop: "1.25rem", paddingBottom: 0 }}
    >
      <style>{`
        /* ── Layout ── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 380px;
            grid-template-rows: auto auto;
            gap: 1rem;
          }
          .hero-panel { grid-row: 1 / 2; }
          .side-stack { grid-row: 1 / 2; }
        }

        /* ── Hero panel ── */
        .hero-panel {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          min-height: 380px;
          background: linear-gradient(135deg, #1a0a0a 0%, #8B1414 45%, #c0392b 100%);
          display: flex;
          align-items: flex-end;
          box-shadow: 0 20px 60px rgba(139,20,20,0.35);
        }
        @media (min-width: 1024px) { .hero-panel { min-height: 440px; } }
        @media (max-width: 640px)  { .hero-panel { min-height: 320px; } }

        .hero-noise {
          position: absolute; inset: 0; opacity: 0.04; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
        .hero-grid-lines {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .hero-glow {
          position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,127,17,0.25) 0%, transparent 70%);
          top: -100px; right: -80px; pointer-events: none;
        }

        /* ── Product image ── */
        .hero-img-wrap {
          position: absolute; right: 0; top: 0; bottom: 0; width: 55%;
          display: flex; align-items: center; justify-content: flex-end;
          pointer-events: none;
        }
        @media (max-width: 640px) { .hero-img-wrap { width: 45%; } }

        .hero-img {
          height: 85%; width: auto; object-fit: contain;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5));
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .hero-img.fade-out { opacity: 0; transform: scale(0.95) translateX(10px); }
        .hero-img-skeleton {
          width: 200px; height: 200px; border-radius: 16px;
          background: rgba(255,255,255,0.08);
          animation: pulse 1.5s ease-in-out infinite;
          margin-right: 2rem;
        }

        /* ── Hero content ── */
        .hero-content {
          position: relative; z-index: 2;
          padding: clamp(1.5rem, 4vw, 2.5rem);
          max-width: 360px;
        }

        /* Eyebrow pill — wraps the .text-eyebrow span */
        .hero-eyebrow-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,127,17,0.2);
          border: 1px solid rgba(255,127,17,0.4);
          border-radius: 100px;
          padding: 4px 12px;
          margin-bottom: 14px;
        }
        .hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
          background: var(--color-orange);
          animation: blink 1.2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .hero-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

        /* Ghost button — sits on the dark hero background */
        .btn-hero-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.85);
          font-family: var(--font-body);
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 0.55rem 1.2rem; border-radius: 9999px;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .btn-hero-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.5);
        }

        /* ── Dot nav ── */
        .hero-dots { display: flex; gap: 6px; margin-top: 24px; }
        .hero-dot {
          height: 4px; border-radius: 2px; width: 16px;
          background: rgba(255,255,255,0.25);
          border: none; cursor: pointer; padding: 0;
          transition: all 0.3s ease;
        }
        .hero-dot.active { background: var(--color-orange); width: 32px; }

        /* ── Stats strip ── */
        .hero-stats {
          position: absolute; bottom: 0; left: 0; right: 0;
          display: flex;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .hero-stat {
          flex: 1; padding: 10px 0 12px; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .hero-stat:last-child { border-right: none; }
        .hero-stat-num { display: block; color: var(--color-orange); }
        .hero-stat-label { color: rgba(255,255,255,0.45) !important; }

        /* ── Side stack ── */
        .side-stack { display: flex; flex-direction: column; gap: 0.75rem; }

        .side-card-skel {
          flex: 1; border-radius: 16px; padding: 14px;
          display: flex; align-items: center; gap: 14px;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
        }

        .side-card {
          border-radius: 16px; padding: 14px;
          display: flex; align-items: center; gap: 14px;
          text-decoration: none; transition: all 0.25s ease;
          border: 1px solid transparent;
          position: relative; overflow: hidden; flex: 1;
        }
        .side-card::before {
          content: ''; position: absolute; inset: 0; opacity: 0;
          transition: opacity 0.25s ease;
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 100%);
        }
        .side-card:hover { transform: translateY(-3px); }
        .side-card:hover::before { opacity: 1; }

        .side-card-0 { background: rgba(255,127,17,0.07); border-color: rgba(255,127,17,0.2); }
        .side-card-0:hover { box-shadow: 0 8px 24px rgba(255,127,17,0.18); border-color: rgba(255,127,17,0.4); }
        .side-card-1 { background: rgba(139,20,20,0.07); border-color: rgba(139,20,20,0.18); }
        .side-card-1:hover { box-shadow: 0 8px 24px rgba(139,20,20,0.16); border-color: rgba(139,20,20,0.35); }
        .side-card-2 { background: rgba(21,101,192,0.07); border-color: rgba(21,101,192,0.18); }
        .side-card-2:hover { box-shadow: 0 8px 24px rgba(21,101,192,0.16); border-color: rgba(21,101,192,0.35); }

        .side-img-wrap {
          width: 64px; height: 64px; border-radius: 12px;
          background: #fff; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .side-img-wrap img {
          width: 100%; height: 100%; object-fit: contain; padding: 6px;
          transition: transform 0.3s ease;
        }
        .side-card:hover .side-img-wrap img { transform: scale(1.08); }

        .side-card-body { flex: 1; min-width: 0; }
        .side-card-name {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .side-card-arrow {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(0,0,0,0.06);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s ease;
        }
        .side-card:hover .side-card-arrow { background: var(--color-orange); color: #fff; }

        /* ── Explore CTA ── */
        .explore-cta {
          border-radius: 16px; padding: 14px 18px;
          display: flex; align-items: center; justify-content: space-between;
          background: var(--color-orange);
          border: none; cursor: pointer;
          box-shadow: 0 4px 20px rgba(255,127,17,0.35);
          transition: all 0.25s ease;
        }
        .explore-cta:hover {
          background: var(--color-orange-dark);
          transform: translateY(-3px);
          box-shadow: 0 10px 32px rgba(255,127,17,0.45);
        }
        .explore-cta-arrow {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── Trust bar ── */
        .trust-bar {
          grid-column: 1 / -1;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;
        }
        @media (max-width: 640px) {
          .trust-bar { grid-template-columns: 1fr; }
          .trust-item { padding: 10px; }
        }
        .trust-item {
          background: #fff;
          border: 1px solid var(--color-border);
          border-radius: 14px; padding: 14px 12px;
          display: flex; align-items: center; gap: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .trust-icon-wrap {
          width: 36px; height: 36px; flex-shrink: 0; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,127,17,0.1);
        }

        /* ── Skeleton ── */
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .skel { background: var(--color-border); border-radius: 8px; animation: pulse 1.5s ease-in-out infinite; }
      `}</style>

      <div className="hero-grid">
        {/* ══ Hero panel ══ */}
        <div className="hero-panel">
          <div className="hero-noise" aria-hidden="true" />
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />

          {/* Product image */}
          <div className="hero-img-wrap">
            {loading ? (
              <div className="hero-img-skeleton" />
            ) : hero && getImage(hero) ? (
              <img
                key={heroIdx}
                src={getImage(hero)}
                alt={hero.title || "Featured product"}
                className={`hero-img${animating ? " fade-out" : ""}`}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : null}
          </div>

          {/* Text */}
          <div className="hero-content">
            {loading ? (
              <>
                <div
                  className="skel"
                  style={{
                    height: 20,
                    width: 100,
                    borderRadius: 100,
                    marginBottom: 14,
                  }}
                />
                <div
                  className="skel"
                  style={{ height: 40, width: "80%", marginBottom: 8 }}
                />
                <div
                  className="skel"
                  style={{ height: 40, width: "60%", marginBottom: 20 }}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <div
                    className="skel"
                    style={{ height: 36, width: 110, borderRadius: 100 }}
                  />
                  <div
                    className="skel"
                    style={{ height: 36, width: 90, borderRadius: 100 }}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Eyebrow */}
                <div className="hero-eyebrow-pill">
                  <span className="hero-eyebrow-dot" />
                  <span className="text-eyebrow" style={{ color: "#ffa040" }}>
                    {hero?.category || "Featured"}
                  </span>
                </div>

                {/* Title — uses .text-hero (Ubuntu 700) from globals */}
                <h2
                  className="text-hero"
                  style={{ color: "#fff", marginBottom: "0.75rem" }}
                >
                  Premium Food
                  <br />
                  <span style={{ color: "var(--color-orange)" }}>Products</span>
                </h2>

                {/* Subtitle — uses .text-body (Poppins 400) from globals */}
                <p
                  className="text-body"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: "1.25rem",
                  }}
                >
                  Quality ingredients. Authentic flavours.
                  <br />
                  Delivered countrywide.
                </p>

                {/* CTAs */}
                <div className="hero-actions">
                  <button
                    onClick={scrollToProducts}
                    className="btn-secondary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    Shop Now <ArrowRight size={13} />
                  </button>
                  {hero && (
                    <Link
                      to={`/product/${hero._id || hero.id}`}
                      className="btn-hero-ghost"
                    >
                      View Product
                    </Link>
                  )}
                </div>

                {/* Dot nav */}
                {heroProducts.length > 1 && (
                  <div className="hero-dots">
                    {heroProducts.map((_, i) => (
                      <button
                        key={i}
                        className={`hero-dot${i === heroIdx ? " active" : ""}`}
                        onClick={() => {
                          setHeroIdx(i);
                          setAnimating(false);
                        }}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ══ Side cards ══ */}
        <div className="side-stack">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="side-card-skel">
                  <div
                    className="skel"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      className="skel"
                      style={{ height: 10, width: "40%", marginBottom: 8 }}
                    />
                    <div
                      className="skel"
                      style={{ height: 14, width: "80%", marginBottom: 6 }}
                    />
                    <div
                      className="skel"
                      style={{ height: 12, width: "35%" }}
                    />
                  </div>
                </div>
              ))
            : sideCards.map((product, i) => {
                const imgSrc = getImage(product);
                return (
                  <Link
                    key={product._id || product.id}
                    to={`/product/${product._id || product.id}`}
                    className={`side-card side-card-${i}`}
                  >
                    <div className="side-img-wrap">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={product.title || "Product"}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: "1.5rem" }}>🛍️</div>
                      )}
                    </div>
                    <div className="side-card-body">
                      {/* Category — .text-eyebrow (Poppins 700, orange) from globals */}
                      <span
                        className="text-eyebrow"
                        style={{ display: "block", marginBottom: 3 }}
                      >
                        {product.category || "Product"}
                      </span>
                      {/* Name — .text-card-title (Poppins 700 uppercase) from globals */}
                      <div className="text-card-title side-card-name">
                        {product.title || "Product"}
                      </div>
                      {/* Price — .text-label .text-red from globals */}
                      {product.price > 0 && (
                        <span className="text-label text-red">
                          Ksh {product.price?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="side-card-arrow">
                      <ArrowRight size={13} />
                    </div>
                  </Link>
                );
              })}

          {/* Explore CTA */}
          {!loading && (
            <button onClick={scrollToProducts} className="explore-cta">
              <div style={{ textAlign: "left" }}>
                {/* .text-card-title (Poppins 700) from globals */}
                <div
                  className="text-card-title"
                  style={{ color: "#fff", marginBottom: 2 }}
                >
                  Explore All Products
                </div>
                {/* .text-label (Poppins 600) from globals, overrides transform/spacing for prose feel */}
                <div
                  className="text-label"
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontWeight: 500,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  Browse our full catalogue →
                </div>
              </div>
              <div className="explore-cta-arrow">
                <ArrowRight size={16} color="#fff" />
              </div>
            </button>
          )}
        </div>

        {/* ══ Trust bar ══ */}
        <div className="trust-bar">
          {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="trust-item">
              <div className="trust-icon-wrap">
                <Icon size={16} color="var(--color-orange)" />
              </div>
              <div>
                {/* .text-card-title (Poppins 700) from globals */}
                <span
                  className="text-card-title"
                  style={{ display: "block", lineHeight: 1.2 }}
                >
                  {label}
                </span>
                {/* .text-label .text-muted from globals */}
                <span
                  className="text-label text-muted"
                  style={{
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  {sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
