import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import ProductTile from "./ProductTile";

import { API_BASE_URL } from "../api/config";
const API_URL = `${API_BASE_URL}/products`;

const PAGE_SIZE = 12;

const SORT_MAP = {
  newest: { sortBy: "createdAt", order: "desc" },
  "price-asc": { sortBy: "price", order: "asc" },
  "price-desc": { sortBy: "price", order: "desc" },
  rating: { sortBy: "rating", order: "desc" },
  name: { sortBy: "title", order: "asc" },
};

/**
 * Live, filtered, sorted, paginated product grid for the Products page.
 * Reads its filters straight from the URL (?q=&category=&sort=&inStock=&page=)
 * so the search box, sidebar category list, and pagination controls all stay
 * in sync without prop drilling.
 */
export default function FeaturedProductsGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const inStock = searchParams.get("inStock") === "true";
  const page = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, sort, inStock, page]);

  const fetchProducts = async () => {
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
      setProducts(data.data || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProducts([]);
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
            onClick={fetchProducts}
            className="btn-primary"
            style={{ fontSize: "0.65rem" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
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
        {products.map((product) => (
          <ProductTile key={product._id} product={product} />
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
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
