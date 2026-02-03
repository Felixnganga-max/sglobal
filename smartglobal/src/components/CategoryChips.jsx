import React from "react";

/**
 * CategoryChips.jsx
 * Horizontal scrollable chips for categories
 * Colors: Red (#BF1A1A), Yellow (#FFD41D), Black, White, Brown (#7B4019)
 * No icons - clean design
 */

export default function CategoryChips({
  categories = [],
  activeIndex = 0,
  onCategoryChange,
}) {
  return (
    <div className="py-4">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category, i) => (
          <button
            key={i}
            onClick={() => onCategoryChange?.(i)}
            className={`flex-shrink-0 inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all ${
              i === activeIndex
                ? "bg-[#BF1A1A] text-white border-[#BF1A1A] shadow-lg"
                : "bg-white text-[#7B4019] border-[#FFD41D] hover:border-[#BF1A1A] hover:bg-[#FFF8E7]"
            }`}
            aria-pressed={i === activeIndex}
          >
            <span className="text-sm font-medium whitespace-nowrap">
              {category}
            </span>
            {i === activeIndex && <span className="text-white">→</span>}
          </button>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
