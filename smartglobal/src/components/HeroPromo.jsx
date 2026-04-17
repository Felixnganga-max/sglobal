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
          gap: 0.625rem;
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 340px;
            gap: 0.875rem;
          }
        }

        /* ── Hero panel — flat, no gradient ── */
        .hero-panel {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          min-height: 300px;
          background-color: #8B1414;
          display: flex;
          align-items: flex-end;
          box-shadow: 0 8px 32px rgba(139,20,20,0.22);
        }
        @media (min-width: 1024px) { .hero-panel { min-height: 380px; } }
        @media (max-width: 640px)  { .hero-panel { min-height: 240px; } }

        /* subtle dot-grid texture instead of gradient */
        .hero-dots-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 22px 22px;
        }

        /* ── Product image ── */
        .hero-img-wrap {
          position: absolute; right: 0; top: 0; bottom: 0; width: 52%;
          display: flex; align-items: center; justify-content: flex-end;
          pointer-events: none;
          padding-right: 1rem;
        }
        @media (max-width: 640px) { .hero-img-wrap { width: 44%; padding-right: 0.5rem; } }

        .hero-img {
          height: 82%; width: auto; max-width: 100%; object-fit: contain;
          filter: drop-shadow(0 12px 28px rgba(0,0,0,0.4));
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .hero-img.fade-out { opacity: 0; transform: scale(0.95) translateX(10px); }
        .hero-img-skeleton {
          width: 160px; height: 160px; border-radius: 12px;
          background: rgba(255,255,255,0.08);
          animation: hp-pulse 1.5s ease-in-out infinite;
          margin-right: 1rem;
        }

        /* ── Hero content ── */
        .hero-content {
          position: relative; z-index: 2;
          padding: clamp(1rem, 3vw, 1.75rem);
          max-width: 300px;
        }
        @media (max-width: 640px) { .hero-content { max-width: 55%; padding: 1rem; } }

        /* Eyebrow pill */
        .hero-eyebrow-pill {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,127,17,0.18);
          border: 1px solid rgba(255,127,17,0.35);
          border-radius: 100px;
          padding: 3px 10px;
          margin-bottom: 10px;
        }
        .hero-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
          background: var(--color-orange);
          animation: hp-blink 1.2s ease-in-out infinite;
        }
        @keyframes hp-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        /* Flat accent bar — replaces gradient text spans */
        .hero-accent-bar {
          display: inline-block;
          width: 2.5rem; height: 3px;
          background-color: var(--color-orange);
          border-radius: 2px;
          margin-bottom: 8px;
        }

        .hero-title {
          font-family: var(--font-heading);
          font-size: clamp(0.95rem, 2.2vw, 1.3rem);
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 6px;
        }
        .hero-title span { color: var(--color-orange); }

        .hero-sub {
          font-family: var(--font-body);
          font-size: clamp(0.6rem, 1.2vw, 0.72rem);
          font-weight: 400;
          line-height: 1.6;
          color: rgba(255,255,255,0.58);
          margin-bottom: 14px;
        }
        @media (max-width: 480px) { .hero-sub { display: none; } }

        .hero-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

        .btn-hero-ghost {
          display: inline-flex; align-items: center; gap: 5px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.28);
          color: rgba(255,255,255,0.82);
          font-family: var(--font-body);
          font-size: 0.62rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 0.45rem 1rem; border-radius: 9999px;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-hero-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.5);
        }

        /* Dot nav */
        .hero-dots { display: flex; gap: 5px; margin-top: 16px; }
        .hero-dot {
          height: 3px; border-radius: 2px; width: 12px;
          background: rgba(255,255,255,0.22);
          border: none; cursor: pointer; padding: 0;
          transition: all 0.3s ease;
        }
        .hero-dot.active { background: var(--color-orange); width: 26px; }

        /* ── Side stack ── */
        .side-stack { display: flex; flex-direction: column; gap: 0.625rem; }

        .side-card-skel {
          flex: 1; border-radius: 12px; padding: 12px;
          display: flex; align-items: center; gap: 12px;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
        }

        .side-card {
          border-radius: 12px; padding: 11px 12px;
          display: flex; align-items: center; gap: 11px;
          text-decoration: none; transition: all 0.2s ease;
          border: 1px solid var(--color-border);
          background: #fff;
          position: relative; overflow: hidden; flex: 1;
        }
        .side-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.09);
          border-color: var(--color-orange);
        }

        .side-img-wrap {
          width: 52px; height: 52px; border-radius: 10px;
          background: var(--color-bg-soft); flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; border: 1px solid var(--color-border);
        }
        .side-img-wrap img {
          width: 100%; height: 100%; object-fit: contain; padding: 5px;
          transition: transform 0.3s ease;
        }
        .side-card:hover .side-img-wrap img { transform: scale(1.06); }

        .side-card-body { flex: 1; min-width: 0; }
        .side-card-name {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 3px;
          font-size: 0.7rem;
          font-family: var(--font-body);
          font-weight: 600;
          color: var(--color-text);
        }
        .side-card-arrow {
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s ease;
          color: var(--color-muted);
        }
        .side-card:hover .side-card-arrow {
          background: var(--color-orange);
          border-color: var(--color-orange);
          color: #fff;
        }

        /* ── Explore CTA — flat orange ── */
        .explore-cta {
          border-radius: 12px; padding: 12px 16px;
          display: flex; align-items: center; justify-content: space-between;
          background: var(--color-orange);
          border: none; cursor: pointer;
          transition: all 0.2s ease;
        }
        .explore-cta:hover {
          background: var(--color-orange-dark);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,127,17,0.3);
        }
        .explore-cta-arrow {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── Trust bar ── */
        .trust-bar {
          grid-column: 1 / -1;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.625rem;
        }
        @media (max-width: 480px) {
          .trust-bar { grid-template-columns: 1fr; }
        }
        @media (min-width: 481px) and (max-width: 767px) {
          .trust-bar { grid-template-columns: repeat(3, 1fr); }
        }
        .trust-item {
          background: #fff;
          border: 1px solid var(--color-border);
          border-radius: 12px; padding: 10px 12px;
          display: flex; align-items: center; gap: 10px;
        }
        .trust-icon-wrap {
          width: 32px; height: 32px; flex-shrink: 0; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,127,17,0.1);
        }

        /* ── Skeleton ── */
        @keyframes hp-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .hp-skel { background: rgba(255,255,255,0.12); border-radius: 6px; animation: hp-pulse 1.5s ease-in-out infinite; }
        .skel { background: var(--color-border); border-radius: 6px; animation: hp-pulse 1.5s ease-in-out infinite; }
      `}</style>

      <div className="hero-grid">
        {/* ══ Hero panel ══ */}
        <div className="hero-panel">
          <div className="hero-dots-bg" aria-hidden="true" />

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
                  className="hp-skel"
                  style={{
                    height: 16,
                    width: 80,
                    borderRadius: 100,
                    marginBottom: 10,
                  }}
                />
                <div
                  className="hp-skel"
                  style={{ height: 28, width: "80%", marginBottom: 6 }}
                />
                <div
                  className="hp-skel"
                  style={{ height: 28, width: "55%", marginBottom: 14 }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <div
                    className="hp-skel"
                    style={{ height: 30, width: 90, borderRadius: 100 }}
                  />
                  <div
                    className="hp-skel"
                    style={{ height: 30, width: 78, borderRadius: 100 }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="hero-eyebrow-pill">
                  <span className="hero-eyebrow-dot" />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#ffa040",
                    }}
                  >
                    {hero?.category || "Featured"}
                  </span>
                </div>

                <div className="hero-accent-bar" />

                <h2 className="hero-title">
                  Premium Food
                  <br />
                  <span>Products</span>
                </h2>

                <p className="hero-sub">
                  Quality ingredients. Authentic flavours.
                  <br />
                  Delivered countrywide.
                </p>

                <div className="hero-actions">
                  <button
                    onClick={scrollToProducts}
                    className="btn-secondary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.62rem",
                      padding: "0.45rem 1.1rem",
                    }}
                  >
                    Shop Now <ArrowRight size={12} />
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
                      width: 52,
                      height: 52,
                      borderRadius: 10,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      className="skel"
                      style={{ height: 9, width: "40%", marginBottom: 7 }}
                    />
                    <div
                      className="skel"
                      style={{ height: 12, width: "80%", marginBottom: 5 }}
                    />
                    <div
                      className="skel"
                      style={{ height: 10, width: "30%" }}
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
                    className="side-card"
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
                        <div style={{ fontSize: "1.25rem" }}>🛍️</div>
                      )}
                    </div>
                    <div className="side-card-body">
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "var(--color-orange)",
                          display: "block",
                          marginBottom: 2,
                        }}
                      >
                        {product.category || "Product"}
                      </span>
                      <div className="side-card-name">
                        {product.title || "Product"}
                      </div>
                      {product.price > 0 && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: "var(--color-red)",
                          }}
                        >
                          Ksh {product.price?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="side-card-arrow">
                      <ArrowRight size={11} />
                    </div>
                  </Link>
                );
              })}

          {!loading && (
            <button onClick={scrollToProducts} className="explore-cta">
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 2,
                    letterSpacing: "0.04em",
                  }}
                >
                  Explore All Products
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.62rem",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  Browse our full catalogue →
                </div>
              </div>
              <div className="explore-cta-arrow">
                <ArrowRight size={14} color="#fff" />
              </div>
            </button>
          )}
        </div>

        {/* ══ Trust bar ══ */}
        <div className="trust-bar">
          {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="trust-item">
              <div className="trust-icon-wrap">
                <Icon size={14} color="var(--color-orange)" />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    display: "block",
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.6rem",
                    fontWeight: 400,
                    color: "var(--color-muted)",
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
