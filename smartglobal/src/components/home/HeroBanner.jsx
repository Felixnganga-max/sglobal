import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useProducts, getProductImage } from "../../lib/useProducts";

const SLIDES = [
  {
    id: "toppings",
    eyebrow: "Kent Boringer · Toppings",
    title: "Elevate Your Sweet Moments",
    copy: "Rich raspberry to luscious caramel — every drop adds magic to desserts, pancakes and ice cream.",
    image: assets.cb,
  },
  {
    id: "spuds",
    eyebrow: "SPUDS · Snacking",
    title: "Craft-Cooked Potato Chips",
    copy: "Small-batch cooked, premium potatoes, zero trans fat — Kenya's favourite crunch.",
    image: assets.sp,
  },
  {
    id: "water",
    eyebrow: "Kizembe · Hydration",
    title: "Pure Spring Water, Every Bottle",
    copy: "Sourced and bottled for everyday freshness — trusted countrywide.",
    image: assets.kiz,
  },
  {
    id: "hazelnut",
    eyebrow: "Kent Boringer · Beverages",
    title: "Rich Hazelnut Creations",
    copy: "Silky, indulgent hazelnut mix for drinks and desserts that feel premium.",
    image: assets.hz,
  },
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const { products } = useProducts();

  // Whichever product is flagged as the top seller (e.g. Kent Cubes) gets
  // pinned as the very first hero slide, sitewide — shown once, up front.
  const bestSeller = products.find((p) => p.isBestSeller) || null;
  const slides = bestSeller
    ? [
        {
          id: "best-seller",
          eyebrow: "⭐ Our #1 Best Seller",
          title: bestSeller.title,
          copy:
            bestSeller.shortDescription ||
            "The product everyone's stocking up on — grab yours today.",
          image: getProductImage(bestSeller),
          productId: bestSeller._id || bestSeller.id,
        },
        ...SLIDES,
      ]
    : SLIDES;

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[index % slides.length];

  return (
    <section className="page-x pt-6 sm:pt-8">
      {/* 5-column grid at every breakpoint: main banner 3/5, side panel 2/5.
          Never collapses to a single stacked column, even on phones. */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
        {/* Main rotating banner */}
        <div className="col-span-3 relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-950 min-h-[190px] sm:min-h-[260px] lg:min-h-[360px]">
          <img
            key={slide.id}
            loading={index === 0 ? undefined : "lazy"}
            decoding="async"
            fetchpriority={index === 0 ? "high" : undefined}
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/57 via-gray-950/36 to-transparent" />

          <div className="relative z-10 flex flex-col justify-center h-full min-h-[190px] sm:min-h-[260px] lg:min-h-[360px] px-3.5 sm:px-6 lg:px-10 py-4 sm:py-7 lg:py-10 max-w-xl">
            <h1
              className="font-heading text-white leading-[1.08] mb-1.5 sm:mb-3 lg:mb-4"
              style={{
                fontSize: "clamp(1.05rem, 4.4vw, 3.2rem)",
                fontWeight: 700,
              }}
            >
              {slide.title}
            </h1>
            <p className="font-body text-white/70 leading-relaxed max-w-md mb-3 sm:mb-5 lg:mb-7 hidden sm:block text-xs sm:text-sm">
              {slide.copy}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-3">
              <Link
                to={
                  slide.productId ? `/product/${slide.productId}` : "/products"
                }
                className="btn-primary text-[0.6rem] sm:text-xs px-3.5 py-1.5 sm:px-[1.9rem] sm:py-[0.7rem]"
              >
                Shop Now
              </Link>
              <Link
                to="/recipes"
                className="btn-outline text-[0.6rem] sm:text-xs px-3.5 py-1.5 sm:px-[1.9rem] sm:py-[0.7rem] hidden sm:inline-block"
                style={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.35)",
                }}
              >
                View Recipes
              </Link>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-2.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Show ${s.title}`}
                onClick={() => setIndex(i)}
                className="h-1 sm:h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === index ? "1.1rem" : "0.3rem",
                  backgroundColor:
                    i === index ? "#FF7F11" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Side promo panel */}
        <Link
          to="/products"
          className="group col-span-2 relative overflow-hidden rounded-xl sm:rounded-2xl min-h-[190px] sm:min-h-[260px] lg:min-h-[360px]"
          style={{
            background:
              "linear-gradient(160deg, var(--color-blue) 0%, var(--color-blue-dark) 100%)",
          }}
        >
          <img
            loading="lazy"
            decoding="async"
            src={assets.kizembe}
            alt="Kizembe Water"
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-black/12 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end h-full min-h-[190px] sm:min-h-[260px] lg:min-h-[360px] p-2.5 sm:p-4 lg:p-6">
            <p
              className="text-eyebrow mb-1 sm:mb-2 hidden sm:block"
              style={{ color: "#fff" }}
            >
              New In
            </p>
            <h2 className="font-heading text-white text-[0.8rem] sm:text-lg lg:text-xl font-bold leading-tight mb-1.5 sm:mb-3">
              Explore Kizembe
              <br />
              Spring Water
            </h2>
            <span className="btn-white text-[0.55rem] sm:text-[0.65rem] px-2.5 py-1 sm:px-[1.9rem] sm:py-[0.7rem] self-start">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
