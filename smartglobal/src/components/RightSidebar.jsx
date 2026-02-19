import React, { useEffect, useState } from "react";

const API_URL = "https://smartglobal-3jfl.vercel.app/smartglobal/products";

const CATEGORY_ICONS = {
  "Craft cooked potato chips": "🥔",
  "Just fruits": "🍓",
  "Hum Hum": "🌶️",
  Cakemix: "🎂",
  "Brownie & Pancake": "🥞",
  "Whipped creams": "🍦",
  "Boringer topping sauces": "🍯",
  "Kent soups": "🍲",
  "Kent stocks": "🫙",
  "Kent sauces": "🫕",
  "Kent spreads": "🧈",
  "Kizembe spring water": "💧",
};

const BRANDS = [
  {
    name: "Kent",
    desc: "Soups, stocks & sauces",
    color: "var(--color-red)",
    letter: "K",
  },
  {
    name: "SPUDS",
    desc: "Craft cooked crisps",
    color: "var(--color-orange)",
    letter: "S",
  },
  {
    name: "Kizembe",
    desc: "Natural spring water",
    color: "var(--color-blue)",
    letter: "K",
  },
  {
    name: "Boringer",
    desc: "Toppings & sauces",
    color: "var(--color-orange-dark)",
    letter: "B",
  },
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function scrollToCategory(category) {
  const id = `cat-${slugify(category)}`;
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });
  } else {
    // fallback — scroll to featured-products section
    const fallback = document.getElementById("featured-products");
    if (fallback)
      fallback.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function scrollToBrand(brandName) {
  // brands are substrings of category names e.g. "Kent" matches "Kent soups"
  const allSections = document.querySelectorAll("[id^='cat-']");
  for (const section of allSections) {
    if (section.id.includes(brandName.toLowerCase())) {
      const top = section.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
      return;
    }
  }
  // fallback
  const fallback = document.getElementById("featured-products");
  if (fallback) fallback.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => {
        const list = data.success
          ? data.data || []
          : Array.isArray(data)
            ? data
            : [];
        // unique categories preserving order
        const seen = new Set();
        const cats = [];
        list.forEach((p) => {
          const cat = p.category || "Other";
          if (!seen.has(cat)) {
            seen.add(cat);
            cats.push(cat);
          }
        });
        setCategories(cats);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  function handleCategoryClick(cat) {
    setActive(cat);
    scrollToCategory(cat);
  }

  function handleBrandClick(brand) {
    setActive(null);
    scrollToBrand(brand.name);
  }

  return (
    <aside className="space-y-5 sticky top-6">
      {/* ── Shop by Category ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--color-border)" }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-dark) 100%)",
          }}
        >
          <div>
            <p className="font-body text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/70 mb-0.5">
              Browse
            </p>
            <h4 className="font-heading font-bold text-white text-base">
              Shop by Category
            </h4>
          </div>
          <span className="font-body text-[0.6rem] font-bold px-2.5 py-1 rounded-full bg-white/15 text-white">
            {categories.length} categories
          </span>
        </div>

        {/* Category list */}
        <div
          className="bg-white divide-y"
          style={{ divideColor: "var(--color-border)" }}
        >
          {loading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3 animate-pulse"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              ))
            : categories.map((cat) => {
                const isActive = active === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-150 group"
                    style={{
                      backgroundColor: isActive
                        ? "rgba(255,127,17,0.07)"
                        : "transparent",
                      borderLeft: isActive
                        ? "3px solid var(--color-orange)"
                        : "3px solid transparent",
                    }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,127,17,0.12)"
                          : "var(--color-bg-soft)",
                      }}
                    >
                      {CATEGORY_ICONS[cat] || "🛒"}
                    </span>
                    <span
                      className="font-body text-xs font-semibold flex-1 transition-colors duration-150"
                      style={{
                        color: isActive
                          ? "var(--color-orange)"
                          : "var(--color-text)",
                      }}
                    >
                      {cat}
                    </span>
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                      style={{
                        color: isActive
                          ? "var(--color-orange)"
                          : "var(--color-muted)",
                      }}
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
                );
              })}
        </div>
      </div>

      {/* ── Our Brands ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--color-border)" }}
      >
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{
            backgroundColor: "var(--color-bg-soft)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <p className="text-eyebrow mb-0.5">Trusted names</p>
          <h4
            className="font-heading font-bold text-sm"
            style={{ color: "var(--color-text)" }}
          >
            Our Brands
          </h4>
        </div>

        <div className="bg-white p-4 grid grid-cols-2 gap-3">
          {BRANDS.map((brand) => (
            <button
              key={brand.name}
              onClick={() => handleBrandClick(brand)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 group hover:shadow-md"
              style={{
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-bg-soft)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = brand.color;
                e.currentTarget.style.backgroundColor = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.backgroundColor = "var(--color-bg-soft)";
              }}
            >
              {/* Brand monogram */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-heading font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: brand.color }}
              >
                {brand.letter}
              </div>
              <div className="text-center">
                <p
                  className="font-heading font-bold text-xs"
                  style={{ color: "var(--color-text)" }}
                >
                  {brand.name}
                </p>
                <p
                  className="font-body text-[0.58rem] leading-tight mt-0.5"
                  style={{ color: "var(--color-muted)" }}
                >
                  {brand.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
