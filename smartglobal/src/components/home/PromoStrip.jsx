import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const STRIPS = [
  {
    id: "pancake",
    title: "Pancake Mixes",
    bg: "linear-gradient(135deg, #d96800 0%, #a34e00 100%)",
    image: assets.top2,
  },
  {
    id: "toppings",
    title: "Topping Sauces",
    bg: "linear-gradient(135deg, #16a34a 0%, #0f6b32 100%)",
    image: assets.topping,
  },
  {
    id: "spuds",
    title: "SPUDS Chips",
    bg: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
    image: assets.spuds,
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
            className="group relative overflow-hidden rounded-2xl flex items-center justify-between px-5 py-5"
            style={{ background: s.bg, minHeight: "110px" }}
          >
            <div>
              <h3 className="font-heading text-white text-sm sm:text-base font-bold leading-tight">
                {s.title}
              </h3>
              <span className="mt-2 inline-flex items-center gap-1 text-white/80 text-[0.65rem] font-body font-bold uppercase tracking-widest">
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
            <img
              loading="lazy"
              decoding="async"
              src={s.image}
              alt=""
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
