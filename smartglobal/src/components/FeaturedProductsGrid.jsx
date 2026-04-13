import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { useCart } from "../context/Cartcontext";

const API_URL = "https://sglobal-plf6.vercel.app/smartglobal/products";

export default function FeaturedProductsGrid() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
  }, []);

  // ── Auto-scroll to category section once products have loaded ──
  // Runs whenever loading flips to false OR the hash changes.
  // We wait a tick (100ms) so the DOM has painted the sections before scrolling.
  useEffect(() => {
    if (loading) return; // products not ready yet — wait
    if (!location.hash) return; // no hash in URL — nothing to scroll to

    const categoryName = decodeURIComponent(
      location.hash.replace(/^#/, ""), // strip the leading "#"
    );

    const el = document.getElementById(categoryName);
    if (!el) return;

    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    return () => clearTimeout(timer);
  }, [loading, location.hash]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const firstRes = await fetch(`${API_URL}?page=1&limit=100`);
      if (!firstRes.ok) throw new Error("Failed to fetch products");
      const firstData = await firstRes.json();

      const totalPages = firstData.pages || 1;
      let allProducts = firstData.success
        ? firstData.data || []
        : Array.isArray(firstData)
          ? firstData
          : [];

      if (totalPages > 1) {
        const rest = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) =>
            fetch(`${API_URL}?page=${i + 2}&limit=100`)
              .then((r) => r.json())
              .then((d) => (d.success ? d.data || [] : []))
              .catch(() => []),
          ),
        );
        rest.forEach((page) => {
          allProducts = allProducts.concat(page);
        });
      }

      const groups = allProducts.reduce((acc, product) => {
        const cat = product.category || "Other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
      }, {});

      setGrouped(groups);
      setError(null);
    } catch (err) {
      setError(err.message);
      setGrouped({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-10">
        {[...Array(2)].map((_, gi) => (
          <div key={gi}>
            <div className="h-6 bg-gray-200 rounded w-40 mb-5 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="border-2 rounded-2xl p-8 max-w-md mx-auto border-border">
          <p className="font-body font-semibold mb-2 text-red">
            Unable to load products
          </p>
          <p className="text-body mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="btn-primary"
            style={{ fontSize: "0.65rem" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const categories = Object.keys(grouped);

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-body font-semibold text-muted">
          No products available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <section
          key={category}
          // ── KEY CHANGE: ID matches the hash we set in Sales.jsx ──
          // Sales.jsx sets hash as: #cat-${encodeURIComponent(cat.id)}
          // So the ID here must be: cat-${category}
          id={`cat-${category}`}
          // Small scroll-margin so the sticky navbar doesn't overlap the section heading
          style={{ scrollMarginTop: "80px" }}
        >
          <div className="mb-5">
            <p className="text-eyebrow mb-1">{category}</p>
            <div className="section-rule" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {grouped[category].map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   PRODUCT CARD — wired to CartContext
───────────────────────────────────────── */
function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const getImage = () =>
    product.image?.url ||
    product.images?.[0]?.url || // ← add this line
    product.imageUrl ||
    product.img ||
    product.photo ||
    "https://via.placeholder.com/300?text=No+Image";

  const prodId = product._id || product.id;
  const inStock = product.stock > 0;
  const isInCart = cartItems.some((item) => (item._id || item.id) === prodId);
  const name = product.title || product.name || "Product";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!inStock) return;
    addToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted((v) => !v);
  };

  const badgeLabel = product.badge || (product.onSale ? "SALE" : null);
  const badgeColors = {
    SALE: "var(--color-red)",
    NEW: "var(--color-orange)",
    HOT: "var(--color-blue)",
    LIMITED: "#1a1a1a",
  };

  return (
    <div
      onClick={() => navigate(`/product/${prodId}`)}
      className="bg-white rounded-xl border border-border cursor-pointer group transition-all duration-300 hover:shadow-lg overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square bg-soft overflow-hidden">
        <img
          src={getImage()}
          alt={name}
          className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=No+Image";
          }}
        />

        {badgeLabel && (
          <span
            className="absolute top-2 left-2 text-[10px] font-body font-bold px-2 py-0.5 rounded text-white"
            style={{ backgroundColor: badgeColors[badgeLabel] || "#1a1a1a" }}
          >
            {badgeLabel}
          </span>
        )}

        <button
          onClick={toggleWishlist}
          aria-label="Wishlist"
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110"
        >
          <Heart
            className="w-3.5 h-3.5"
            style={{
              fill: isWishlisted ? "var(--color-red)" : "transparent",
              color: isWishlisted ? "var(--color-red)" : "#9ca3af",
            }}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 sm:p-3 space-y-1.5">
        <h3
          className="font-body font-semibold line-clamp-2 leading-snug"
          style={{ fontSize: "0.75rem", color: "var(--color-text)" }}
        >
          {name}
        </h3>

        {product.rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.6rem",
                    color:
                      i < Math.floor(product.rating)
                        ? "var(--color-orange)"
                        : "#d1d5db",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            {product.reviews > 0 && (
              <span style={{ fontSize: "0.6rem", color: "var(--color-muted)" }}>
                ({product.reviews})
              </span>
            )}
          </div>
        )}

        <div className="flex items-end justify-between gap-1 flex-wrap">
          <div>
            <span
              className="font-heading font-bold"
              style={{ fontSize: "0.9rem", color: "var(--color-red)" }}
            >
              KSh {product.price?.toLocaleString()}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span
                className="block line-through"
                style={{ fontSize: "0.6rem", color: "var(--color-muted)" }}
              >
                KSh {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            aria-label="Add to cart"
            className="flex items-center gap-1 rounded-full font-body font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 text-white"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              padding: "0.3rem 0.65rem",
              backgroundColor: addedFeedback
                ? "#16a34a"
                : isInCart
                  ? "#8B1414"
                  : inStock
                    ? "var(--color-red)"
                    : "#e5e7eb",
              color: inStock ? "#fff" : "#9ca3af",
              boxShadow: inStock ? "0 2px 8px rgba(255,0,0,0.2)" : "none",
              transition: "background-color 0.2s ease",
            }}
          >
            {addedFeedback ? (
              <>
                <Check className="w-3 h-3" /> Done
              </>
            ) : isInCart ? (
              <>
                <ShoppingCart className="w-3 h-3" /> In Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" /> Add
              </>
            )}
          </button>
        </div>

        <p
          className="font-body"
          style={{
            fontSize: "0.6rem",
            color: inStock ? "#16a34a" : "var(--color-red)",
            fontWeight: 600,
          }}
        >
          {inStock ? "● In Stock" : "● Out of Stock"}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border animate-pulse">
      <div className="aspect-square bg-gray-100 rounded-t-xl" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-3/5" />
        <div className="flex justify-between items-center mt-1">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-6 bg-gray-100 rounded-full w-14" />
        </div>
      </div>
    </div>
  );
}
