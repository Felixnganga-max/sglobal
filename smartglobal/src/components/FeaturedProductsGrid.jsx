import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductTile from "./ProductTile";
import { PRODUCT_CATEGORIES, categoryAnchor } from "../lib/categories";

import { API_BASE_URL } from "../api/config";
const API_URL = `${API_BASE_URL}/products`;

const PAGE_SIZE = 12;
const SECTION_PREVIEW_SIZE = 8;

const SORT_MAP = {
  newest: { sortBy: "createdAt", order: "desc" },
  "price-asc": { sortBy: "price", order: "asc" },
  "price-desc": { sortBy: "price", order: "desc" },
  rating: { sortBy: "rating", order: "desc" },
  name: { sortBy: "title", order: "asc" },
};

const SORTERS = {
  newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  "price-asc": (a, b) => (a.price || 0) - (b.price || 0),
  "price-desc": (a, b) => (b.price || 0) - (a.price || 0),
  rating: (a, b) => (b.rating || 0) - (a.rating || 0),
  name: (a, b) => (a.title || "").localeCompare(b.title || ""),
};

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

function getImage(product) {
  return (
    product.images?.[0]?.url ||
    product.image?.url ||
    product.imageUrl ||
    product.img ||
    product.photo ||
    FALLBACK_IMG
  );
}

/**
 * Live, filtered, sorted, paginated product grid for the Products page.
 * Reads its filters straight from the URL (?q=&category=&sort=&inStock=&page=).
 *
 * Two modes:
 *  - Browse (no q, no category): products are grouped into per-category
 *    sections so a hero/category link can deep-link straight to a section
 *    via /products#cat-<slug>. The site's flagged top-seller is spotlighted
 *    once at the top and excluded from its own section below.
 *  - Filtered (q or category set): a single flat, server-paginated grid —
 *    same as a normal search/category result page.
 */
export default function FeaturedProductsGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const inStock = searchParams.get("inStock") === "true";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const browseMode = !q && category === "all";

  // ── Flat (filtered/search) mode state ──
  const [flatProducts, setFlatProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // ── Browse mode state ──
  const [allProducts, setAllProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (browseMode) {
      fetchAllProducts();
    } else {
      fetchFlatProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, sort, inStock, page, browseMode]);

  // Scroll straight to the requested category section once it's rendered.
  useEffect(() => {
    if (loading || !browseMode || !location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const timer = setTimeout(
        () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
        50,
      );
      return () => clearTimeout(timer);
    }
  }, [loading, browseMode, location.hash]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}?limit=300&sortBy=createdAt&order=desc`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch products");
      setAllProducts(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlatProducts = async () => {
    try {
      setLoading(true);
      const { sortBy, order } = SORT_MAP[sort] || SORT_MAP.newest;
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        sortBy,
        order,
      });
      if (q) params.set("search", q);
      if (category !== "all") params.set("category", category);
      if (inStock) params.set("inStock", "true");

      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Failed to fetch products");
      setFlatProducts(data.data || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setError(null);
    } catch (err) {
      setError(err.message);
      setFlatProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (nextPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const viewAllInCategory = (cat) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", cat);
    params.delete("page");
    setSearchParams(params);
    document
      .getElementById("featured-products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "0.875rem",
        }}
      >
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 0" }}>
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "2rem",
            maxWidth: 380,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              color: "var(--color-red)",
              marginBottom: 8,
              fontSize: "0.85rem",
            }}
          >
            Unable to load products
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--color-muted)",
              marginBottom: "1rem",
            }}
          >
            {error}
          </p>
          <button
            onClick={browseMode ? fetchAllProducts : fetchFlatProducts}
            className="btn-primary"
            style={{ fontSize: "0.65rem" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Flat (filtered/search) mode ──
  if (!browseMode) {
    if (flatProducts.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <Search className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--color-border)" }} />
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              color: "var(--color-muted)",
              fontSize: "0.85rem",
            }}
          >
            No products match these filters.
          </p>
        </div>
      );
    }

    return (
      <div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            color: "var(--color-muted)",
            marginBottom: "0.875rem",
          }}
        >
          {total} product{total !== 1 ? "s" : ""} found
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "0.875rem",
          }}
        >
          {flatProducts.map((product) => (
            <ProductTile key={product._id} product={product} />
          ))}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:border-blue hover:text-blue transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--color-text)",
                padding: "0 0.5rem",
              }}
            >
              Page {page} of {pages}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= pages}
              className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:border-blue hover:text-blue transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Browse mode — grouped by category ──
  let pool = allProducts;
  if (inStock) pool = pool.filter((p) => p.stock > 0);
  const sorter = SORTERS[sort] || SORTERS.newest;

  const bestSeller = pool.find((p) => p.isBestSeller) || null;
  const rankAndFile = pool.filter((p) => !p.isBestSeller);

  const sections = PRODUCT_CATEGORIES.map((cat) => ({
    category: cat,
    products: rankAndFile.filter((p) => p.category === cat).sort(sorter),
  })).filter((s) => s.products.length > 0);

  if (pool.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 0" }}>
        <Search className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--color-border)" }} />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            color: "var(--color-muted)",
            fontSize: "0.85rem",
          }}
        >
          No products available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {bestSeller && (
        <Link
          to={`/product/${bestSeller._id || bestSeller.id}`}
          className="group relative flex flex-col sm:flex-row items-center gap-5 overflow-hidden rounded-2xl p-5 sm:p-7"
          style={{ background: "linear-gradient(120deg, #1a1a1a 0%, #3a2410 100%)" }}
        >
          <div className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-white/95 flex items-center justify-center overflow-hidden">
            <img
              loading="lazy"
              decoding="async"
              src={getImage(bestSeller)}
              alt={bestSeller.title}
              className="w-full h-full object-contain p-2.5 group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMG;
              }}
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-body text-[0.6rem] font-black uppercase tracking-widest mb-2"
              style={{ backgroundColor: "#FFD41D", color: "#1a1a1a" }}
            >
              ⭐ Our #1 Best Seller
            </span>
            <h3 className="font-heading text-white text-lg sm:text-xl font-bold leading-tight mb-2">
              {bestSeller.title}
            </h3>
            <span className="font-heading font-bold text-base" style={{ color: "var(--color-orange)" }}>
              KSh {(bestSeller.totalPrice ?? bestSeller.price)?.toLocaleString()}
            </span>
          </div>
          <span className="btn-secondary text-xs flex-shrink-0">Shop Now</span>
        </Link>
      )}

      {sections.map(({ category: cat, products }) => (
        <section
          key={cat}
          id={categoryAnchor(cat)}
          style={{ scrollMarginTop: "110px" }}
        >
          <div className="flex items-end justify-between mb-4 gap-3">
            <div>
              <h3
                className="font-heading font-bold text-[var(--heading)]"
                style={{ fontSize: "1.1rem" }}
              >
                {cat}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.68rem",
                  color: "var(--color-muted)",
                }}
              >
                {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>
            {products.length > SECTION_PREVIEW_SIZE && (
              <button
                onClick={() => viewAllInCategory(cat)}
                className="inline-flex items-center gap-1 text-xs font-body font-bold whitespace-nowrap"
                style={{ color: "var(--color-blue)" }}
              >
                View all <ArrowRight size={12} />
              </button>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "0.875rem",
            }}
          >
            {products.slice(0, SECTION_PREVIEW_SIZE).map((product) => (
              <ProductTile key={product._id || product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
        overflow: "hidden",
        animation: "fpg-pulse 1.5s ease-in-out infinite",
      }}
    >
      <div style={{ aspectRatio: "1/1", background: "var(--color-bg-soft)" }} />
      <div
        style={{
          padding: "0.625rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            height: 10,
            background: "var(--color-border)",
            borderRadius: 4,
            width: "80%",
          }}
        />
        <div
          style={{
            height: 10,
            background: "var(--color-border)",
            borderRadius: 4,
            width: "55%",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: 14,
              background: "var(--color-border)",
              borderRadius: 4,
              width: "35%",
            }}
          />
          <div
            style={{
              height: 22,
              background: "var(--color-border)",
              borderRadius: 100,
              width: 52,
            }}
          />
        </div>
      </div>
      <style>{`@keyframes fpg-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
    </div>
  );
}
