import React, { useState } from "react";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cartcontext";
import { getProductImage, FALLBACK_IMG } from "../lib/useProducts";
import { withTransform } from "../lib/cloudinary";
import PackBadge from "./PackBadge";

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
  const [wishlisted, setWishlisted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const inStock = product.stock > 0;
  const prodId = product._id || product.id;
  const isInCart = cartItems.some((item) => (item._id || item.id) === prodId);

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

  return (
    <article
      onClick={() => navigate(`/product/${prodId}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:border-gray-200 transition-all duration-300 group cursor-pointer"
      aria-labelledby={`tile-${prodId}`}
    >
      <div className="relative bg-gray-50 overflow-hidden">
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

        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 items-start">
          <span className="bg-white/90 backdrop-blur-sm text-[0.52rem] font-body font-bold text-gray-600 px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
            {product.category}
          </span>
          {product.isBestSeller && (
            <span className="bg-amber-400 text-amber-900 text-[0.52rem] font-black px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
              ⭐ Best Seller
            </span>
          )}
        </div>

        <PackBadge moq={moq} />

        {product.badge && (
          <div
            className={`absolute ${moq > 1 ? "top-9 right-1.5" : "top-1.5 right-1.5"} text-[0.52rem] font-black px-1.5 py-0.5 rounded-full text-white uppercase tracking-wide`}
            style={{
              backgroundColor: BADGE_COLORS[product.badge] || "#1a1a1a",
            }}
          >
            {product.badge}
          </div>
        )}
      </div>

      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3
            id={`tile-${prodId}`}
            className="font-heading text-gray-900 text-xs leading-tight font-bold line-clamp-2"
          >
            {product.title}
          </h3>

          {product.rating > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-2.5 h-2.5"
                    fill={
                      i < Math.floor(product.rating) ? "#FF7F11" : "#e5e7eb"
                    }
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {product.reviews > 0 && (
                <span className="text-[0.55rem] text-gray-400">
                  ({product.reviews})
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
              aria-label={`Save ${product.title}`}
              onClick={(e) => {
                e.stopPropagation();
                setWishlisted((v) => !v);
              }}
              className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-300 transition-all duration-200"
            >
              <Heart
                size={11}
                style={{
                  fill: wishlisted ? "var(--color-blue)" : "transparent",
                  color: wishlisted ? "var(--color-blue)" : "#9ca3af",
                }}
              />
            </button>

            <button
              type="button"
              disabled={!inStock}
              aria-label={`Add ${product.title} to cart`}
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-white text-[0.6rem] font-body font-bold transition-all duration-300 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: addedFeedback
                  ? "#16a34a"
                  : isInCart
                    ? "var(--color-red-dark)"
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
                  <ShoppingCart size={10} /> Add Pack ({moq})
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
