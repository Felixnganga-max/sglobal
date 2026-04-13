import React, { useRef, useState, useEffect } from "react";
import { Heart, ShoppingCart, MapPin, Search, Check } from "lucide-react";
import { assets } from "../assets/assets";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/Cartcontext";

const API_URL = "https://sglobal-plf6.vercel.app/smartglobal/products";
const PROMOS_URL = "https://sglobal-plf6.vercel.app/smartglobal/promos";

const BADGE_COLORS = {
  "SPECIAL OFFER": "#16a34a",
  "HOT DEALS": "#d97706",
  "LIMITED OFFER": "#1a1a1a",
  NEW: "#1565C0",
  SALE: "#FF0000",
  HOT: "#FF7F11",
  LIMITED: "#1a1a1a",
};

const CATEGORY_CONFIG = [
  { key: "cakemix", accent: "#FF7F11", image: assets.cake },
  { key: "kent syrups", accent: "#FF0000", image: assets.top },
  { key: "kent sauces", accent: "#1565C0", image: assets.sauces },
  { key: "kizembe spring water", accent: "#FF7F11", image: assets.kize },
];

// Static categories — built once from CATEGORY_CONFIG, never from the DB
const STATIC_CATEGORIES = CATEGORY_CONFIG.map((c) => ({
  id: c.key,
  title: c.key
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
  accent: c.accent,
  image: c.image,
}));

// ─────────────────────────────────────────────────────────────
// DATA HOOKS
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

function usePromoVideo() {
  const [promoVideo, setPromoVideo] = useState(null);

  useEffect(() => {
    fetch(`${PROMOS_URL}?limit=10`)
      .then((r) => r.json())
      .then((data) => {
        const list = data.success ? data.data : Array.isArray(data) ? data : [];
        const featured =
          list.find((v) => v.isFeatured && v.isActive) ||
          list.find((v) => v.isActive);
        if (featured) setPromoVideo(featured);
      })
      .catch(() => {});
  }, []);

  return promoVideo;
}

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

function getImage(product) {
  return (
    product.images?.[0]?.url ||
    product.image?.url ||
    product.imageUrl ||
    product.img ||
    product.photo ||
    FALLBACK_IMG
  );
}

// ─────────────────────────────────────────────────────────────
// SKELETONS
// ─────────────────────────────────────────────────────────────
function CategorySkeleton() {
  return (
    <div
      className="flex-shrink-0 w-[160px] lg:w-auto rounded-xl bg-gray-200 animate-pulse"
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
// PRODUCT CARD — MOQ / pack pricing
// ─────────────────────────────────────────────────────────────
function ProductCard({ prod }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const inStock = prod.stock > 0;
  const prodId = prod._id || prod.id;
  const isInCart = cartItems.some((item) => (item._id || item.id) === prodId);

  const moq = prod.minimumOrderQuantity || 1;
  const unitPrice = prod.price || 0;
  const packPrice =
    prod.totalPrice != null
      ? prod.totalPrice
      : parseFloat((unitPrice * moq).toFixed(2));

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!inStock) return;
    addToCart({ ...prod, quantity: moq });
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
            e.target.onerror = null;
            e.target.src = FALLBACK_IMG;
          }}
        />

        <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm text-[0.52rem] font-body font-bold text-gray-600 px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
          {prod.category}
        </div>

        {moq > 1 && (
          <div
            className="absolute top-1.5 right-1.5 flex items-center justify-center rounded-full text-white font-black shadow-md"
            style={{
              width: "1.75rem",
              height: "1.75rem",
              fontSize: "0.55rem",
              backgroundColor: "#f97316",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              flexShrink: 0,
            }}
          >
            ×{moq}
          </div>
        )}

        {prod.badge && (
          <div
            className={`absolute ${moq > 1 ? "top-9 right-1.5" : "top-1.5 right-1.5"} text-[0.52rem] font-black px-1.5 py-0.5 rounded-full text-white uppercase tracking-wide`}
            style={{ backgroundColor: BADGE_COLORS[prod.badge] || "#1a1a1a" }}
          >
            {prod.badge}
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
          <div className="mb-1.5 space-y-0.5">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span
                className="font-heading font-bold"
                style={{ fontSize: "0.9rem", color: "var(--color-red)" }}
              >
                KSh {packPrice.toLocaleString()}
              </span>
            </div>

            {moq > 1 && (
              <p
                className="text-[0.6rem] font-semibold"
                style={{ color: "#16a34a" }}
              >
                KSh {unitPrice.toLocaleString()} per piece
              </p>
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
              ) : moq > 1 ? (
                <>
                  <ShoppingCart size={10} /> Add ×{moq}
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
// CATEGORY CARD
// ─────────────────────────────────────────────────────────────
function CategoryCard({ cat }) {
  return (
    <Link
      to={`/products#cat-${encodeURIComponent(cat.id)}`}
      className="group flex-shrink-0 w-[160px] lg:w-auto rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      style={{ height: 200, display: "block", position: "relative" }}
    >
      <img
        src={cat.image}
        alt={cat.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        className="group-hover:scale-105 transition-transform duration-500"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: cat.accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px",
        }}
      >
        <p className="font-heading text-white text-sm font-bold leading-tight">
          {cat.title}
        </p>
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
  );
}

// ─────────────────────────────────────────────────────────────
// PROMO VIDEO SECTION
// ─────────────────────────────────────────────────────────────
function PromoVideoSection({ video, onDismiss, onMinimize, isMinimized }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const fmtDuration = (s) => {
    if (!s) return null;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-72 shadow-2xl rounded-xl overflow-hidden bg-black border border-gray-700">
        <div className="relative">
          <div
            className="relative cursor-pointer"
            onClick={() => onMinimize(false)}
          >
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              className="w-full h-40 object-cover"
              style={{ display: "block" }}
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/90">
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 22 26"
                  fill="none"
                  style={{ marginLeft: 2 }}
                >
                  <path d="M1 1l20 12L1 25V1z" fill="#1a1a1a" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 bg-black/90 backdrop-blur-sm">
            <span className="text-white text-xs font-medium truncate flex-1">
              {video.title}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => onMinimize(false)}
                className="text-white text-xs px-2 py-1 rounded hover:bg-white/10"
                aria-label="Expand video"
              >
                □
              </button>
              <button
                onClick={onDismiss}
                className="text-white text-xs px-2 py-1 rounded hover:bg-white/10"
                aria-label="Close video"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="page-x pb-8">
      <div
        className="relative rounded-2xl overflow-hidden bg-black shadow-xl"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            onClick={() => onMinimize(true)}
            aria-label="Minimize video"
            className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xl leading-none transition-all duration-200 hover:scale-110"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            _
          </button>
          <button
            onClick={onDismiss}
            aria-label="Close promo video"
            className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xl leading-none transition-all duration-200 hover:scale-110"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            ×
          </button>
        </div>
        {video.isFeatured && (
          <div
            className="absolute top-3 left-3 z-20 rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest"
            style={{ background: "var(--color-orange)", color: "#fff" }}
          >
            ★ Featured
          </div>
        )}
        <div
          className="relative cursor-pointer"
          style={{ aspectRatio: "16/9" }}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            className="w-full h-full object-cover"
            style={{ display: "block" }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            playsInline
          />
          {!playing && (
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
              style={{ background: "rgba(0,0,0,0.35)" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <svg
                  width="22"
                  height="26"
                  viewBox="0 0 22 26"
                  fill="none"
                  style={{ marginLeft: 3 }}
                >
                  <path d="M1 1l20 12L1 25V1z" fill="#1a1a1a" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-between px-4 py-3 flex-wrap gap-2"
          style={{ background: "#111" }}
        >
          <div className="flex flex-col min-w-0">
            <span
              className="font-bold uppercase truncate"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.78rem",
                letterSpacing: "0.06em",
                color: "#fff",
              }}
            >
              {video.title}
            </span>
            {video.description && (
              <span
                className="truncate mt-0.5"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {video.description}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
            {video.duration && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                ⏱ {fmtDuration(video.duration)}
              </span>
            )}
            {video.format && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                🎞 {video.format.toUpperCase()}
              </span>
            )}
            {video.tags?.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {video.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-2 py-0.5"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────
export default function Sales() {
  const scrollRef = useRef(null);
  const { products, loading, error, refetch } = useProducts();
  const promoVideo = usePromoVideo();
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [promoMinimized, setPromoMinimized] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";

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
    : products.slice(0, 8);

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

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-4 lg:overflow-visible"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {STATIC_CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </div>
      </section>

      {/* ── Promo Video ── */}
      {promoVideo && !promoDismissed && (
        <PromoVideoSection
          video={promoVideo}
          onDismiss={() => setPromoDismissed(true)}
          onMinimize={setPromoMinimized}
          isMinimized={promoMinimized}
        />
      )}

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
                  className="font-bold underline"
                  style={{ color: "var(--color-red)" }}
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
              className="mt-3 text-xs font-body font-bold underline"
              style={{ color: "var(--color-red)" }}
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
                <MapPin size={14} style={{ color: "var(--color-orange)" }} />
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
