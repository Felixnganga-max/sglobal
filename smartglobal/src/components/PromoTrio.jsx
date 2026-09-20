import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import { useCatalog } from "../lib/useCatalog";
import { getProductImage } from "../lib/useProducts";
import { withTransform } from "../lib/cloudinary";

const CSS = `
  .ns-trio { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.875rem; }
  @media (max-width: 767px) { .ns-trio { grid-template-columns: 1fr; } }

  .ns-promo {
    position: relative; overflow: hidden; text-align: left; border: none;
    min-height: 132px; padding: 1.1rem; border-radius: 22px;
    display: flex; flex-direction: column; justify-content: center; gap: 4px;
  }
  button.ns-promo { cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
  button.ns-promo:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(1,0,40,0.1); }

  .ns-promo-text { position: relative; z-index: 1; max-width: 58%; }
  .ns-promo-title { font-family: var(--font-heading); font-weight: 700; font-size: 1rem; color: var(--color-blue); margin: 0 0 4px; }
  .ns-promo-sub { font-family: var(--font-body); font-size: 0.68rem; line-height: 1.45; color: #4b5563; margin: 0 0 10px; }
  .ns-promo-cta {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: var(--font-body); font-size: 0.68rem; font-weight: 700; color: var(--color-red);
  }
  .ns-promo-img {
    position: absolute; right: 8px; bottom: 6px; width: 42%; height: 82%;
    object-fit: contain; filter: drop-shadow(0 8px 12px rgba(1,0,40,0.18));
  }
  .ns-promo-icon {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    width: 76px; height: 76px; border-radius: 22px; background: #fff; color: var(--color-blue);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 18px rgba(1,0,40,0.1);
  }
`;

function scrollToGrid() {
  document
    .getElementById("featured-products")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function PromoTrio() {
  const [, setSearchParams] = useSearchParams();
  const { products } = useCatalog();

  const { bestSeller, newest } = useMemo(() => {
    if (!products.length) return { bestSeller: null, newest: null };
    const sorted = [...products].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
    return {
      bestSeller: products.find((p) => p.isBestSeller) || products[0],
      newest: sorted[0],
    };
  }, [products]);

  // Best sellers: clear filters and rank by rating, so the pinned best seller
  // spotlight is the first thing in the grid. New arrivals: clear filters and
  // show the default newest-first order.
  const showBestSellers = () => {
    setSearchParams({ sort: "rating" });
    scrollToGrid();
  };
  const showNewArrivals = () => {
    setSearchParams({});
    scrollToGrid();
  };

  return (
    <section aria-label="Promotions" className="ns-trio">
      <style>{CSS}</style>

      <button
        type="button"
        className="ns-promo"
        style={{ backgroundColor: "#fdecec" }}
        onClick={showBestSellers}
      >
        <div className="ns-promo-text">
          <h3 className="ns-promo-title">Best sellers</h3>
          <p className="ns-promo-sub">What customers order most</p>
          <span className="ns-promo-cta">
            Shop now <ArrowRight size={12} />
          </span>
        </div>
        {bestSeller && (
          <img
            className="ns-promo-img"
            src={withTransform(getProductImage(bestSeller), { w: 260 })}
            alt=""
            loading="lazy"
            decoding="async"
          />
        )}
      </button>

      <div className="ns-promo" style={{ backgroundColor: "#e9e9f3" }}>
        <div className="ns-promo-text">
          <h3 className="ns-promo-title">Free delivery</h3>
          <p className="ns-promo-sub">On orders over KSh 5,000, countrywide</p>
        </div>
        <span className="ns-promo-icon" aria-hidden="true">
          <Package size={34} />
        </span>
      </div>

      <button
        type="button"
        className="ns-promo"
        style={{ backgroundColor: "#fff1e3" }}
        onClick={showNewArrivals}
      >
        <div className="ns-promo-text">
          <h3 className="ns-promo-title">New arrivals</h3>
          <p className="ns-promo-sub">Check out the latest products</p>
          <span className="ns-promo-cta">
            Shop now <ArrowRight size={12} />
          </span>
        </div>
        {newest && (
          <img
            className="ns-promo-img"
            src={withTransform(getProductImage(newest), { w: 260 })}
            alt=""
            loading="lazy"
            decoding="async"
          />
        )}
      </button>
    </section>
  );
}
