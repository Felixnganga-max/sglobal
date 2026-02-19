import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";

const API_URL = "https://smartglobal-3jfl.vercel.app/smartglobal/products";

/**
 * FeaturedProductsGrid.jsx
 * Grouped by category, fully responsive, consistent with global CSS variables.
 * Image fix: reads product.image?.url (nested object from API).
 */
export default function FeaturedProductsGrid() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Fetch first page to get total page count
      const firstRes = await fetch(`${API_URL}?page=1&limit=100`);
      if (!firstRes.ok) throw new Error("Failed to fetch products");
      const firstData = await firstRes.json();

      const totalPages = firstData.pages || 1;
      let allProducts = firstData.success
        ? firstData.data || []
        : Array.isArray(firstData)
          ? firstData
          : [];

      // Fetch remaining pages in parallel
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

      // Group by category
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
        <div
          className="border-2 rounded-2xl p-8 max-w-md mx-auto"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="font-semibold mb-2 text-red"
            style={{ color: "var(--color-red)" }}
          >
            Unable to load products
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--color-muted)" }}>
            {error}
          </p>
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
        <p className="font-semibold" style={{ color: "var(--color-muted)" }}>
          No products available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <section key={category}>
          {/* Category heading */}
          <div className="mb-5">
            <p className="text-eyebrow mb-1">{category}</p>
            <div className="section-rule" />
          </div>

          {/* Product grid */}
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
   PRODUCT CARD
───────────────────────────────────────── */
function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getImage = () =>
    product.image?.url ||
    product.imageUrl ||
    product.img ||
    product.photo ||
    "https://via.placeholder.com/300?text=No+Image";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // TODO: integrate with cart context
    alert(`Added "${product.title || product.name}" to cart!`);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted((v) => !v);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

  const name = product.title || product.name || "Product";
  const inStock = product.stock > 0;

  // Badge config
  const badgeLabel = product.badge || (product.onSale ? "SALE" : null);
  const badgeStyle = {
    SALE: { background: "var(--color-red)", color: "#fff" },
    NEW: { background: "var(--color-orange)", color: "#fff" },
    HOT: { background: "var(--color-blue)", color: "#fff" },
    LIMITED: { background: "#1a1a1a", color: "#fff" },
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border cursor-pointer group transition-all duration-300 hover:shadow-lg overflow-hidden"
      style={{ borderColor: "var(--color-border)" }}
    >
      {/* Image area */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={getImage()}
          alt={name}
          className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=No+Image";
          }}
        />

        {/* Badge */}
        {badgeLabel && (
          <span
            className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded"
            style={
              badgeStyle[badgeLabel] || { background: "#1a1a1a", color: "#fff" }
            }
          >
            {badgeLabel}
          </span>
        )}

        {/* Wishlist */}
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
        {/* Name */}
        <h3
          className="font-body font-semibold line-clamp-2 leading-snug"
          style={{ fontSize: "0.75rem", color: "var(--color-text)" }}
        >
          {name}
        </h3>

        {/* Rating */}
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

        {/* Price row */}
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

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            aria-label="Add to cart"
            className="flex items-center gap-1 rounded-full font-body font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              padding: "0.3rem 0.65rem",
              background: inStock ? "var(--color-red)" : "#e5e7eb",
              color: inStock ? "#fff" : "#9ca3af",
              boxShadow: inStock ? "0 2px 8px rgba(255,0,0,0.25)" : "none",
            }}
          >
            <ShoppingCart className="w-3 h-3" />
            Add
          </button>
        </div>

        {/* Stock status */}
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
    <div
      className="bg-white rounded-xl border animate-pulse"
      style={{ borderColor: "var(--color-border)" }}
    >
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
