import React, { useEffect, useState } from "react";

const API_URL = "https://sglobal-plf6.vercel.app/smartglobal/products";
import { assets } from "../assets/assets";

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
    name: assets.logo3,
    desc: "Soups, stocks & sauces",
    color: "var(--color-red)",
    letter: "K",
  },
  {
    name: assets.logo2,
    desc: "Craft cooked crisps",
    color: "var(--color-orange)",
    letter: "F",
  },
  {
    name: assets.logo1,
    desc: "Natural spring water",
    color: "var(--color-blue)",
    letter: assets.logo1,
  },
];

// Must match the slugify used in FeaturedProductsGrid
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function scrollToCategory(category) {
  // FeaturedProductsGrid uses id="cat-${category}" — raw category string (NOT slugified)
  const rawId = `cat-${category}`;
  let el = document.getElementById(rawId);

  // fallback: try slugified version in case it changed
  if (!el) {
    el = document.getElementById(`cat-${slugify(category)}`);
  }

  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
  } else {
    const fallback = document.getElementById("featured-products");
    if (fallback)
      fallback.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function scrollToBrand(brandName) {
  const keyword = brandName.split(" ")[0].toLowerCase(); // "Kent", "Food", "Kizembe"
  const allSections = document.querySelectorAll("[id^='cat-']");
  for (const section of allSections) {
    if (section.id.toLowerCase().includes(keyword)) {
      const top = section.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
      return;
    }
  }
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
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "sticky",
        top: "1.5rem",
      }}
    >
      {/* ── Shop by Category ── */}
      <div
        style={{
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          background: "#fff",
        }}
      >
        {/* Header — flat red, no gradient */}
        <div
          style={{
            padding: "0.875rem 1.125rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--color-red)",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
                marginBottom: "2px",
              }}
            >
              Browse
            </p>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#fff",
                margin: 0,
              }}
            >
              Shop by Category
            </h4>
          </div>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.58rem",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "100px",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
            }}
          >
            {categories.length}
          </span>
        </div>

        {/* Category list */}
        <div style={{ backgroundColor: "#fff" }}>
          {loading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 18px",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: "var(--color-bg-soft)",
                      flexShrink: 0,
                      animation: "sbc-pulse 1.5s ease-in-out infinite",
                    }}
                  />
                  <div
                    style={{
                      height: 10,
                      background: "var(--color-bg-soft)",
                      borderRadius: 5,
                      width: "65%",
                      animation: "sbc-pulse 1.5s ease-in-out infinite",
                    }}
                  />
                </div>
              ))
            : categories.map((cat, idx) => {
                const isActive = active === cat;
                const isLast = idx === categories.length - 1;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 18px",
                      textAlign: "left",
                      cursor: "pointer",
                      border: "none",
                      borderBottom: isLast
                        ? "none"
                        : "1px solid var(--color-border)",
                      borderLeft: isActive
                        ? "3px solid var(--color-orange)"
                        : "3px solid transparent",
                      backgroundColor: isActive
                        ? "rgba(255,127,17,0.06)"
                        : "transparent",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor =
                          "var(--color-bg-soft)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                        flexShrink: 0,
                        backgroundColor: isActive
                          ? "rgba(255,127,17,0.12)"
                          : "var(--color-bg-soft)",
                        border: "1px solid var(--color-border)",
                        transition: "background 0.15s",
                      }}
                    >
                      {CATEGORY_ICONS[cat] || "🛒"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        flex: 1,
                        color: isActive
                          ? "var(--color-orange)"
                          : "var(--color-text)",
                        transition: "color 0.15s",
                      }}
                    >
                      {cat}
                    </span>
                    <svg
                      style={{
                        width: 12,
                        height: 12,
                        flexShrink: 0,
                        color: isActive
                          ? "var(--color-orange)"
                          : "var(--color-muted)",
                        transition: "color 0.15s",
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
        style={{
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          background: "#fff",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "0.75rem 1.125rem",
            backgroundColor: "var(--color-bg-soft)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-orange)",
              marginBottom: 2,
            }}
          >
            Trusted names
          </p>
          <h4
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "var(--color-text)",
              margin: 0,
            }}
          >
            Our Brands
          </h4>
        </div>

        <div
          style={{
            padding: "0.875rem",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.625rem",
          }}
        >
          {BRANDS.map((brand) => (
            <button
              key={brand.name}
              onClick={() => handleBrandClick(brand)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0px",
                padding: "8px",
                borderRadius: "10px",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-bg-soft)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = brand.color;
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.backgroundColor = "var(--color-bg-soft)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <img
                src={brand.name}
                alt={brand.desc}
                style={{
                  width: "200%",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes sbc-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}</style>
    </aside>
  );
}
