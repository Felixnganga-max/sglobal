import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Minus,
  Plus,
  Trash2,
  Lock,
  ArrowRight,
  ShoppingBag,
  MessageCircle,
  Mail,
} from "lucide-react";
import { useCart } from "../context/Cartcontext";
import { getProductImage, FALLBACK_IMG } from "../lib/useProducts";
import { withTransform } from "../lib/cloudinary";

// Where the Checkout button goes. Change this to your cart / checkout route.
const CHECKOUT_PATH = "/cart";
// Same threshold as the "Free Delivery, over Ksh 5,000" badge.
const FREE_DELIVERY_THRESHOLD = 5000;

const CSS = `
  .ns-cart {
    background: #fff; border-radius: 24px; padding: 1.1rem;
    box-shadow: 0 1px 2px rgba(1,0,40,0.04), 0 10px 30px rgba(1,0,40,0.05);
  }
  .ns-cart-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.9rem; }
  .ns-cart-title { font-family: var(--font-heading); font-weight: 700; font-size: 1.05rem; color: var(--color-blue); margin: 0; }
  .ns-cart-title span { font-weight: 500; color: var(--color-muted); }
  .ns-cart-headbtns { display: flex; align-items: center; gap: 0.5rem; }
  .ns-cart-clear { border: none; background: transparent; cursor: pointer; font-family: var(--font-body); font-size: 0.68rem; font-weight: 600; color: var(--color-muted); text-decoration: underline; }
  .ns-cart-clear:hover { color: var(--color-red); }
  .ns-cart-x { border: none; background: #f3f4f8; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--color-blue); }

  .ns-cart-list { list-style: none; margin: 0; padding: 0; max-height: 44vh; overflow-y: auto; display: flex; flex-direction: column; gap: 0.9rem; }
  .ns-cart-row { display: flex; gap: 0.75rem; }
  .ns-cart-thumb { width: 64px; height: 72px; flex-shrink: 0; border-radius: 14px; background: #f3f4f8; object-fit: contain; padding: 4px; }
  .ns-cart-info { flex: 1; min-width: 0; }
  .ns-cart-name {
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    font-family: var(--font-heading); font-size: 0.78rem; font-weight: 700; line-height: 1.25; color: var(--color-text); text-decoration: none;
  }
  .ns-cart-name:hover { color: var(--color-blue-dark); }
  .ns-cart-meta { font-family: var(--font-body); font-size: 0.62rem; color: var(--color-muted); margin-top: 2px; }
  .ns-cart-price { font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--color-blue); margin-top: 4px; }
  .ns-cart-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }

  .ns-stepper { display: inline-flex; align-items: center; border: 1px solid #e5e7eb; border-radius: 999px; overflow: hidden; }
  .ns-stepper button { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; background: transparent; cursor: pointer; color: var(--color-text); }
  .ns-stepper button:hover:not(:disabled) { background: #f3f4f8; }
  .ns-stepper button:disabled { opacity: 0.35; cursor: not-allowed; }
  .ns-stepper span { min-width: 22px; text-align: center; font-family: var(--font-body); font-size: 0.75rem; font-weight: 700; }
  .ns-cart-trash { border: none; background: transparent; cursor: pointer; padding: 6px; border-radius: 50%; color: #9ca3af; }
  .ns-cart-trash:hover { color: var(--color-red); background: #fdecec; }

  .ns-cart-empty { text-align: center; padding: 1.5rem 0.5rem; }
  .ns-cart-empty .ico { width: 56px; height: 56px; border-radius: 50%; background: var(--color-blue-tint); color: var(--color-blue); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.75rem; }
  .ns-cart-empty b { display: block; font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-text); }
  .ns-cart-empty p { font-family: var(--font-body); font-size: 0.72rem; color: var(--color-muted); margin: 4px 0 0; }

  .ns-ship { margin-top: 1rem; padding: 0.75rem; border-radius: 16px; background: #f3f4f8; }
  .ns-ship p { font-family: var(--font-body); font-size: 0.7rem; color: var(--color-text); margin: 0 0 8px; }
  .ns-ship p b { color: var(--color-blue); }
  .ns-ship.done p { color: #15803d; font-weight: 600; margin: 0; }
  .ns-ship-bar { height: 6px; border-radius: 999px; background: #e1e3ee; overflow: hidden; }
  .ns-ship-bar i { display: block; height: 100%; border-radius: 999px; background: var(--color-orange); transition: width 0.3s ease; }

  .ns-sum { margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
  .ns-sum-row { display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 0.75rem; color: var(--color-muted); }
  .ns-sum-row b { font-weight: 600; color: var(--color-text); }
  .ns-sum-row b.free { color: #15803d; }
  .ns-sum-total { display: flex; justify-content: space-between; align-items: baseline; padding-top: 0.75rem; border-top: 1px solid #eceef5; }
  .ns-sum-total span { font-family: var(--font-body); font-size: 0.85rem; font-weight: 600; color: var(--color-text); }
  .ns-sum-total b { font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: var(--color-blue); }

  .ns-checkout {
    width: 100%; margin-top: 1rem; display: flex; align-items: center; justify-content: space-between;
    padding: 0.85rem 1.1rem; border: none; border-radius: 999px; cursor: pointer;
    background: var(--color-red); color: #fff; box-shadow: 0 6px 16px rgba(255,0,0,0.28);
    font-family: var(--font-body); font-size: 0.8rem; font-weight: 700; transition: background 0.2s, transform 0.18s;
  }
  .ns-checkout:hover:not(:disabled) { background: var(--color-red-dark); transform: translateY(-1px); }
  .ns-checkout:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
  .ns-checkout:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }
  .ns-cart-note { display: flex; align-items: center; justify-content: center; gap: 6px; margin: 0.8rem 0 0; font-family: var(--font-body); font-size: 0.66rem; color: var(--color-muted); }
`;

export default function CartPanel({ onClose }) {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQty,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const isEmpty = cartItems.length === 0;
  const freeDelivery = totalPrice >= FREE_DELIVERY_THRESHOLD;
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - totalPrice);
  const progress = Math.min(100, (totalPrice / FREE_DELIVERY_THRESHOLD) * 100);

  const handleClear = () => {
    if (window.confirm("Remove all items from your cart?")) clearCart();
  };

  const handleCheckout = () => {
    onClose?.();
    navigate(CHECKOUT_PATH);
  };

  return (
    <section className="ns-cart" aria-label="Your cart">
      <style>{CSS}</style>

      <div className="ns-cart-head">
        <h3 className="ns-cart-title">
          My cart <span>({totalItems})</span>
        </h3>
        <div className="ns-cart-headbtns">
          {!isEmpty && (
            <button
              type="button"
              className="ns-cart-clear"
              onClick={handleClear}
            >
              Clear
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="ns-cart-x"
              onClick={onClose}
              aria-label="Close cart"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="ns-cart-empty">
          <span className="ico">
            <ShoppingBag size={24} />
          </span>
          <b>Your cart is empty</b>
          <p>Add a product and it will show up here.</p>
        </div>
      ) : (
        <ul className="ns-cart-list">
          {cartItems.map((item) => {
            const id = item._id || item.id;
            const qty = item.cartQty || 1;
            const moq = item.minimumOrderQuantity || 1;
            const packPrice = item.totalPrice ?? item.price ?? 0;
            const lineTotal = packPrice * qty;
            const title = item.title || item.name || "Product";

            return (
              <li key={id} className="ns-cart-row">
                <img
                  className="ns-cart-thumb"
                  src={withTransform(getProductImage(item), { w: 160 })}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMG;
                  }}
                />
                <div className="ns-cart-info">
                  <Link
                    to={`/product/${id}`}
                    className="ns-cart-name"
                    onClick={onClose}
                  >
                    {title}
                  </Link>
                  <div className="ns-cart-meta">
                    {[item.category, moq > 1 ? `Pack of ${moq}` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                  <div className="ns-cart-price">
                    KSh {lineTotal.toLocaleString()}
                  </div>
                  <div className="ns-cart-actions">
                    <div
                      className="ns-stepper"
                      role="group"
                      aria-label={`Quantity of ${title}`}
                    >
                      <button
                        type="button"
                        onClick={() => updateQty(id, qty - 1)}
                        disabled={qty <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span aria-live="polite">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(id, qty + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="ns-cart-trash"
                      onClick={() => removeFromCart(id)}
                      aria-label={`Remove ${title} from cart`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!isEmpty && (
        <div className={`ns-ship${freeDelivery ? " done" : ""}`}>
          {freeDelivery ? (
            <p>You've unlocked free delivery.</p>
          ) : (
            <>
              <p>
                Add <b>KSh {remaining.toLocaleString()}</b> more for free
                delivery.
              </p>
              <div
                className="ns-ship-bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <i style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
        </div>
      )}

      <div className="ns-sum">
        <div className="ns-sum-row">
          <span>Subtotal</span>
          <b>KSh {totalPrice.toLocaleString()}</b>
        </div>
        <div className="ns-sum-row">
          <span>Delivery</span>
          <b className={!isEmpty && freeDelivery ? "free" : undefined}>
            {isEmpty ? "-" : freeDelivery ? "Free" : "Calculated at checkout"}
          </b>
        </div>
        <div className="ns-sum-total">
          <span>Total</span>
          <b>KSh {totalPrice.toLocaleString()}</b>
        </div>
      </div>

      <button
        type="button"
        className="ns-checkout"
        onClick={handleCheckout}
        disabled={isEmpty}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Lock size={15} />
          Checkout ({totalItems})
        </span>
        <ArrowRight size={16} />
      </button>

      <p className="ns-cart-note">
        <MessageCircle size={13} aria-hidden="true" /> Send your order by
        WhatsApp or <Mail size={13} aria-hidden="true" /> email
      </p>
    </section>
  );
}
