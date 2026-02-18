import React, { useRef } from "react";
import { Heart, ShoppingCart, MapPin } from "lucide-react";
import { sampleProducts } from "./ProductCard";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "c1",
    title: "Premium Soups",
    subtitle: "100% Natural Vegetables",
    image: assets.kent,
    accent: "#FF7F11",
  },
  {
    id: "c2",
    title: "Craft Crisps",
    subtitle: "9 Bold Flavour Profiles",
    image: assets.spuds,
    accent: "#FF0000",
  },
  {
    id: "c3",
    title: "Sweet Toppings",
    subtitle: "Desserts Elevated",
    image: assets.topping,
    accent: "#FF7F11",
  },
  {
    id: "c4",
    title: "Spring Water",
    subtitle: "Pure · Natural · Fresh",
    image: assets.kizembe,
    accent: "#1565C0",
  },
];

export default function Sales() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 240, behavior: "smooth" });
    }
  };

  return (
    <main className="w-full bg-white">
      {/* ── Category Strip ── */}
      <section className="section-y page-x">
        {/* Header row */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-eyebrow mb-1">What We Offer</p>
            <h2 className="text-section-title text-gray-900">Our Range</h2>
            <div className="section-rule mt-2" />
          </div>
          {/* Scroll arrows — mobile only */}
          <div className="flex gap-2 sm:hidden">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5 text-gray-500"
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
            </button>
          </div>
        </div>

        {/* Swipeable on mobile / grid on desktop */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 pb-1 sm:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <Link
              to="/products"
              key={cat.id}
              className="group relative flex-shrink-0 w-[210px] sm:w-auto rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400"
              style={{ height: "270px" }}
            >
              {/* Full-bleed image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Accent top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: cat.accent }}
              />

              {/* Text pinned to bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p
                  className="font-body text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-1"
                  style={{ color: cat.accent }}
                >
                  {cat.subtitle}
                </p>
                <h3 className="font-heading text-white text-base font-700 leading-tight">
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
          ))}
        </div>
      </section>

      {/* ── Products Section ── */}
      <section
        className="section-y page-x bg-gray-50"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div className="mb-8 text-center">
          <p className="text-eyebrow mb-1">Smart Global</p>
          <h2 className="text-section-title text-gray-900">
            Featured Products
          </h2>
          <div className="section-rule-center mt-2" />
          <p className="font-body text-sm text-muted mt-3 max-w-md mx-auto">
            Available countrywide in all leading supermarkets and HORECA
            outlets.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {sampleProducts.map((prod) => (
            <article
              key={prod.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
              aria-labelledby={`prod-${prod.id}`}
            >
              {/* Image */}
              <div className="relative bg-gray-50 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-36 sm:h-44 object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category chip */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[0.6rem] font-bold text-gray-600 px-2 py-1 rounded-full shadow-sm font-body uppercase tracking-wide">
                  {prod.category}
                </div>
                {/* Badge */}
                {prod.badge && (
                  <div
                    className="absolute top-2 right-2 text-[0.6rem] font-black px-2 py-1 rounded-full text-white font-body uppercase tracking-wide"
                    style={{
                      backgroundColor:
                        prod.badge === "NEW"
                          ? "#1565C0"
                          : prod.badge === "SALE"
                            ? "#FF0000"
                            : "#FF7F11",
                    }}
                  >
                    {prod.badge}
                  </div>
                )}
                {prod.discount && (
                  <div
                    className="absolute bottom-2 right-2 text-[0.6rem] font-black px-2 py-1 rounded-full text-white font-body"
                    style={{ backgroundColor: "#FF0000" }}
                  >
                    -{prod.discount}%
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    id={`prod-${prod.id}`}
                    className="font-heading text-gray-900 text-sm leading-tight font-bold"
                  >
                    {prod.title}
                  </h3>
                  <p className="font-body text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  {prod.rating && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3 h-3"
                            fill={
                              i < Math.floor(prod.rating)
                                ? "#FF7F11"
                                : "#e5e7eb"
                            }
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-body text-[0.65rem] text-muted">
                        ({prod.reviews})
                      </span>
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
                      Ksh {prod.price}
                    </span>
                    {prod.oldPrice && (
                      <span className="font-body text-xs text-gray-400 line-through pb-0.5">
                        Ksh {prod.oldPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Save ${prod.title}`}
                      className="p-2 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-300 text-gray-400 hover:text-gray-700 transition-all duration-200"
                    >
                      <Heart size={13} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Add ${prod.title} to cart`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-xs font-bold font-body transition-all duration-200 hover:opacity-90"
                      style={{ backgroundColor: "#FF0000" }}
                    >
                      <ShoppingCart size={13} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Distribution Banner ── */}
      <section className="page-x section-y">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ minHeight: "180px" }}
        >
          {/* Background image */}
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
