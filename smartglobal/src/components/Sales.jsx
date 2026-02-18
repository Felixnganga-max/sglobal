import React, { useRef, useState, useEffect } from "react";
import { Heart, ShoppingCart, MapPin } from "lucide-react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://smartglobal-3jfl.vercel.app/smartglobal/products";

// Accent colours cycled per category (no hardcoding per name)
const CATEGORY_ACCENTS = [
  "#FF7F11",
  "#FF0000",
  "#1565C0",
  "#FF7F11",
  "#FF0000",
  "#1565C0",
];

// Badge colour map
const BADGE_COLORS = {
  NEW: "#1565C0",
  SALE: "#FF0000",
  HOT: "#FF7F11",
  LIMITED: "#1a1a1a",
};

// ─────────────────────────────────────────────────────────────
// DATA HOOK  — single fetch, shared across both sections
// ─────────────────────────────────────────────────────────────
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch_ = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      const list = data.success
        ? data.data || []
        : Array.isArray(data)
          ? data
          : [];
      setProducts(list);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch_();
  }, []);
  return { products, loading, error, refetch: fetch_ };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getImage(product) {
  return (
    product.image?.url ||
    product.imageUrl ||
    product.img ||
    product.photo ||
    "https://via.placeholder.com/300?text=No+Image"
  );
}

// One representative product per category → used for the category strip
function buildCategories(products) {
  const seen = new Map();
  products.forEach((p) => {
    const cat = p.category || "Other";
    if (!seen.has(cat)) seen.set(cat, p);
  });
  return Array.from(seen.entries()).map(([title, rep], i) => ({
    id: title,
    title,
    subtitle: rep.shortDescription || title,
    image: getImage(rep),
    accent: CATEGORY_ACCENTS[i % CATEGORY_ACCENTS.length],
  }));
}

// ─────────────────────────────────────────────────────────────
// SKELETON COMPONENTS
// ─────────────────────────────────────────────────────────────
function CategorySkeleton() {
  return (
    <div
      className="flex-shrink-0 w-[210px] sm:w-auto rounded-2xl bg-gray-200 animate-pulse"
      style={{ height: 270 }}
    />
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-36 sm:h-44 bg-gray-100" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex justify-between items-center mt-3">
          <div className="h-5 bg-gray-100 rounded w-1/3" />
          <div className="h-8 bg-gray-100 rounded-lg w-1/2" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────
function ProductCard({ prod }) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const inStock = prod.stock > 0;
  const prodId = prod._id || prod.id;
  const discount =
    prod.discount ||
    (prod.oldPrice && prod.oldPrice > prod.price
      ? Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100)
      : null);

  return (
    <article
      onClick={() => navigate(`/product/${prodId}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:border-gray-200 transition-all duration-300 group cursor-pointer"
      aria-labelledby={`prod-${prod._id}`}
    >
      {/* Image */}
      <div className="relative bg-gray-50 overflow-hidden">
        <img
          src={getImage(prod)}
          alt={prod.title}
          className="w-full h-36 sm:h-44 object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=No+Image";
          }}
        />

        {/* Category chip */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[0.58rem] font-bold text-gray-600 px-2 py-0.5 rounded-full shadow-sm font-body uppercase tracking-wide">
          {prod.category}
        </div>

        {/* Badge */}
        {prod.badge && (
          <div
            className="absolute top-2 right-2 text-[0.58rem] font-black px-2 py-0.5 rounded-full text-white font-body uppercase tracking-wide"
            style={{ backgroundColor: BADGE_COLORS[prod.badge] || "#1a1a1a" }}
          >
            {prod.badge}
          </div>
        )}

        {/* Discount bubble */}
        {discount && (
          <div
            className="absolute bottom-2 right-2 text-[0.58rem] font-black px-2 py-0.5 rounded-full text-white font-body"
            style={{ backgroundColor: "#FF0000" }}
          >
            -{discount}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            id={`prod-${prod._id}`}
            className="font-heading text-gray-900 text-sm leading-tight font-bold"
          >
            {prod.title}
          </h3>

          {prod.shortDescription && (
            <p
              className="font-body text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              {prod.shortDescription}
            </p>
          )}

          {prod.rating > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-3 h-3"
                    fill={i < Math.floor(prod.rating) ? "#FF7F11" : "#e5e7eb"}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {prod.reviews > 0 && (
                <span
                  className="font-body text-[0.62rem]"
                  style={{ color: "var(--color-muted)" }}
                >
                  ({prod.reviews})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & actions */}
        <div className="mt-3">
          <div className="flex items-end gap-1.5 mb-2.5">
            <span
              className="font-heading text-lg font-bold"
              style={{ color: "#FF0000" }}
            >
              Ksh {prod.price?.toLocaleString()}
            </span>
            {prod.oldPrice && prod.oldPrice > prod.price && (
              <span className="font-body text-xs text-gray-400 line-through pb-0.5">
                Ksh {prod.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock */}
          <p
            className="font-body text-[0.6rem] font-semibold mb-2"
            style={{ color: inStock ? "#16a34a" : "#FF0000" }}
          >
            {inStock ? "● In Stock" : "● Out of Stock"}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={`Save ${prod.title}`}
              onClick={(e) => {
                e.stopPropagation();
                setWishlisted((v) => !v);
              }}
              className="p-2 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-300 transition-all duration-200"
            >
              <Heart
                size={13}
                style={{
                  fill: wishlisted ? "#FF0000" : "transparent",
                  color: wishlisted ? "#FF0000" : "#9ca3af",
                }}
              />
            </button>
            <button
              type="button"
              disabled={!inStock}
              aria-label={`Add ${prod.title} to cart`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-xs font-bold font-body transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#FF0000" }}
            >
              <ShoppingCart size={13} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────
export default function Sales() {
  const scrollRef = useRef(null);
  const { products, loading, error, refetch } = useProducts();

  const categories = buildCategories(products);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 240, behavior: "smooth" });
    }
  };

  return (
    <main className="w-full bg-white">
      {/* ── Category Strip ── */}
      <section className="section-y page-x">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-eyebrow mb-1">What We Offer</p>
            <h2 className="text-section-title text-gray-900">Our Range</h2>
            <div className="section-rule mt-2" />
          </div>

          {/* Mobile scroll arrows */}
          <div className="flex gap-2 sm:hidden">
            {[
              [-1, "M15 19l-7-7 7-7"],
              [1, "M9 5l7 7-7 7"],
            ].map(([dir, d]) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                aria-label={dir === -1 ? "Scroll left" : "Scroll right"}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={d} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Category cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 pb-1 sm:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading ? (
            [...Array(4)].map((_, i) => <CategorySkeleton key={i} />)
          ) : error ? (
            <div className="col-span-4 text-center py-8">
              <p
                className="text-sm font-body"
                style={{ color: "var(--color-muted)" }}
              >
                Could not load categories.{" "}
                <button
                  onClick={refetch}
                  className="underline"
                  style={{ color: "var(--color-red)" }}
                >
                  Retry
                </button>
              </p>
            </div>
          ) : (
            categories.map((cat) => (
              <Link
                to="/products"
                key={cat.id}
                className="group relative flex-shrink-0 w-[210px] sm:w-auto rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400"
                style={{ height: 270 }}
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x270?text=" +
                      encodeURIComponent(cat.title);
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                {/* Accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: cat.accent }}
                />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p
                    className="font-body text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-1"
                    style={{ color: cat.accent }}
                  >
                    {cat.subtitle}
                  </p>
                  <h3 className="font-heading text-white text-base font-bold leading-tight">
                    {cat.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-body text-white text-xs font-semibold">
                      Shop Now
                    </span>
                    <svg
                      className="w-3 h-3 text-white"
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
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section
        className="section-y page-x"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div className="mb-8 text-center">
          <p className="text-eyebrow mb-1">Smart Global</p>
          <h2 className="text-section-title text-gray-900">
            Featured Products
          </h2>
          <div className="section-rule-center mt-2" />
          <p
            className="font-body text-sm mt-3 max-w-md mx-auto"
            style={{ color: "var(--color-muted)" }}
          >
            Available countrywide in all leading supermarkets and HORECA
            outlets.
          </p>
        </div>

        {error && !loading && (
          <div className="text-center py-8">
            <p
              className="text-sm font-body mb-3"
              style={{ color: "var(--color-muted)" }}
            >
              Failed to load products.
            </p>
            <button
              onClick={refetch}
              className="btn-primary"
              style={{ fontSize: "0.65rem" }}
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
            : [...products]
                .sort(() => Math.random() - 0.5)
                .slice(0, 8)
                .map((prod) => (
                  <ProductCard key={prod._id || prod.id} prod={prod} />
                ))}
        </div>

        {!loading && !error && products.length === 0 && (
          <p
            className="text-center font-body text-sm py-10"
            style={{ color: "var(--color-muted)" }}
          >
            No products available yet.
          </p>
        )}
      </section>

      {/* ── Distribution Banner ── */}
      <section className="page-x section-y">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ minHeight: 180 }}
        >
          <img
            src={assets.recipe}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/40" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-7 sm:p-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} style={{ color: "#FF7F11" }} />
                <p
                  className="font-body text-[0.65rem] font-bold uppercase tracking-[0.2em]"
                  style={{ color: "#FF7F11" }}
                >
                  Available Countrywide
                </p>
              </div>
              <h3 className="font-heading text-white text-xl sm:text-2xl font-bold leading-tight mb-1">
                Find Smart Global Products
                <br className="hidden sm:block" /> Near You
              </h3>
              <p className="font-body text-white/60 text-xs leading-relaxed max-w-sm mt-2">
                All leading supermarkets, independent retailers and HORECA
                outlets across Kenya.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link
                to="/contact"
                className="btn-primary text-xs group inline-flex items-center gap-2"
              >
                Contact Us
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
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
              </Link>
              <Link
                to="/about"
                className="font-body text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full border border-white/30 text-white hover:bg-white/10 transition-all duration-300 inline-flex items-center"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
