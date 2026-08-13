import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const STRIPS = [
  {
    id: "pancake",
    title: "Pancake Mixes",
    image: assets.kentt,
    // Scrim tuned to each photo's own brand tone (not flat black) so the
    // card reads as one cohesive photographic panel, not a sticker on a
    // solid swatch — darkest behind the text, fading out over the image.
    overlay:
      "linear-gradient(0deg, rgba(163,78,0,0.94) 0%, rgba(163,78,0,0.62) 42%, rgba(163,78,0,0.08) 78%, rgba(163,78,0,0) 100%)",
  },
  {
    id: "toppings",
    title: "Topping Sauces",
    image: assets.toppingg,
    overlay:
      "linear-gradient(0deg, rgba(15,107,50,0.94) 0%, rgba(15,107,50,0.62) 42%, rgba(15,107,50,0.08) 78%, rgba(15,107,50,0) 100%)",
  },
  {
    id: "spuds",
    title: "SPUDS Chips",
    image: assets.spudss,
    overlay:
      "linear-gradient(0deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.62) 42%, rgba(0,0,0,0.08) 78%, rgba(0,0,0,0) 100%)",
  },
];

export default function PromoStrip() {
  return (
    <section className="page-x pt-4 pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STRIPS.map((s) => (
          <Link
            key={s.id}
            to={`/products#cat-${encodeURIComponent(s.id)}`}
            className="group relative overflow-hidden rounded-2xl flex flex-col justify-end px-5 py-5"
            style={{ minHeight: "170px" }}
          >
            <img
              loading="lazy"
              decoding="async"
              src={s.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0" style={{ background: s.overlay }} />
            <div className="relative z-10">
              <h3 className="font-heading text-white text-sm sm:text-base font-bold leading-tight drop-shadow-sm">
                {s.title}
              </h3>
              <span className="mt-2 inline-flex items-center gap-1 text-white/90 text-[0.65rem] font-body font-bold uppercase tracking-widest">
                Shop Now
                <svg
                  className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
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
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
