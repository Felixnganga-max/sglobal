import React, { useRef, useState, useEffect } from "react";
import { Heart, ShoppingCart, MapPin, Search, X, Check } from "lucide-react";
import { assets } from "../assets/assets";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/Cartcontext";

const API_URL = "https://smartglobal-3jfl.vercel.app/smartglobal/products";

const CATEGORY_ACCENTS = [
  "#FF7F11",
  "#FF0000",
  "#1565C0",
  "#FF7F11",
  "#FF0000",
  "#1565C0",
];

const BADGE_COLORS = {
  NEW: "#1565C0",
  SALE: "#FF0000",
  HOT: "#FF7F11",
  LIMITED: "#1a1a1a",
};

// ─────────────────────────────────────────────────────────────
// DATA HOOK
// ─────────────────────────────────────────────────────────────
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch_ = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}?limit=200`);
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

function getImage(product) {
  return (
    product.image?.url ||
    product.imageUrl ||
    product.img ||
    product.photo ||
    "https://via.placeholder.com/300?text=No+Image"
  );
}

function buildCategories(products) {
  const seen = new Map();
  products.forEach((p) => {
    const cat = p.category || "Other";
    if (!seen.has(cat)) seen.set(cat, p);
  });
  // Restrict to first 4 categories only
  return Array.from(seen.entries())
    .slice(0, 4)
    .map(([title, rep], i) => ({
      id: title,
      title,
      subtitle: rep.shortDescription || title,
      image: getImage(rep),
      accent: CATEGORY_ACCENTS[i % CATEGORY_ACCENTS.length],
    }));
}

// ─────────────────────────────────────────────────────────────
// SKELETONS
// ─────────────────────────────────────────────────────────────
function CategorySkeleton() {
  return (
    <div
      className="flex-shrink-0 w-[160px] rounded-xl bg-gray-200 animate-pulse"
      style={{ height: 200 }}
    />
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-32 sm:h-36 bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
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
  const { addToCart, cartItems } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const inStock = prod.stock > 0;
  const prodId = prod._id || prod.id;
  const isInCart = cartItems.some((item) => (item._id || item.id) === prodId);

  const discount =
    prod.discount ||
    (prod.oldPrice && prod.oldPrice > prod.price
      ? Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100)
      : null);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!inStock) return;
    addToCart(prod);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  return (
    <article
      onClick={() => navigate(`/product/${prodId}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:border-gray-200 transition-all duration-300 group cursor-pointer"
      aria-labelledby={`prod-${prodId}`}
    >
      <div className="relative bg-gray-50 overflow-hidden">
        <img
          src={getImage(prod)}
          alt={prod.title}
          className="w-full h-32 sm:h-36 object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=No+Image";
          }}
        />
        <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm text-[0.52rem] font-body font-bold text-gray-600 px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
          {prod.category}
        </div>
        {prod.badge && (
          <div
            className="absolute top-1.5 right-1.5 text-[0.52rem] font-black px-1.5 py-0.5 rounded-full text-white uppercase tracking-wide"
            style={{ backgroundColor: BADGE_COLORS[prod.badge] || "#1a1a1a" }}
          >
            {prod.badge}
          </div>
        )}
        {discount && (
          <div className="absolute bottom-1.5 right-1.5 text-[0.52rem] font-black px-1.5 py-0.5 rounded-full text-white bg-red">
            -{discount}%
          </div>
        )}
      </div>

      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3
            id={`prod-${prodId}`}
            className="font-heading text-gray-900 text-xs leading-tight font-bold line-clamp-2"
          >
            {prod.title}
          </h3>
          {prod.rating > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-2.5 h-2.5"
                    fill={i < Math.floor(prod.rating) ? "#FF7F11" : "#e5e7eb"}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {prod.reviews > 0 && (
                <span className="text-[0.55rem] text-gray-400">
                  ({prod.reviews})
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-2">
          <div className="flex items-end gap-1 mb-1.5">
            <span className="font-heading text-sm font-bold text-red">
              Ksh {prod.price?.toLocaleString()}
            </span>
            {prod.oldPrice && prod.oldPrice > prod.price && (
              <span className="text-[0.6rem] text-gray-400 line-through pb-0.5">
                Ksh {prod.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <p
            className="text-[0.55rem] font-semibold mb-1.5"
            style={{ color: inStock ? "#16a34a" : "var(--color-red)" }}
          >
            {inStock ? "● In Stock" : "● Out of Stock"}
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={`Save ${prod.title}`}
              onClick={(e) => {
                e.stopPropagation();
                setWishlisted((v) => !v);
              }}
              className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-300 transition-all duration-200"
            >
              <Heart
                size={11}
                style={{
                  fill: wishlisted ? "var(--color-red)" : "transparent",
                  color: wishlisted ? "var(--color-red)" : "#9ca3af",
                }}
              />
            </button>

            <button
              type="button"
              disabled={!inStock}
              aria-label={`Add ${prod.title} to cart`}
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-white text-[0.6rem] font-body font-bold transition-all duration-300 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: addedFeedback
                  ? "#16a34a"
                  : isInCart
                    ? "#8B1414"
                    : "var(--color-red)",
              }}
            >
              {addedFeedback ? (
                <>
                  <Check size={10} /> Added!
                </>
              ) : isInCart ? (
                <>
                  <ShoppingCart size={10} /> In Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={10} /> Add to Cart
                </>
              )}
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
  const [searchParams, setSearchParams] = useSearchParams();

  // Read search query from URL — set by Navbar
  const searchQuery = searchParams.get("q") || "";

  const categories = buildCategories(products);

  const filteredProducts = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          (p.title || "").toLowerCase().includes(q) ||
          (p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.shortDescription || "").toLowerCase().includes(q)
        );
      })
    : products;

  const displayProducts = searchQuery.trim()
    ? filteredProducts
    : [...products].sort(() => Math.random() - 0.5).slice(0, 8);

  const scroll = (dir) => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: dir * 180, behavior: "smooth" });
  };

  return (
    <main className="w-full bg-white">
      {/* ── Category Strip ── */}
      <section className="section-y page-x">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-eyebrow mb-1">What We Offer</p>
            <h2 className="text-section-title text-gray-900">Our Range</h2>
            <div className="section-rule mt-2" />
          </div>
          {/* Scroll arrows always visible on mobile */}
          <div className="flex gap-2 lg:hidden">
            {[
              [-1, "M15 19l-7-7 7-7"],
              [1, "M9 5l7 7-7 7"],
            ].map(([dir, d]) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                aria-label={dir === -1 ? "Scroll left" : "Scroll right"}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
              >
                <svg
                  className="w-3 h-3 text-gray-500"
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

        {/* Always horizontal scroll strip — 4 cards max */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-4 lg:overflow-visible"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading ? (
            [...Array(4)].map((_, i) => <CategorySkeleton key={i} />)
          ) : error ? (
            <div className="col-span-4 text-center py-8">
              <p className="text-sm text-gray-400">
                Could not load categories.{" "}
                <button onClick={refetch} className="underline text-red">
                  Retry
                </button>
              </p>
            </div>
          ) : (
            categories.map((cat) => (
              <Link
                to="/products"
                key={cat.id}
                className="group relative flex-shrink-0 w-[160px] lg:w-auto rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400"
                style={{ height: 200 }}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=" +
                      encodeURIComponent(cat.title);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: cat.accent }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p
                    className="text-[0.55rem] font-body font-bold uppercase tracking-[0.15em] mb-0.5"
                    style={{ color: cat.accent }}
                  >
                    {cat.subtitle}
                  </p>
                  <h3 className="font-heading text-white text-sm font-bold leading-tight">
                    {cat.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-[0.6rem] font-semibold">
                      Shop Now
                    </span>
                    <svg
                      className="w-2.5 h-2.5 text-white"
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

      {/* ── Featured / Search Results ── */}
      <section className="section-y page-x bg-soft">
        <div className="mb-6 text-center">
          {searchQuery ? (
            <>
              <p className="text-eyebrow mb-1">Search Results</p>
              <h2 className="text-section-title text-gray-900">
                "{searchQuery}"
              </h2>
              <div className="section-rule-center mt-2" />
              <p className="text-sm text-gray-400 mt-3">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
                {" — "}
                <button
                  onClick={() => setSearchParams({})}
                  className="text-red font-bold underline"
                >
                  Clear search
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="text-eyebrow mb-1">Smart Global</p>
              <h2 className="text-section-title text-gray-900">
                Featured Products
              </h2>
              <div className="section-rule-center mt-2" />
              <p className="text-sm text-gray-400 mt-3 max-w-md mx-auto">
                Available countrywide in all leading supermarkets and HORECA
                outlets.
              </p>
            </>
          )}
        </div>

        {error && !loading && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 mb-3">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {loading
            ? [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
            : displayProducts.map((prod) => (
                <ProductCard key={prod._id || prod.id} prod={prod} />
              ))}
        </div>

        {!loading && !error && displayProducts.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-body font-medium text-sm">
              No products match "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="mt-3 text-red text-xs font-body font-bold underline"
            >
              Clear search
            </button>
          </div>
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
                <MapPin size={14} className="text-orange" />
                <p className="text-eyebrow">Available Countrywide</p>
              </div>
              <h3 className="font-heading text-white text-xl sm:text-2xl font-bold leading-tight mb-1">
                Find Smart Global Products
                <br className="hidden sm:block" /> Near You
              </h3>
              <p className="text-white/60 text-xs leading-relaxed max-w-sm mt-2">
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
                className="text-xs font-body font-bold uppercase tracking-widest px-5 py-2.5 rounded-full border border-white/30 text-white hover:bg-white/10 transition-all duration-300 inline-flex items-center"
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
