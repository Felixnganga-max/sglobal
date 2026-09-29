import React, { useState } from "react";
import { useProducts } from "../../lib/useProducts";
import { isPriority, mixPriority } from "../../lib/priorityMix";
import ProductTile from "../ProductTile";

const ITEMS_COUNT = 9; // 3x3: 8 Kent/Spuds + 1 other on the default tab (~90%)

// "Top Picks" is the default tab and carries the Kent + Spuds mix.
// categories: null = all products.
const TABS = [
  { label: "Top Picks", categories: null },
  {
    label: "Snacks",
    categories: ["Craft cooked potato chips", "Just fruits", "Hum Hum"],
  },
  {
    label: "Soups & Stocks",
    categories: ["Kent soups", "Kent stocks"],
  },
  {
    label: "Baking & Toppings",
    categories: [
      "Cakemix",
      "Brownie & Pancake",
      "Whipped creams",
      "Boringer topping sauces",
    ],
  },
  {
    label: "Sauces & More",
    categories: ["Kent sauces", "Kent syrups", "Kent spreads", "Water"],
  },
];

export default function RecommendedForYou() {
  const { products, loading } = useProducts();
  const [activeTab, setActiveTab] = useState(0);

  const tab = TABS[activeTab];

  const items = tab.categories
    ? products
        .filter((p) => tab.categories.includes(p.category))
        // Kent/Spuds first inside every tab
        .sort((a, b) => Number(isPriority(b)) - Number(isPriority(a)))
        .slice(0, ITEMS_COUNT)
    : mixPriority(products, ITEMS_COUNT);

  return (
    <section className="page-x section-y bg-soft">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-eyebrow mb-1">Just For You</p>
          <h2 className="text-section-title text-gray-900">
            Recommended for You
          </h2>
          <div className="section-rule mt-2" />
        </div>
        <div className="flex flex-wrap gap-2">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-full text-xs font-body font-bold uppercase tracking-wide transition-all border ${
                activeTab === i
                  ? "text-white border-transparent"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
              style={
                activeTab === i
                  ? { backgroundColor: "var(--color-blue)" }
                  : undefined
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {loading ? (
          [...Array(ITEMS_COUNT)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 animate-pulse"
              style={{ height: 220 }}
            />
          ))
        ) : items.length > 0 ? (
          items.map((p) => <ProductTile key={p._id || p.id} product={p} />)
        ) : (
          <p className="col-span-full text-center text-sm text-gray-400 py-10">
            No products in this range yet — check back soon.
          </p>
        )}
      </div>
    </section>
  );
}