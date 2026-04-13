import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

/**
 * CartContext — global cart state with localStorage persistence.
 * OrderContext — global order submission state.
 * Wrap your app's root (e.g. App.jsx) with <CartProvider>.
 * Consume via useCart() and useOrder() hooks anywhere in the tree.
 */

// ── Order API ─────────────────────────────────────────────────────────────────
const ORDER_API = "https://sglobal-plf6.vercel.app/smartglobal/orders";

function getSessionId() {
  let id = sessionStorage.getItem("sg_session_id");
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem("sg_session_id", id);
  }
  return id;
}

// ── Contexts ──────────────────────────────────────────────────────────────────
const CartContext = createContext(null);
const OrderContext = createContext(null);

// ── Combined Provider ─────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  // ── Cart state ──────────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("sg_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("sg_cart", JSON.stringify(cartItems));
  }, [cartItems]);

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

  /** Total number of packs in cart (sum of cartQty across all items) */
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.cartQty || 1),
    0,
  );

  /**
   * Grand total price.
   *
   * Each product from the API has:
   *   price          — unit price per single piece  (e.g. 62.64)
   *   totalPrice     — pack price = price × minimumOrderQuantity  (e.g. 375.84)
   *   cartQty        — how many packs the customer wants
   *
   * So the line total = totalPrice × cartQty.
   * Falls back to item.price for products without MOQ bundling.
   */
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + (item.totalPrice ?? item.price ?? 0) * (item.cartQty || 1),
    0,
  );

  // ── Order state ─────────────────────────────────────────────────────────────
  const [orderState, setOrderState] = useState({
    status: "idle", // "idle" | "loading" | "success" | "error"
    orderId: null,
    error: null,
  });

  /**
   * submitOrder
   * @param {object} params
   * @param {object} params.customer        — { name, phone, location, notes }
   * @param {array}  params.items           — cart items (defaults to cartItems)
   * @param {number} params.totalPrice      — defaults to cart totalPrice
   * @param {"whatsapp"|"email"} params.channel
   * @param {string} [params.customerEmail] — optional, for confirmation email
   * @param {string} [params.token]         — JWT if user is logged in
   */
  const submitOrder = useCallback(
    async ({
      customer,
      items,
      totalPrice: overrideTotal,
      channel,
      customerEmail,
      token,
    }) => {
      const orderItems = items ?? cartItems;
      const orderTotal = overrideTotal ?? totalPrice;

      setOrderState({ status: "loading", orderId: null, error: null });

      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(ORDER_API, {
          method: "POST",
          headers,
          body: JSON.stringify({
            customer,
            items: orderItems.map((item) => ({
              productId: item._id || item.id,
              title: item.title || item.name,
              // Send the pack price so the backend records the correct billable amount
              price: item.totalPrice ?? item.price,
              quantity: item.cartQty || item.quantity || 1,
              image:
                item.images?.[0]?.url ||
                item.image?.url ||
                item.imageUrl ||
                item.img ||
                "",
              category: item.category || "",
            })),
            totalPrice: orderTotal,
            channel,
            sessionId: getSessionId(),
            customerEmail: customerEmail || undefined,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to place order.");
        }

        setOrderState({
          status: "success",
          orderId: data.data._id,
          error: null,
        });
        return { success: true, order: data.data };
      } catch (err) {
        setOrderState({ status: "error", orderId: null, error: err.message });
        return { success: false, error: err.message };
      }
    },
    [cartItems, totalPrice],
  );

  const resetOrder = useCallback(() => {
    setOrderState({ status: "idle", orderId: null, error: null });
  }, []);

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
      <OrderContext.Provider value={{ orderState, submitOrder, resetOrder }}>
        {children}
      </OrderContext.Provider>
    </CartContext.Provider>
  );
}

/** Cart hook — throws if used outside <CartProvider> */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** Order hook — throws if used outside <CartProvider> */
export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside <CartProvider>");
  return ctx;
}
