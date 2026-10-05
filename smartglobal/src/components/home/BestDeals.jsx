import React from "react";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { useProducts } from "../../lib/useProducts";
import { isPriority, isCubes, mixPriority } from "../../lib/priorityMix";
import ProductTile from "../ProductTile";
import {assets} from "../../assets/assets";

const DEALS_COUNT = 6; // ~50% cubes (3), the rest Kent/Spuds first

export default function BestDeals() {
  const { products, loading } = useProducts();

  // Badged products first; unbadged cubes and Kent/Spuds follow so the grid
  // still fills with them when few carry a badge. mixPriority then puts
  // cubes at ~50% of the slots and fills the rest with Kent/Spuds.
  const pool = [
    ...products.filter((p) => p.badge),
    ...products.filter((p) => !p.badge && (isCubes(p) || isPriority(p))),
  ];
  const deals = mixPriority(pool, DEALS_COUNT);

  if (!loading && deals.length === 0) return null;

  return (
    <section className="page-x section-y bg-soft">
      <div className="mb-6 text-center">
        <p className="text-eyebrow mb-1">Limited Time</p>
        <h2 className="text-section-title text-gray-900">Best Deals</h2>
        <div className="section-rule-center mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Hot deals side panel */}
        <Link
          to="/products"
          className="group relative overflow-hidden rounded-2xl flex flex-col justify-between p-6"
          style={{
            background:
              "linear-gradient(160deg, var(--color-red) 0%, var(--color-red-dark) 100%)",
            minHeight: "220px",
          }}
        >
          <div>
            <Flame className="w-8 h-8 text-white mb-3" />
            <h3 className="font-heading text-white text-lg font-bold leading-tight">
              Hot Deals
              <br />
              This Week
            </h3>
            <p className="text-white/70 text-xs mt-2 leading-relaxed">
              Fresh markdowns on Kent sauces, syrups &amp; craft chips — while
              stocks last.
            </p>
          </div>

          {/* Deal images */}
          <div className="my-4 flex flex-col gap-3 items-center">
            <img
              loading="lazy"
              decoding="async"
              src={assets.best}
              alt="Best deals"
              className="w-full h-28 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
            />
            <div className="w-full grid grid-cols-2 gap-3">
              <img
                loading="lazy"
                decoding="async"
                src={assets.bst}
                alt=""
                className="w-full h-20 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
              />
              <img
                loading="lazy"
                decoding="async"
                src={assets.st}
                alt=""
                className="w-full h-20 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <span className="mt-2 inline-flex items-center gap-1 text-white text-[0.68rem] font-body font-bold uppercase tracking-widest">
            Shop All Deals
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

        {/* Deals grid */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {loading
            ? [...Array(DEALS_COUNT)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 animate-pulse"
                  style={{ height: 220 }}
                />
              ))
            : deals.map((p) => (
                <ProductTile key={p._id || p.id} product={p} />
              ))}
        </div>
      </div>
    </section>
  );
}