import React from "react";
import HeroPromo from "../components/HeroPromo";
import CategoryChips from "../components/CategoryChips";
import FeaturedProductsGrid from "../components/FeaturedProductsGrid";
import StatsBar from "../components/StatsBar";
import RightSidebar from "../components/RightSidebar";
import { sampleProducts } from "../components/ProductCard";

/**
 * Products.jsx
 *
 * Top-level products page that reproduces the complex layout from the artboard:
 * - Responsive hero/promo area (left large promo + right small promos)
 * - Category chips row
 * - Featured products grid (repetitive cards via ProductCard)
 * - Promotional banner row
 * - Stats row
 * - Desktop right sidebar for trending / cart / quick view
 *
 * Tweak absolute offsets in HeroPromo for true pixel parity.
 */

export default function Products() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Optional: top navbar */}
      {/* <Navbar /> */}

      <main className="w-full px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-9 space-y-8">
            <HeroPromo />

            <CategoryChips
              categories={[
                "All Categories",
                "Soups",
                "Pancake Mixes",
                "Stock Cubes",
                "Syrups & Sauces",
                "Craft Cooked Crisps",
                "Baby Pouches",
              ]}
            />

            <section aria-labelledby="featured-products">
              <div className="flex items-center justify-between">
                <h2
                  id="featured-products"
                  className="text-xl font-semibold text-[var(--heading)]"
                >
                  Featured Products
                </h2>
                <div className="text-sm text-[var(--muted)]">
                  All · Soups · Syrups & Sauces · Craft Cooked Crisps
                </div>
              </div>

              <div className="mt-4">
                <FeaturedProductsGrid products={sampleProducts} />
              </div>
            </section>

            {/* Promo banner row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-gradient-to-r from-[#f3f6ff] to-[#fff1f3] p-6">
                <div className="text-sm text-[var(--muted)]">Premium Soups</div>
                <div className="font-semibold text-lg mt-2">From $3.99</div>
                <button className="mt-4 inline-block rounded-full bg-[#BF1A1A] text-white px-4 py-2 text-sm hover:bg-[#8B1414] transition-colors">
                  Shop Now
                </button>
              </div>

              <div className="rounded-xl bg-[#fffbe6] p-6">
                <div className="text-sm text-[var(--muted)]">Pancake Mixes</div>
                <div className="font-semibold text-lg mt-2">From $6.99</div>
                <button className="mt-4 inline-block rounded-full bg-[#BF1A1A] text-white px-4 py-2 text-sm hover:bg-[#8B1414] transition-colors">
                  Shop Now
                </button>
              </div>

              <div className="rounded-xl bg-[#f6f0ff] p-6">
                <div className="text-sm text-[var(--muted)]">Baby Pouches</div>
                <div className="font-semibold text-lg mt-2">From $2.99</div>
                <button className="mt-4 inline-block rounded-full bg-[#BF1A1A] text-white px-4 py-2 text-sm hover:bg-[#8B1414] transition-colors">
                  Shop Now
                </button>
              </div>
            </div>

            <StatsBar />
          </div>

          {/* Right Sidebar (desktop-only) */}
          <aside className="hidden lg:block lg:col-span-3">
            <RightSidebar />
          </aside>
        </div>
      </main>
    </div>
  );
}
