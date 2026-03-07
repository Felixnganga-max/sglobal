import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function scrollToProducts() {
  const el = document.getElementById("featured-products");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    // fallback: scroll down by ~80vh
    window.scrollBy({ top: window.innerHeight * 0.75, behavior: "smooth" });
  }
}

const API_URL = "https://sglobal-plf6.vercel.app/smartglobal/products";

function getImage(product) {
  return (
    product.image?.url ||
    product.imageUrl ||
    product.img ||
    "https://via.placeholder.com/300?text=No+Image"
  );
}

// Pick one random product per category
function pickByCategory(products) {
  const map = new Map();
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  shuffled.forEach((p) => {
    const cat = p.category || "Other";
    if (!map.has(cat)) map.set(cat, p);
  });
  return Array.from(map.values());
}

// Soft background palette for the small cards (cycles)
const CARD_PALETTES = [
  { bg: "rgba(255,127,17,0.08)", border: "rgba(255,127,17,0.25)" },
  { bg: "rgba(255,0,0,0.06)", border: "rgba(255,0,0,0.18)" },
  { bg: "rgba(21,101,192,0.07)", border: "rgba(21,101,192,0.2)" },
];

export default function HeroPromo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const hero = products[0] || null;
  const cards = products.slice(1, 4);

  return (
    <section
      aria-label="Hero promo"
      className="section-y"
      style={{
        paddingLeft: "clamp(1rem, 3vw, 3rem)",
        paddingRight: "clamp(1rem, 3vw, 3rem)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* ── Left hero panel ── */}
        <div
          className="relative lg:col-span-7 rounded-2xl overflow-hidden flex flex-col justify-end"
          style={{
            background:
              "linear-gradient(135deg, var(--color-red) 0%, var(--color-red-dark) 60%, #5a0a0a 100%)",
            minHeight: "360px",
          }}
        >
          {/* Decorative arc */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 300 500"
              className="h-full w-auto opacity-10"
              preserveAspectRatio="xMaxYMid slice"
            >
              <g transform="translate(280,250)">
                {[220, 170, 120, 70].map((r) => (
                  <path
                    key={r}
                    d={`M${r},0 A${r},${r} 0 0,1 0,${r} L0,0 Z`}
                    fill="#fff"
                  />
                ))}
              </g>
            </svg>
          </div>

          {/* Product image */}
          {loading ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-xl animate-pulse" />
          ) : hero ? (
            <img
              src={getImage(hero)}
              alt={hero.title}
              className="absolute right-0 top-1/2 -translate-y-1/2 h-[80%] w-auto object-contain drop-shadow-2xl"
              style={{ maxWidth: "55%" }}
            />
          ) : null}

          {/* Text content */}
          <div className="relative z-10 p-7 sm:p-9 max-w-xs">
            {loading ? (
              <>
                <div className="h-3 bg-white/20 rounded w-24 mb-3 animate-pulse" />
                <div className="h-8 bg-white/20 rounded w-40 mb-2 animate-pulse" />
                <div className="h-8 bg-white/20 rounded w-32 mb-6 animate-pulse" />
                <div className="h-8 bg-white/10 rounded-full w-28 animate-pulse" />
              </>
            ) : (
              <>
                {hero && (
                  <span
                    className="inline-block px-2.5 py-1 rounded-full font-body text-[0.6rem] font-bold uppercase tracking-widest mb-3"
                    style={{
                      backgroundColor: "var(--color-orange)",
                      color: "#fff",
                    }}
                  >
                    {hero.category}
                  </span>
                )}
                <h2
                  className="font-heading font-bold text-white mb-2"
                  style={{
                    fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    lineHeight: 1.1,
                  }}
                >
                  Premium Food
                  <br />
                  <span style={{ color: "var(--color-orange)" }}>Products</span>
                </h2>
                <p className="font-body text-xs text-white/70 mb-5 leading-relaxed">
                  Quality ingredients. Authentic flavours.
                  <br />
                  Available countrywide.
                </p>
                <button
                  onClick={scrollToProducts}
                  className="btn-white"
                  style={{ fontSize: "0.62rem" }}
                >
                  Shop Now
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Right cards stack ── */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-4">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 flex items-center gap-4 animate-pulse"
                  style={{
                    backgroundColor: "var(--color-bg-soft)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 bg-gray-200 rounded w-2/3" />
                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                    <div className="h-2 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))
            : cards.map((product, i) => {
                const palette = CARD_PALETTES[i % CARD_PALETTES.length];
                return (
                  <Link
                    key={product._id || product.id}
                    to={`/product/${product._id || product.id}`}
                    className="rounded-xl p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-md group"
                    style={{
                      backgroundColor: palette.bg,
                      border: `1px solid ${palette.border}`,
                    }}
                  >
                    {/* Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                      <img
                        src={getImage(product)}
                        alt={product.title}
                        className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-eyebrow mb-1 truncate">
                        {product.category}
                      </p>
                      <h3
                        className="font-heading font-bold text-sm leading-snug mb-2 line-clamp-2"
                        style={{ color: "var(--color-text)" }}
                      >
                        {product.title}
                      </h3>
                      <span
                        className="inline-flex items-center gap-1 font-body text-[0.6rem] font-bold transition-colors"
                        style={{ color: "var(--color-orange)" }}
                      >
                        Shop Now
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}

          {/* CTA strip */}
          {!loading && (
            <button
              onClick={scrollToProducts}
              className="rounded-xl p-4 flex items-center justify-between transition-all duration-200 hover:shadow-md w-full text-left"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-dark) 100%)",
              }}
            >
              <div>
                <p className="font-heading font-bold text-white text-sm">
                  Explore All Products
                </p>
                <p className="font-body text-[0.6rem] text-white/75">
                  Browse our full range
                </p>
              </div>
              <svg
                className="w-5 h-5 text-white flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
