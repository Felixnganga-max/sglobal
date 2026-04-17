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

  useEffect(() => {
    if (loading) return;
    if (!location.hash) return;

    const categoryName = decodeURIComponent(location.hash.replace(/^#/, ""));
    const el = document.getElementById(`cat-${categoryName}`);
    if (!el) return;

    const timer = setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
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
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {[...Array(2)].map((_, gi) => (
          <div key={gi}>
            <div
              style={{
                height: 16,
                background: "var(--color-border)",
                borderRadius: 6,
                width: 120,
                marginBottom: "1.25rem",
                animation: "fpg-pulse 1.5s ease-in-out infinite",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "0.875rem",
              }}
            >
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
        <style>{`@keyframes fpg-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 0" }}>
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "2rem",
            maxWidth: 380,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              color: "var(--color-red)",
              marginBottom: 8,
              fontSize: "0.85rem",
            }}
          >
            Unable to load products
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--color-muted)",
              marginBottom: "1rem",
            }}
          >
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
      <div style={{ textAlign: "center", padding: "3rem 0" }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            color: "var(--color-muted)",
            fontSize: "0.85rem",
          }}
        >
          No products available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .fpg-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        @media (min-width: 480px) {
          .fpg-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 768px) {
          .fpg-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 1280px) {
          .fpg-grid { grid-template-columns: repeat(5, 1fr); }
        }
        @keyframes fpg-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {categories.map((category) => (
          <section
            key={category}
            id={`cat-${category}`}
            style={{ scrollMarginTop: "96px" }}
          >
            <div style={{ marginBottom: "1.125rem" }}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "var(--color-orange)",
                  marginBottom: "6px",
                }}
              >
                {category}
              </p>
              <div className="section-rule" />
            </div>
            <div className="fpg-grid">
              {grouped[category].map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const getImage = () =>
    product.image?.url ||
    product.images?.[0]?.url ||
    product.imageUrl ||
    product.img ||
    product.photo ||
    "https://via.placeholder.com/300?text=No+Image";

  const prodId = product._id || product.id;
  const inStock = product.stock > 0;
  const isInCart = cartItems.some((item) => (item._id || item.id) === prodId);
  const name = product.title || product.name || "Product";

  const moq = product.minimumOrderQuantity || 1;
  const unitPrice = product.price || 0;
  const packPrice =
    product.totalPrice != null
      ? product.totalPrice
      : parseFloat((unitPrice * moq).toFixed(2));

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!inStock) return;
    addToCart({ ...product, quantity: moq });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted((v) => !v);
  };

  const badgeLabel = product.badge || (product.onSale ? "SALE" : null);
  const badgeColors = {
    "SPECIAL OFFER": "var(--color-red)",
    "HOT DEALS": "#d97706",
    "LIMITED OFFER": "#1a1a1a",
    SALE: "var(--color-red)",
    NEW: "var(--color-orange)",
    HOT: "var(--color-blue)",
  };

  return (
    <div
      onClick={() => navigate(`/product/${prodId}`)}
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
        cursor: "pointer",
        transition: "all 0.25s ease",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1/1",
          background: "var(--color-bg-soft)",
          overflow: "hidden",
        }}
      >
        <img
          src={getImage()}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "0.625rem",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
          }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=No+Image";
          }}
        />

        {/* MOQ badge */}
        {moq > 1 && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "50%",
              backgroundColor: "var(--color-orange)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.58rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            ×{moq}
          </div>
        )}

        {/* Promo badge */}
        {badgeLabel && (
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              fontSize: "0.58rem",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "4px",
              color: "#fff",
              backgroundColor: badgeColors[badgeLabel] || "#1a1a1a",
            }}
          >
            {badgeLabel}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          aria-label="Wishlist"
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 28,
            height: 28,
            background: "#fff",
            borderRadius: "50%",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            opacity: 0,
            transition: "opacity 0.2s, transform 0.2s",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          className="card-wishlist-btn"
        >
          <Heart
            size={13}
            style={{
              fill: isWishlisted ? "var(--color-red)" : "transparent",
              color: isWishlisted ? "var(--color-red)" : "#9ca3af",
            }}
          />
        </button>
      </div>

      {/* Info */}
      <div
        style={{
          padding: "0.625rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.72rem",
            color: "var(--color-text)",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            margin: 0,
          }}
        >
          {name}
        </h3>

        {product.rating > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: "0.58rem",
                  color:
                    i < Math.floor(product.rating)
                      ? "var(--color-orange)"
                      : "#d1d5db",
                }}
              >
                ★
              </span>
            ))}
            {product.reviews > 0 && (
              <span
                style={{ fontSize: "0.58rem", color: "var(--color-muted)" }}
              >
                ({product.reviews})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "var(--color-red)",
            }}
          >
            KSh {packPrice.toLocaleString()}
          </span>
          {moq > 1 && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.6rem",
                color: "#16a34a",
                margin: "2px 0 0",
              }}
            >
              KSh {unitPrice.toLocaleString()} per piece
            </p>
          )}
        </div>

        {/* Add to cart */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 6,
            paddingTop: 2,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.58rem",
              fontWeight: 600,
              color: inStock ? "#16a34a" : "var(--color-red)",
              margin: 0,
            }}
          >
            {inStock ? "● In Stock" : "● Out of Stock"}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            aria-label="Add to cart"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              borderRadius: "100px",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.58rem",
              letterSpacing: "0.06em",
              padding: "0.28rem 0.6rem",
              border: "none",
              cursor: inStock ? "pointer" : "not-allowed",
              opacity: inStock ? 1 : 0.4,
              color: "#fff",
              backgroundColor: addedFeedback
                ? "#16a34a"
                : isInCart
                  ? "#8B1414"
                  : inStock
                    ? "var(--color-red)"
                    : "#e5e7eb",
              transition: "background-color 0.2s ease, transform 0.15s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (inStock) e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {addedFeedback ? (
              <>
                <Check size={11} /> Added
              </>
            ) : isInCart ? (
              <>
                <ShoppingCart size={11} /> In Cart
              </>
            ) : moq > 1 ? (
              <>
                <ShoppingCart size={11} /> Add ×{moq}
              </>
            ) : (
              <>
                <ShoppingCart size={11} /> Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Show wishlist on hover via CSS */}
      <style>{`
        div:hover .card-wishlist-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */
function ProductCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
        overflow: "hidden",
        animation: "fpg-pulse 1.5s ease-in-out infinite",
      }}
    >
      <div style={{ aspectRatio: "1/1", background: "var(--color-bg-soft)" }} />
      <div
        style={{
          padding: "0.625rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            height: 10,
            background: "var(--color-border)",
            borderRadius: 4,
            width: "80%",
          }}
        />
        <div
          style={{
            height: 10,
            background: "var(--color-border)",
            borderRadius: 4,
            width: "55%",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: 14,
              background: "var(--color-border)",
              borderRadius: 4,
              width: "35%",
            }}
          />
          <div
            style={{
              height: 22,
              background: "var(--color-border)",
              borderRadius: 100,
              width: 52,
            }}
          />
        </div>
      </div>
    </div>
  );
}
