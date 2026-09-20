import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LayoutGrid, Headphones, Zap, X } from "lucide-react";
import { assets } from "../assets/assets";
import { useCategoryList } from "../lib/useCatalog";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from "../lib/categoryIcons";

// Where the "Need help?" row goes. Change this if your contact page lives elsewhere.
const CONTACT_PATH = "/contact";

const BRANDS = [
  {
    logo: assets.logo3,
    keyword: "Kent",
    desc: "Soups, stocks & sauces",
    color: "var(--color-red)",
  },
  {
    logo: assets.spuds1,
    keyword: "chips",
    desc: "Craft cooked crisps",
    color: "var(--color-orange)",
  },
  {
    logo: assets.logo2,
    keyword: "Water",
    desc: "Natural spring water",
    color: "var(--color-blue)",
  },
];

const CSS = `
  .ns-side {
    background: #fff; border-radius: 24px; padding: 1rem 0.75rem 0.75rem;
    box-shadow: 0 1px 2px rgba(1,0,40,0.04), 0 10px 30px rgba(1,0,40,0.05);
    display: flex; flex-direction: column; gap: 0.25rem;
  }
  .ns-side-head { display: flex; align-items: center; justify-content: space-between; padding: 0 0.5rem 0.5rem; }
  .ns-side-title { font-family: var(--font-heading); font-weight: 700; font-size: 1.05rem; color: var(--color-blue); margin: 0; }
  .ns-side-close { border: none; background: #f3f4f8; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--color-blue); }
  .ns-side-label { font-family: var(--font-body); font-size: 0.7rem; font-weight: 600; color: var(--color-muted); margin: 0.9rem 0.75rem 0.3rem; }

  .ns-nav-item {
    width: 100%; display: flex; align-items: center; gap: 0.65rem; padding: 0.5rem 0.75rem;
    border: none; border-radius: 14px; background: transparent; cursor: pointer; text-align: left;
    font-family: var(--font-body); font-size: 0.78rem; font-weight: 600; line-height: 1.25; color: var(--color-text);
    transition: background 0.15s, color 0.15s;
  }
  .ns-nav-item:hover { background: #f3f4f8; }
  .ns-nav-item:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 1px; }
  .ns-nav-item.active { background: var(--color-blue); color: #fff; }
  .ns-nav-icon {
    width: 28px; height: 28px; flex-shrink: 0; border-radius: 9px; background: #f3f4f8;
    display: flex; align-items: center; justify-content: center; font-size: 0.9rem; color: var(--color-blue);
  }
  .ns-nav-item.active .ns-nav-icon { background: rgba(255,255,255,0.14); color: #fff; }
  .ns-nav-text { flex: 1; min-width: 0; }
  .ns-count {
    margin-left: auto; flex-shrink: 0; padding: 2px 8px; border-radius: 999px;
    background: #eef0f7; color: var(--color-muted); font-size: 0.6rem; font-weight: 700;
  }
  .ns-nav-item.active .ns-count { background: rgba(255,255,255,0.18); color: #fff; }

  .ns-divider { height: 1px; background: #eceef5; margin: 0.75rem 0.5rem 0; }

  .ns-brands { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; padding: 0 0.5rem; }
  .ns-brand {
    display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 14px;
    border: 1px solid transparent; background: #f3f4f8; cursor: pointer; transition: border-color 0.2s, background 0.2s;
  }
  .ns-brand:hover { background: #fff; }
  .ns-brand img { width: 100%; height: 48px; object-fit: contain; }

  .ns-side-promo {
    position: relative; overflow: hidden; margin: 1rem 0.25rem 0.25rem; padding: 1.1rem; border-radius: 20px;
    background: var(--color-blue); color: #fff; min-height: 168px;
  }
  .ns-side-promo h4 { font-family: var(--font-heading); font-weight: 700; font-size: 1.3rem; line-height: 1.15; margin: 0 0 4px; max-width: 70%; }
  .ns-side-promo p { font-family: var(--font-body); font-size: 0.72rem; line-height: 1.45; color: rgba(255,255,255,0.72); margin: 0 0 14px; max-width: 68%; }
  .ns-side-promo .circle { position: absolute; border-radius: 50%; pointer-events: none; }
  .ns-side-promo .c1 { width: 120px; height: 120px; right: -34px; bottom: -40px; background: var(--color-blue-light); opacity: 0.6; }
  .ns-side-promo .c2 { width: 26px; height: 26px; right: 22px; top: 18px; background: var(--color-orange); }
  .ns-side-promo .ico {
    position: absolute; right: 16px; bottom: 16px; width: 54px; height: 54px; border-radius: 16px;
    background: var(--color-red); color: #fff; display: flex; align-items: center; justify-content: center; transform: rotate(-8deg);
  }

  .ns-help {
    display: flex; align-items: center; gap: 0.75rem; margin: 0.5rem 0.25rem 0; padding: 0.7rem 0.75rem;
    border-radius: 16px; background: #f3f4f8; text-decoration: none; transition: background 0.2s;
  }
  .ns-help:hover { background: #e9e9f3; }
  .ns-help .ico { width: 34px; height: 34px; border-radius: 50%; background: #fff; color: var(--color-blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ns-help b { display: block; font-family: var(--font-body); font-size: 0.75rem; font-weight: 700; color: var(--color-text); }
  .ns-help small { display: block; font-family: var(--font-body); font-size: 0.65rem; color: var(--color-muted); }

  @keyframes ns-side-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
  .ns-side-skel { animation: ns-side-pulse 1.5s ease-in-out infinite; }
`;

/**
 * Left sidebar. `onClose` / `onSelect` are only passed when it's shown inside
 * the mobile drawer (close button + close after picking something).
 */
export default function ShopByCategory({ onClose, onSelect }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, counts, total, loading } = useCategoryList();

  const activeCategory = searchParams.get("category") || null;
  const isAll = !activeCategory && !searchParams.get("q");

  function goToFeaturedProducts() {
    const el = document.getElementById("featured-products");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleAllClick() {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("q");
    params.delete("page");
    setSearchParams(params);
    goToFeaturedProducts();
    onSelect?.();
  }

  function handleCategoryClick(cat) {
    const params = new URLSearchParams(searchParams);
    if (activeCategory === cat) {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    params.delete("page");
    setSearchParams(params);
    goToFeaturedProducts();
    onSelect?.();
  }

  function handleBrandClick(brand) {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.set("q", brand.keyword);
    params.delete("page");
    setSearchParams(params);
    goToFeaturedProducts();
    onSelect?.();
  }

  return (
    <nav className="ns-side" aria-label="Shop by category">
      <style>{CSS}</style>

      <div className="ns-side-head">
        <h2 className="ns-side-title">Shop</h2>
        {onClose && (
          <button
            type="button"
            className="ns-side-close"
            onClick={onClose}
            aria-label="Close categories"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button
        type="button"
        className={`ns-nav-item${isAll ? " active" : ""}`}
        onClick={handleAllClick}
        aria-current={isAll ? "page" : undefined}
      >
        <span className="ns-nav-icon">
          <LayoutGrid size={15} />
        </span>
        <span className="ns-nav-text">All products</span>
        {total > 0 && <span className="ns-count">{total}</span>}
      </button>

      <p className="ns-side-label">Categories</p>

      {loading
        ? [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="ns-nav-item ns-side-skel"
              aria-hidden="true"
            >
              <span className="ns-nav-icon" />
              <span
                style={{
                  height: 10,
                  width: "62%",
                  borderRadius: 5,
                  background: "#f3f4f8",
                }}
              />
            </div>
          ))
        : categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`ns-nav-item${isActive ? " active" : ""}`}
                onClick={() => handleCategoryClick(cat)}
                aria-pressed={isActive}
              >
                <span className="ns-nav-icon" aria-hidden="true">
                  {CATEGORY_ICONS[cat] || DEFAULT_CATEGORY_ICON}
                </span>
                <span className="ns-nav-text">{cat}</span>
                <span className="ns-count">{counts[cat]}</span>
              </button>
            );
          })}

      <div className="ns-divider" />

      <p className="ns-side-label">Our brands</p>
      <div className="ns-brands">
        {BRANDS.map((brand) => (
          <button
            key={brand.keyword}
            type="button"
            className="ns-brand"
            onClick={() => handleBrandClick(brand)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = brand.color)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "transparent")
            }
            aria-label={`${brand.keyword}: ${brand.desc}`}
          >
            <img loading="lazy" decoding="async" src={brand.logo} alt="" />
          </button>
        ))}
      </div>

      <div className="ns-side-promo">
        <span className="circle c1" aria-hidden="true" />
        <span className="circle c2" aria-hidden="true" />
        <h4>Fast processing</h4>
        <p>Same day dispatch, delivered countrywide.</p>
        <button
          type="button"
          className="btn-primary"
          style={{ fontSize: "0.65rem", padding: "0.55rem 1.2rem" }}
          onClick={() => {
            goToFeaturedProducts();
            onSelect?.();
          }}
        >
          Shop now
        </button>
        <span className="ico" aria-hidden="true">
          <Zap size={26} />
        </span>
      </div>

      <Link to={CONTACT_PATH} className="ns-help" onClick={onSelect}>
        <span className="ico">
          <Headphones size={16} />
        </span>
        <span>
          <b>Need help?</b>
          <small>Talk to our team</small>
        </span>
      </Link>
    </nav>
  );
}
