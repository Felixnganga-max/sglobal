import React, { useState } from "react";
import { useProducts } from "../../lib/useProducts";
import ProductTile from "./ProductTile";

const TABS = [
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

  const items = products
    .filter((p) => TABS[activeTab].categories.includes(p.category))
    .slice(0, 6);

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
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-full text-xs font-body font-bold uppercase tracking-wide transition-all border ${
                activeTab === i
                  ? "text-white border-transparent"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
              style={
                activeTab === i
                  ? { backgroundColor: "var(--color-red)" }
                  : undefined
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
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
