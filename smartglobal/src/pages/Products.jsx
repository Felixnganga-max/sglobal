import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeroPromo from "../components/HeroPromo";
import CategoryStrip from "../components/CategoryStrip";
import PromoTrio from "../components/PromoTrio";
import TrustBar from "../components/TrustBar";
import ProductToolbar from "../components/ProductToolbar";
import FeaturedProductsGrid from "../components/FeaturedProductsGrid";
import ShopByCategory from "../components/ShopByCategory";
import RightSidebar from "../components/RightSidebar";

/**
 * Products.jsx
 *
 * Full product catalog page, laid out as a three-column shop:
 * - Left:   category / brand navigation (sticky)
 * - Top:    search + sort + in-stock + wishlist (+ cart / menu buttons on small screens)
 * - Center: hero, category strip, promos, live product grid, trust bar
 * - Right:  cart, suggestions, recently viewed (sticky, desktop only)
 *
 * Below 1280px the cart moves into a slide-in drawer (opened from the top bar);
 * below 1024px the category list does the same.
 *
 * Filters are driven entirely by URL search params (?q=&category=&sort=&inStock=&page=)
 * so the toolbar, sidebar and grid stay in sync without prop drilling.
 */

// Distance from the top of the viewport at which the two sidebars stick.
// Set this to your site navbar's height (plus a little breathing room).
const STICKY_TOP = "6rem";

const CSS = `
  .ns-page { --ns-bg: #f5f6fb; --ns-top: ${STICKY_TOP}; background-color: var(--ns-bg); }

  .ns-shell {
    display: grid; gap: 1rem; align-items: start; margin: 0 auto; max-width: 1720px;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "top" "main";
  }
  .ns-area-side  { display: none; grid-area: side; align-self: stretch; }
  .ns-area-top   { grid-area: top; min-width: 0; }
  .ns-area-main  { grid-area: main; min-width: 0; }
  .ns-area-right { display: none; grid-area: right; align-self: stretch; }

  @media (min-width: 1024px) {
    .ns-shell { gap: 1.25rem; grid-template-columns: 250px minmax(0, 1fr); grid-template-areas: "side top" "side main"; }
    .ns-area-side { display: block; }
  }
  @media (min-width: 1280px) {
    .ns-shell { grid-template-columns: 250px minmax(0, 1fr) 320px; grid-template-areas: "side top top" "side main right"; }
    .ns-area-right { display: block; }
  }

  /* The sidebars stay in view while the middle scrolls, and scroll on their own if taller than the screen. */
  .ns-sticky {
    position: sticky; top: var(--ns-top); max-height: calc(100vh - var(--ns-top) - 1rem);
    overflow-y: auto; scrollbar-width: none; padding: 6px; margin: -6px;
  }
  .ns-sticky::-webkit-scrollbar { display: none; }

  .ns-mask { position: fixed; inset: 0; z-index: 1000; background: rgba(1,0,40,0.5); animation: ns-fade 0.2s ease; }
  .ns-drawer {
    position: fixed; top: 0; bottom: 0; z-index: 1001; overflow-y: auto; padding: 0.75rem;
    background-color: var(--ns-bg); box-shadow: 0 0 40px rgba(1,0,40,0.3);
  }
  .ns-drawer.left  { left: 0;  width: min(320px, 88vw); animation: ns-in-left 0.25s ease; }
  .ns-drawer.right { right: 0; width: min(420px, 94vw); animation: ns-in-right 0.25s ease; }
  @keyframes ns-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ns-in-left  { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  @keyframes ns-in-right { from { transform: translateX(100%); }  to { transform: translateX(0); } }
  @media (prefers-reduced-motion: reduce) {
    .ns-mask, .ns-drawer.left, .ns-drawer.right { animation: none; }
  }
`;

export default function Products() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const category = searchParams.get("category");

  // Which mobile drawer is open: "categories" | "cart" | null
  const [drawer, setDrawer] = useState(null);
  const closeDrawer = () => setDrawer(null);

  const heading = q
    ? `Search results for "${q}"`
    : category && category !== "all"
      ? category
      : "All Products";

  // Escape closes the drawer and the page behind it doesn't scroll while it's open.
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e) => {
      if (e.key === "Escape") setDrawer(null);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [drawer]);

  return (
    <div className="ns-page min-h-screen">
      <style>{CSS}</style>

      <main className="w-full px-4 lg:px-8 py-6">
        <div className="ns-shell">
          {/* Left sidebar (desktop) */}
          <aside className="ns-area-side" aria-label="Browse products">
            <div className="ns-sticky">
              <ShopByCategory />
            </div>
          </aside>

          {/* Top bar */}
          <div className="ns-area-top">
            <ProductToolbar
              onOpenCategories={() => setDrawer("categories")}
              onOpenCart={() => setDrawer("cart")}
            />
          </div>

          {/* Center */}
          <div className="ns-area-main space-y-5">
            <HeroPromo />

            <CategoryStrip />

            <PromoTrio />

            <section aria-labelledby="featured-products">
              <div className="flex items-center justify-between mb-4">
                <h2
                  id="featured-products"
                  className="font-heading text-xl font-bold"
                  style={{
                    scrollMarginTop: "96px",
                    color: "var(--heading, var(--color-blue))",
                  }}
                >
                  {heading}
                </h2>
              </div>

              <FeaturedProductsGrid />
            </section>

            <TrustBar />
          </div>

          {/* Right sidebar (wide desktop) */}
          <aside className="ns-area-right" aria-label="Your cart">
            <div className="ns-sticky">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile / tablet drawers */}
      {drawer && (
        <>
          <div className="ns-mask" onClick={closeDrawer} aria-hidden="true" />
          <div
            className={`ns-drawer ${drawer === "cart" ? "right" : "left"}`}
            role="dialog"
            aria-modal="true"
            aria-label={drawer === "cart" ? "Your cart" : "Browse categories"}
          >
            {drawer === "cart" ? (
              <RightSidebar onClose={closeDrawer} />
            ) : (
              <ShopByCategory onClose={closeDrawer} onSelect={closeDrawer} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
