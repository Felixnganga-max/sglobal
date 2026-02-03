import React from "react";
import { assets } from "../assets/assets";

/**
 * HeroPromo Component
 * Colors: Red (#BF1A1A), Yellow (#FFD41D), Black, White, Brown (#7B4019)
 * Left: Large hero promo with product image and price badge
 * Right: Three stacked small promo cards
 * Full width design with white background
 */

export default function HeroPromo() {
  return (
    <section aria-label="Hero promo" className="relative bg-white ">
      <div className="mx-auto max-w-[1600px]">
        <div className="rounded-3xl bg-white p-2md:p-8 lg:p-10 border-2 border-[#FFD41D] shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Large Hero Promo */}
            <div className="relative lg:col-span-7 bg-[#BF1A1A] rounded-2xl overflow-hidden min-h-[420px] md:min-h-[460px] p-8">
              {/* Content */}
              <div className="relative z-10 max-w-[320px]">
                <h2
                  className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Premium Food Products
                </h2>
                <p className="text-xl text-[#FFD41D] mb-6 font-semibold">
                  For Every Occasion
                </p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-sm text-white/80">Starting from</span>
                  <div className="text-5xl font-black text-[#FFD41D]">
                    $5.99
                  </div>
                </div>

                {/* Button */}
                <button className="px-8 py-4 rounded-full bg-[#FFD41D] text-black font-bold shadow-xl hover:bg-white transition-all duration-300 hover:scale-105">
                  Shop Now
                </button>
              </div>

              {/* Product Image - Large */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[85%]">
                <img
                  src={assets.topping}
                  alt="Premium product"
                  className="w-full h-full object-contain transform rotate-12 drop-shadow-2xl"
                />
              </div>

              {/* Floating decorative elements */}
              <div className="absolute left-8 top-32">
                <img
                  src={assets.top3}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover opacity-60"
                />
              </div>
              <div className="absolute left-32 top-16">
                <img
                  src={assets.top1}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover opacity-50 rotate-45"
                />
              </div>
            </div>

            {/* Right: Small Promo Cards Stack */}
            <div className="lg:col-span-5 space-y-4">
              {/* Card 1: Kent Toppings */}
              <div className="rounded-2xl bg-[#FFF8E1] p-5 flex items-center gap-4 border-2 border-[#FFD41D] hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-24 h-24 bg-white rounded-xl p-2 flex items-center justify-center shadow-md">
                  <img
                    src={assets.top2}
                    alt="Kent Toppings"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#7B4019] mb-1 font-semibold">
                    Premium Toppings
                  </div>
                  <div className="text-2xl font-black text-black mb-2">
                    $5.99
                  </div>
                  <button className="inline-flex items-center gap-2 text-sm font-bold text-[#BF1A1A] hover:text-[#7B4019] transition-colors">
                    Shop Now
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card 2: SPUDS Chips */}
              <div className="rounded-2xl bg-[#FFF0F0] p-5 flex items-center gap-4 border-2 border-[#FFCCCB] hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-24 h-24 bg-white rounded-xl p-2 flex items-center justify-center shadow-md">
                  <img
                    src={assets.spuds}
                    alt="SPUDS Chips"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#7B4019] mb-1 font-semibold">
                    Craft Cooked Chips
                  </div>
                  <div className="text-2xl font-black text-black mb-2">
                    $3.49
                  </div>
                  <button className="inline-flex items-center gap-2 text-sm font-bold text-[#BF1A1A] hover:text-[#7B4019] transition-colors">
                    Shop Now
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card 3: Kent Soup with Discount */}
              <div className="rounded-2xl bg-[#E8F5E9] p-5 flex items-center gap-4 border-2 border-[#A5D6A7] hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-24 h-24 bg-white rounded-xl p-2 flex items-center justify-center shadow-md">
                  <img
                    src={assets.kent}
                    alt="Kent Soup"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#7B4019] mb-1 font-semibold">
                    Vegetable Soup Mix
                  </div>
                  <div className="mb-2">
                    <span className="bg-[#BF1A1A] text-white text-sm px-3 py-1 rounded-full font-bold">
                      15% Off
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-2 text-sm font-bold text-[#BF1A1A] hover:text-[#7B4019] transition-colors">
                    Shop Now
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");
      `}</style>
    </section>
  );
}
