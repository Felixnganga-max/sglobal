import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../lib/useProducts";
import ProductTile from "./ProductTile";

export default function TrendingThisWeek() {
  const { products, loading } = useProducts();

  const trending = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  if (!loading && trending.length === 0) return null;

  return (
    <section className="page-x section-y">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-eyebrow mb-1">Popular Right Now</p>
          <h2 className="text-section-title text-gray-900">
            Trending This Week
          </h2>
          <div className="section-rule mt-2" />
        </div>
        <Link
          to="/products"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-body font-bold uppercase tracking-widest"
          style={{ color: "var(--color-red)" }}
        >
          View All Products
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {loading
          ? [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 animate-pulse"
                style={{ height: 220 }}
              />
            ))
          : trending.map((p) => (
              <ProductTile key={p._id || p.id} product={p} />
            ))}
      </div>
    </section>
  );
}
