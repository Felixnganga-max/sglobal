import React from "react";
import HeroPromo from "../components/HeroPromo";
import ProductToolbar from "../components/ProductToolbar";
import FeaturedProductsGrid from "../components/FeaturedProductsGrid";
import RightSidebar from "../components/RightSidebar";

/**
 * Products.jsx
 *
 * Full product catalog page:
 * - Hero/promo area
 * - Search + sort + in-stock toolbar
 * - Category/brand filter sidebar
 * - Live, filtered, sorted, paginated product grid
 *
 * Filters are driven entirely by URL search params (?q=&category=&sort=&inStock=&page=)
 * so the toolbar, sidebar and grid stay in sync without prop drilling.
 */
export default function Products() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <main className="w-full px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-9 space-y-6">
            <HeroPromo />

            <ProductToolbar />

            <section aria-labelledby="featured-products">
              <div className="flex items-center justify-between mb-4">
                <h2
                  id="featured-products"
                  className="text-xl font-semibold text-[var(--heading)]"
                  style={{ scrollMarginTop: "96px" }}
                >
                  Shop All Products
                </h2>
              </div>

              <FeaturedProductsGrid />
            </section>
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
