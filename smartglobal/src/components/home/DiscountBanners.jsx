import React from "react";
import { Link } from "react-router-dom";
import { categoryAnchor } from "../../lib/categories";

const BANNERS = [
  {
    id: "soups",
    title: "20% Off Kent Soups",
    subtitle: "This Week Only",
    bg: "linear-gradient(120deg, var(--color-blue) 0%, var(--color-blue-dark) 100%)",
    to: `/products#${categoryAnchor("Kent soups")}`,
  },
  {
    id: "snacks",
    title: "Mega Snack Deals",
    subtitle: "SPUDS & Toppings",
    bg: "linear-gradient(120deg, #7B4019 0%, #4a2610 100%)",
    to: `/products#${categoryAnchor("Craft cooked potato chips")}`,
  },
];

export default function DiscountBanners() {
  return (
    <section className="page-x pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BANNERS.map((b) => (
          <Link
            key={b.id}
            to={b.to}
            className="group relative overflow-hidden rounded-2xl p-7 flex flex-col justify-center"
            style={{ background: b.bg, minHeight: "140px" }}
          >
            <p className="text-eyebrow mb-1" style={{ color: "#FFD41D" }}>
              {b.subtitle}
            </p>
            <h3 className="font-heading text-white text-xl sm:text-2xl font-bold leading-tight mb-3">
              {b.title}
            </h3>
            <span className="inline-flex items-center gap-1 text-white/85 text-[0.68rem] font-body font-bold uppercase tracking-widest self-start">
              Shop Now
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
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
