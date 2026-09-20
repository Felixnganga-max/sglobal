import React, { useState } from "react";
import { Heart, ShoppingCart, Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cartcontext";
import { getProductImage, FALLBACK_IMG } from "../lib/useProducts";
import { withTransform } from "../lib/cloudinary";
import { useWishlist, toggleWishlist } from "../lib/useWishlist";
import { recordView } from "../lib/useRecentlyViewed";

const BADGE_COLORS = {
  "SPECIAL OFFER": "#16a34a",
  "HOT DEALS": "#d97706",
  "LIMITED OFFER": "#1a1a1a",
  NEW: "var(--color-blue)",
  SALE: "var(--color-red)",
  HOT: "#FF7F11",
  LIMITED: "#1a1a1a",
};

// Shared compact product card used across the homepage e-commerce
// sections and the Products catalog page.
export default function ProductTile({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { isSaved } = useWishlist();
  const [addedFeedback, setAddedFeedback] = useState(false);

  const inStock = product.stock > 0;
  const prodId = product._id || product.id;
  const isInCart = cartItems.some((item) => (item._id || item.id) === prodId);
  const saved = isSaved(prodId);

  const moq = product.minimumOrderQuantity || 1;
  const unitPrice = product.price || 0;
  const packPrice =
    product.totalPrice != null
      ? product.totalPrice
      : parseFloat((unitPrice * moq).toFixed(2));

  const openProduct = () => {
    recordView(product);
    navigate(`/product/${prodId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!inStock) return;
    addToCart({ ...product, quantity: moq });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const cartLabel = addedFeedback
    ? `${product.title} added to cart`
    : isInCart
      ? `${product.title} is in your cart. Add another`
      : moq > 1
        ? `Add pack of ${moq}: ${product.title}`
        : `Add ${product.title} to cart`;

  return (
    <article
      onClick={openProduct}
      className="group flex flex-col cursor-pointer bg-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(1,0,40,0.04),0_10px_30px_rgba(1,0,40,0.05)] hover:shadow-[0_2px_4px_rgba(1,0,40,0.05),0_16px_36px_rgba(1,0,40,0.1)]"
      style={{ borderRadius: 20 }}
      aria-labelledby={`tile-${prodId}`}
    >
      {/* Image tile */}
      <div
        className="relative overflow-hidden"
        style={{ margin: 8, borderRadius: 14, backgroundColor: "#f3f4f8" }}
      >
        <img
          loading="lazy"
          decoding="async"
          src={withTransform(getProductImage(product), { w: 400 })}
          alt={product.title}
          className="w-full h-32 sm:h-36 object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMG;
          }}
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {product.badge && (
            <span
              className="text-[0.55rem] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wide"
              style={{
                backgroundColor: BADGE_COLORS[product.badge] || "#1a1a1a",
              }}
            >
              {product.badge}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-400 text-amber-900 text-[0.55rem] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
              ⭐ Best Seller
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={
            saved
              ? `Remove ${product.title} from wishlist`
              : `Save ${product.title} to wishlist`
          }
          aria-pressed={saved}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 hover:scale-110"
          style={{ width: 28, height: 28 }}
        >
          <Heart
            size={13}
            style={{
              fill: saved ? "var(--color-red)" : "transparent",
              color: saved ? "var(--color-red)" : "#9ca3af",
            }}
          />
        </button>
      </div>

      {/* Details */}
      <div className="px-3 pb-3 pt-1 flex-1 flex flex-col">
        <h3
          id={`tile-${prodId}`}
          className="font-heading text-xs leading-tight font-bold line-clamp-2"
          style={{ color: "var(--color-text)" }}
        >
          {product.title}
        </h3>

        <div className="flex items-center gap-1.5 flex-wrap mt-1">
          {product.category && (
            <span
              className="text-[0.6rem] font-body"
              style={{ color: "var(--color-muted)" }}
            >
              {product.category}
            </span>
          )}
          {moq > 1 && (
            <span
              className="text-[0.55rem] font-body font-bold px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: "var(--color-blue-tint)",
                color: "var(--color-blue)",
              }}
            >
              Pack of {moq}
            </span>
          )}
        </div>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star size={11} fill="#FF7F11" stroke="#FF7F11" />
            <span
              className="text-[0.62rem] font-body font-bold"
              style={{ color: "var(--color-text)" }}
            >
              {Number(product.rating).toFixed(1)}
            </span>
            {product.reviews > 0 && (
              <span className="text-[0.58rem] text-gray-400">
                ({product.reviews})
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-2.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div
              className="font-heading font-bold leading-none"
              style={{ fontSize: "0.95rem", color: "var(--color-blue)" }}
            >
              KSh {packPrice.toLocaleString()}
            </div>
            {moq > 1 && (
              <p
                className="text-[0.6rem] font-semibold mt-1"
                style={{ color: "#16a34a" }}
              >
                KSh {unitPrice.toLocaleString()} per piece
              </p>
            )}
            <p
              className="text-[0.58rem] font-semibold mt-1"
              style={{ color: inStock ? "#16a34a" : "var(--color-red)" }}
            >
              {inStock ? "● In Stock" : "● Out of Stock"}
            </p>
          </div>

          <button
            type="button"
            disabled={!inStock}
            aria-label={cartLabel}
            title={moq > 1 ? `Add pack of ${moq}` : "Add to cart"}
            onClick={handleAddToCart}
            className="relative flex-shrink-0 flex items-center justify-center text-white transition-all duration-300 hover:opacity-90 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: addedFeedback
                ? "#16a34a"
                : isInCart
                  ? "var(--color-red-dark)"
                  : "var(--color-red)",
            }}
          >
            {addedFeedback ? <Check size={16} /> : <ShoppingCart size={16} />}
            {isInCart && !addedFeedback && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-white"
                style={{
                  width: 14,
                  height: 14,
                  color: "var(--color-red-dark)",
                }}
              >
                <Check size={9} strokeWidth={3.5} />
              </span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
