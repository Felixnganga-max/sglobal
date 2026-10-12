import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useProducts, getProductImage } from "../../lib/useProducts";

const SLIDES = [
  {
    id: "hazelnut",
    eyebrow: "Kent Boringer · Beverages",
    title: "Rich Hazelnut Creations",
    copy: "Silky, indulgent hazelnut mix for drinks and desserts that feel premium.",
    image: assets.hz,
  },
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
  
];

const PATTERN_BY_SLIDE = {
  toppings: 0,
  spuds: 1,
  water: 2,
  hazelnut: 3,
  "best-seller": 4,
};

const HERO_CSS = `
  .sg-hero { position: relative; background: #fff; }

  /* ── One minimal pattern per slide, pinned to the slide (not its position) ── */
  .sg-pat { position: absolute; inset: 0; animation: sgFade .8s ease both; }

  /* hazelnut · navy grid on cream (the keeper) */
  .sg-pat-3 {
    background-color: #fff8ee;
    background-image:
      linear-gradient(rgba(1,0,40,.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(1,0,40,.07) 1px, transparent 1px);
    background-size: 26px 26px;
  }
  /* toppings · fine diamond lattice on warm cream */
  .sg-pat-0 {
    background-color: #fff6ec;
    background-image:
      linear-gradient(45deg, rgba(1,0,40,.065) 1px, transparent 1px),
      linear-gradient(-45deg, rgba(1,0,40,.065) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  /* spuds · hairline diagonals on blush */
  .sg-pat-1 {
    background-color: #fff5f2;
    background-image: repeating-linear-gradient(135deg, rgba(1,0,40,.07) 0 1px, transparent 1px 14px);
  }
  /* water · ruled horizontal lines on pale navy tint */
  .sg-pat-2 {
    background-color: #f0f0f8;
    background-image: repeating-linear-gradient(0deg, rgba(1,0,40,.07) 0 1px, transparent 1px 22px);
  }
  /* best seller / fallback · tiny navy dot grid on cream */
  .sg-pat-4 {
    background-color: #fff8ee;
    background-image: radial-gradient(rgba(1,0,40,.17) 1.2px, transparent 1.5px);
    background-size: 18px 18px;
  }

  /* Image: right-aligned, left edge dissolves into the pattern (no hard line) */
  .sg-img-wrap {
    position: absolute; top: 0; right: 0; height: 100%; width: 60%;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 42%);
            mask-image: linear-gradient(to right, transparent 0%, #000 42%);
    animation: sgFade .8s ease both;
  }
  .sg-img-wrap img { transition: transform .7s ease; }
  .sg-hero:hover .sg-img-wrap img { transform: scale(1.04); }
  @media (min-width: 640px) { .sg-img-wrap { width: 62%; } }

  .sg-rise { animation: sgRise .6s ease both; }
  .sg-rise-2 { animation-delay: .08s; }
  .sg-rise-3 { animation-delay: .16s; }

  @keyframes sgFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes sgRise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

  @media (prefers-reduced-motion: reduce) {
    .sg-pat, .sg-img-wrap, .sg-rise { animation: none; }
    .sg-img-wrap img { transition: none; }
    .sg-hero:hover .sg-img-wrap img { transform: none; }
  }
`;

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const { products } = useProducts();

  const bestSeller = products.find((p) => p.isBestSeller) || null;
  const slides = bestSeller
    ? [
        {
          id: "best-seller",
          eyebrow: "Our #1 Best Seller",
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
    <section className="w-full">
      <style>{HERO_CSS}</style>
      <Link
        to={slide.productId ? `/product/${slide.productId}` : "/products"}
        aria-label={slide.title}
        className="sg-hero group relative block w-full overflow-hidden h-[200px] sm:h-[300px]"
      >
        {/* Pattern changes with every slide */}
        <div
          key={`p-${slide.id}`}
          className={`sg-pat sg-pat-${PATTERN_BY_SLIDE[slide.id] ?? 4}`}
        />

        {/* Image — fades into the pattern, runs to the right edge */}
        <div key={`i-${slide.id}`} className="sg-img-wrap">
          <img
            loading={index === 0 ? undefined : "lazy"}
            decoding="async"
            fetchpriority={index === 0 ? "high" : undefined}
            src={slide.image}
            alt=""
            className="w-full h-full object-cover object-right"
          />
        </div>

        {/* Text block */}
        <div
          key={`t-${slide.id}`}
          className="relative z-10 h-full w-[46%] sm:w-[42%] flex flex-col items-center justify-center text-center pl-3 pr-1 sm:px-6 lg:px-10"
        >
          <span
            className="sg-rise inline-block font-heading font-bold uppercase tracking-wide rounded-full bg-white/85 shadow-sm px-2 py-0.5 sm:px-3.5 sm:py-1 mb-1.5 sm:mb-3"
            style={{
              color: "var(--color-red)",
              fontSize: "clamp(0.5rem, 1.05vw, 0.85rem)",
            }}
          >
            {slide.eyebrow}
          </span>
          <h1
            className="sg-rise sg-rise-2 font-heading leading-[1.08] mb-1 sm:mb-3"
            style={{
              fontSize: "clamp(0.95rem, 2.6vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--color-blue)",
            }}
          >
            {slide.title}
          </h1>
          <p
            className="sg-rise sg-rise-3 font-body text-gray-600 leading-snug max-w-[24rem] hidden sm:block"
            style={{ fontSize: "clamp(0.7rem, 1vw, 0.9rem)" }}
          >
            {slide.copy}
          </p>
        </div>

        {/* Dots under the text block */}
        <div className="absolute bottom-2 sm:bottom-3.5 left-[23%] sm:left-[21%] -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Show ${s.title}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIndex(i);
              }}
              className="h-2 sm:h-2.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? "1.4rem" : "0.5rem",
                backgroundColor:
                  i === index ? "var(--color-red)" : "rgba(1,0,40,0.25)",
              }}
            />
          ))}
        </div>
      </Link>
    </section>
  );
}