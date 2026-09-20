import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Shield } from "lucide-react";
import CartPanel from "./CartPanel";
import { useCart } from "../context/Cartcontext";
import { useCatalog } from "../lib/useCatalog";
import { useRecentlyViewed } from "../lib/useRecentlyViewed";
import { getProductImage, FALLBACK_IMG } from "../lib/useProducts";
import { withTransform } from "../lib/cloudinary";

const CSS = `
  .ns-rs { display: flex; flex-direction: column; gap: 1rem; }
  .ns-rs-card {
    background: #fff; border-radius: 24px; padding: 1.1rem;
    box-shadow: 0 1px 2px rgba(1,0,40,0.04), 0 10px 30px rgba(1,0,40,0.05);
  }
  .ns-rs-title { font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; color: var(--color-blue); margin: 0 0 0.75rem; }

  .ns-mini { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
  .ns-mini-row { display: flex; align-items: center; gap: 0.75rem; }
  .ns-mini-thumb { width: 56px; height: 56px; flex-shrink: 0; border-radius: 14px; background: #f3f4f8; object-fit: contain; padding: 4px; }
  .ns-mini-info { flex: 1; min-width: 0; text-decoration: none; }
  .ns-mini-name {
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    font-family: var(--font-heading); font-size: 0.74rem; font-weight: 700; line-height: 1.25; color: var(--color-text);
  }
  .ns-mini-meta { display: block; font-family: var(--font-body); font-size: 0.62rem; color: var(--color-muted); margin-top: 1px; }
  .ns-mini-price { display: block; font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; color: var(--color-blue); margin-top: 3px; }
  .ns-mini-add {
    width: 32px; height: 32px; flex-shrink: 0; border: none; border-radius: 50%; cursor: pointer;
    background: var(--color-red); color: #fff; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, transform 0.18s;
  }
  .ns-mini-add:hover { background: var(--color-red-dark); transform: scale(1.06); }
  .ns-mini-add:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }

  .ns-recent { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
  .ns-recent a { display: block; aspect-ratio: 1 / 1; border-radius: 14px; background: #f3f4f8; overflow: hidden; }
  .ns-recent img { width: 100%; height: 100%; object-fit: contain; padding: 4px; transition: transform 0.3s ease; }
  .ns-recent a:hover img { transform: scale(1.08); }

  .ns-rs-promo { position: relative; overflow: hidden; border-radius: 24px; padding: 1.25rem; background: var(--color-blue); color: #fff; min-height: 150px; }
  .ns-rs-promo h4 { font-family: var(--font-heading); font-weight: 700; font-size: 1.15rem; line-height: 1.2; margin: 0 0 4px; max-width: 68%; }
  .ns-rs-promo p { font-family: var(--font-body); font-size: 0.72rem; line-height: 1.5; color: rgba(255,255,255,0.72); margin: 0 0 14px; max-width: 66%; }
  .ns-rs-promo .c1 { position: absolute; width: 130px; height: 130px; right: -36px; bottom: -44px; border-radius: 50%; background: var(--color-blue-light); opacity: 0.6; pointer-events: none; }
  .ns-rs-promo .ico { position: absolute; right: 18px; top: 50%; transform: translateY(-50%) rotate(8deg); width: 56px; height: 56px; border-radius: 18px; background: var(--color-orange); color: #fff; display: flex; align-items: center; justify-content: center; }
`;

/** Two in-stock products that aren't in the cart yet, preferring the categories already in it. */
function useSuggestions(products, cartItems) {
  return useMemo(() => {
    const inCart = new Set(cartItems.map((i) => i._id || i.id));
    const cartCats = new Set(cartItems.map((i) => i.category).filter(Boolean));

    return products
      .filter((p) => p.stock > 0 && !inCart.has(p._id || p.id))
      .map((p) => ({
        p,
        score:
          (cartCats.has(p.category) ? 3 : 0) +
          (p.isBestSeller ? 2 : 0) +
          (Number(p.rating) || 0) / 5,
      }))
      .sort(
        (a, b) =>
          b.score - a.score || (a.p.title || "").localeCompare(b.p.title || ""),
      )
      .slice(0, 2)
      .map((x) => x.p);
  }, [products, cartItems]);
}

function AlsoLike({ onClose }) {
  const { products } = useCatalog();
  const { cartItems, addToCart } = useCart();
  const suggestions = useSuggestions(products, cartItems);

  if (suggestions.length === 0) return null;

  return (
    <section className="ns-rs-card" aria-label="You might also like">
      <h3 className="ns-rs-title">You might also like</h3>
      <ul className="ns-mini">
        {suggestions.map((p) => {
          const id = p._id || p.id;
          const moq = p.minimumOrderQuantity || 1;
          const packPrice =
            p.totalPrice != null
              ? p.totalPrice
              : parseFloat(((p.price || 0) * moq).toFixed(2));
          return (
            <li key={id} className="ns-mini-row">
              <img
                className="ns-mini-thumb"
                src={withTransform(getProductImage(p), { w: 160 })}
                alt=""
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMG;
                }}
              />
              <Link
                to={`/product/${id}`}
                className="ns-mini-info"
                onClick={onClose}
              >
                <span className="ns-mini-name">{p.title}</span>
                <span className="ns-mini-meta">
                  {[p.category, moq > 1 ? `Pack of ${moq}` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                <span className="ns-mini-price">
                  KSh {packPrice.toLocaleString()}
                </span>
              </Link>
              <button
                type="button"
                className="ns-mini-add"
                onClick={() => addToCart({ ...p, quantity: moq })}
                aria-label={
                  moq > 1
                    ? `Add pack of ${moq}: ${p.title}`
                    : `Add ${p.title} to cart`
                }
              >
                <Plus size={16} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function RecentlyViewed({ onClose }) {
  const items = useRecentlyViewed().slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="ns-rs-card" aria-label="Recently viewed">
      <h3 className="ns-rs-title">Recently viewed</h3>
      <div className="ns-recent">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.id}`}
            title={item.title}
            aria-label={item.title}
            onClick={onClose}
          >
            <img
              src={item.image || FALLBACK_IMG}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMG;
              }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Right column: cart, suggestions, recently viewed and a promo card.
 * `onClose` is only passed when it's shown inside the mobile cart drawer.
 */
export default function RightSidebar({ onClose }) {
  const browseAll = () => {
    onClose?.();
    document
      .getElementById("featured-products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="ns-rs">
      <style>{CSS}</style>

      <CartPanel onClose={onClose} />
      <AlsoLike onClose={onClose} />
      <RecentlyViewed onClose={onClose} />

      <section className="ns-rs-promo" aria-label="Quality assured">
        <span className="c1" aria-hidden="true" />
        <h4>Quality assured</h4>
        <p>Premium products with authentic flavours.</p>
        <button
          type="button"
          className="btn-primary"
          style={{ fontSize: "0.65rem", padding: "0.55rem 1.2rem" }}
          onClick={browseAll}
        >
          Browse all
        </button>
        <span className="ico" aria-hidden="true">
          <Shield size={26} />
        </span>
      </section>
    </div>
  );
}
