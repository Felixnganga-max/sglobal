import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * CartContext — global cart state with localStorage persistence.
 * Wrap your app's root (e.g. App.jsx) with <CartProvider>.
 * Consume via useCart() hook anywhere in the tree.
 */

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Initialise from localStorage on first render
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("sg_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("sg_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /* ── helpers ── */

  /** Add a product to cart (or increment qty if already present) */
  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const id = product._id || product.id;
      const existing = prev.find((item) => (item._id || item.id) === id);
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === id
            ? { ...item, cartQty: (item.cartQty || 1) + qty }
            : item,
        );
      }
      return [...prev, { ...product, cartQty: qty }];
    });
  };

  /** Remove a product entirely from cart */
  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => (item._id || item.id) !== productId),
    );
  };

  /** Update quantity of a specific item (set to 0 to remove) */
  const updateQty = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    setCartItems((prev) =>
      prev.map((item) =>
        (item._id || item.id) === productId ? { ...item, cartQty: qty } : item,
      ),
    );
  };

  /** Wipe the entire cart */
  const clearCart = () => setCartItems([]);

  /** Total number of items (sum of quantities) */
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.cartQty || 1),
    0,
  );

  /** Total price */
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.cartQty || 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/** Hook — throws if used outside <CartProvider> */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
