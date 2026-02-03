import React from "react";
import { Heart, ShoppingCart, Clock } from "lucide-react";
import { sampleProducts } from "./ProductCard";
import { assets } from "../assets/assets";

/**
 * Sales Component - Today's Hot Deals
 * Smart Global Premium Foods
 *
 * Features:
 * - Top promotional categories (Soups, Crisps, Syrups)
 * - Hot deals product grid using real product data
 * - Delivery banner with brand colors
 */

export default function Sales() {
  // Promotional categories matching Smart Global products
  const categories = [
    {
      id: "c1",
      title: "Premium Soups",
      subtitle: "100% Natural",
      ctaLabel: "Shop Now",
      bgClass: "bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/5",
      image: assets.kent,
    },
    {
      id: "c2",
      title: "Craft Cooked Crisps",
      subtitle: "Halal Certified",
      ctaLabel: "Shop Now",
      bgClass: "bg-gradient-to-br from-[#BF1A1A]/10 to-[#BF1A1A]/5",
      image: assets.spuds,
    },
    {
      id: "c3",
      title: "Premium Toppings",
      subtitle: "Sweet Moments",
      ctaLabel: "Shop Now",
      bgClass: "bg-gradient-to-br from-[#FFD41D]/20 to-[#FFD41D]/5",
      image: assets.topping,
    },
  ];

  return (
    <main className="w-full px-6 lg:px-12 py-12">
      {/* Top Promotional Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`${cat.bgClass} rounded-2xl px-6 py-5 flex items-center gap-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100`}
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-24 h-24 rounded-xl object-cover flex-shrink-0 shadow-md"
            />
            <div className="flex-1">
              <div
                className="text-sm font-black text-gray-900 tracking-tight"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {cat.title}
              </div>
              <div className="text-xs text-gray-600 font-semibold mt-1">
                {cat.subtitle}
              </div>
              <button
                type="button"
                className="mt-3 inline-block px-4 py-2 bg-[#BF1A1A] text-white text-xs font-bold rounded-full hover:bg-[#8B1414] transition-all duration-300 shadow-md hover:shadow-lg uppercase tracking-wide"
                aria-label={`${cat.ctaLabel} for ${cat.title}`}
              >
                {/* {cat.ctaLabel} */}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Section Heading */}
      <div className="mt-12 text-center">
        <h2
          className="text-4xl sm:text-5xl font-black text-gray-900"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          TODAY'S <span className="text-[#BF1A1A]">HOT DEALS</span>
        </h2>
        <p className="mt-2 text-gray-600 font-semibold">
          Grab these amazing offers while they last!
        </p>
      </div>

      {/* Product Grid - Using Real Smart Global Products */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleProducts.map((prod) => (
          <article
            key={prod.id}
            className="bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden flex flex-col hover:shadow-xl hover:border-[#BF1A1A] transition-all duration-300 group"
            aria-labelledby={`prod-${prod.id}`}
          >
            {/* Product Image */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100">
              <img
                src={prod.image}
                alt={prod.title}
                className="w-full h-48 object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                width="400"
                height="240"
              />
              <div className="absolute top-3 left-3 bg-white/95 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-full shadow-md">
                {prod.category}
              </div>
              {prod.badge && (
                <div
                  className={`absolute top-3 right-3 text-xs font-black px-3 py-1.5 rounded-full shadow-md ${
                    prod.badge === "NEW"
                      ? "bg-[#4CAF50] text-white"
                      : prod.badge === "SALE"
                        ? "bg-[#BF1A1A] text-white"
                        : "bg-[#FFD41D] text-[#7B4019]"
                  }`}
                >
                  {prod.badge}
                </div>
              )}
              {prod.discount && (
                <div className="absolute bottom-3 right-3 bg-[#BF1A1A] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                  -{prod.discount}%
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3
                  id={`prod-${prod.id}`}
                  className="text-base font-black text-gray-900 leading-tight"
                >
                  {prod.title}
                </h3>
                <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                {/* Rating */}
                {prod.rating && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(prod.rating)
                              ? "text-[#FFD41D]"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 font-semibold">
                      {prod.rating} ({prod.reviews})
                    </span>
                  </div>
                )}
              </div>

              {/* Price & Actions */}
              <div className="mt-4">
                <div className="flex items-end gap-2 mb-3">
                  <div className="text-2xl font-black text-[#BF1A1A]">
                    ${prod.price}
                  </div>
                  {prod.oldPrice && (
                    <div className="text-sm text-gray-400 line-through font-semibold pb-0.5">
                      ${prod.oldPrice}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2.5 rounded-lg bg-gray-100 border border-gray-200 hover:bg-[#BF1A1A] hover:text-white hover:border-[#BF1A1A] transition-all duration-300"
                    aria-label={`Add ${prod.title} to favorites`}
                  >
                    <Heart size={16} />
                  </button>

                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#BF1A1A] hover:bg-[#8B1414] text-white rounded-lg transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg"
                    aria-label={`Add ${prod.title} to cart`}
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Delivery Banner */}
      <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
        <div className="flex items-center gap-5 flex-1">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Clock size={32} className="text-white" />
          </div>
          <div>
            <div
              className="font-black text-xl tracking-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Fast & Reliable Delivery
            </div>
            <div className="text-sm opacity-90 font-semibold mt-1">
              Your order arrives the next day • 10 AM - 6 PM • Free delivery
              over $40
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-white text-[#BF1A1A] px-6 py-3 rounded-full font-black text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 uppercase tracking-wide">
            Track Order
          </button>
        </div>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700;800;900&display=swap");
      `}</style>
    </main>
  );
}
