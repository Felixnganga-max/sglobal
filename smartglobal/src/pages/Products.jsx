import React from "react";
import HeroPromo from "../components/HeroPromo";
import FeaturedProductsGrid from "../components/FeaturedProductsGrid";
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

            <section aria-labelledby="featured-products">
              <div className="flex items-center justify-between">
                <h2
                  id="featured-products"
                  className="text-xl font-semibold text-[var(--heading)]"
                >
                  Featured Products
                </h2>
              </div>

              <div className="mt-4">
                <FeaturedProductsGrid products={sampleProducts} />
              </div>
            </section>

            {/* <StatsBar /> */}
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
