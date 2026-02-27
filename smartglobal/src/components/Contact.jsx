import React, { useState } from "react";
import {
  MessageCircle,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCart, useOrder } from "../context/Cartcontext";

// ── Small sub-components ──────────────────────────────────────────────────────

function CartSummary({ items }) {
  const [open, setOpen] = useState(false);
  const total = items.reduce(
    (s, i) => s + i.price * (i.cartQty || i.quantity || 1),
    0,
  );

  return (
    <div className="rounded-xl border border-white/20 overflow-hidden mb-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <ShoppingCart size={14} className="text-orange-300" />
          <span className="text-white font-body font-bold text-xs uppercase tracking-wider">
            {items.length} item{items.length !== 1 ? "s" : ""} in cart
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white font-heading font-bold text-sm">
            Ksh {total.toLocaleString()}
          </span>
          {open ? (
            <ChevronUp size={14} className="text-white/60" />
          ) : (
            <ChevronDown size={14} className="text-white/60" />
          )}
        </div>
      </button>

      {open && (
        <div style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
          {items.map((item) => {
            const qty = item.cartQty || item.quantity || 1;
            return (
              <div
                key={item._id || item.id}
                className="flex items-center justify-between px-4 py-2 border-t border-white/10"
              >
                <span className="text-white/80 text-xs font-body">
                  {item.title || item.name} × {qty}
                </span>
                <span className="text-white/70 text-xs font-body font-semibold">
                  Ksh {(item.price * qty).toLocaleString()}
                </span>
              </div>
            );
          })}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/20">
            <span className="text-white font-body font-bold text-xs uppercase tracking-wider">
              Total
            </span>
            <span className="text-white font-heading font-bold text-base">
              Ksh {total.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, id, error, textarea, ...props }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-white/70 text-[0.65rem] font-body font-bold uppercase tracking-wider mb-1.5"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl text-xs font-body text-white placeholder-white/30 border outline-none transition-all duration-200 resize-none"
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            borderColor: error ? "#f87171" : "rgba(255,255,255,0.15)",
          }}
          {...props}
        />
      ) : (
        <input
          id={id}
          className="w-full px-3 py-2.5 rounded-xl text-xs font-body text-white placeholder-white/30 border outline-none transition-all duration-200"
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            borderColor: error ? "#f87171" : "rgba(255,255,255,0.15)",
          }}
          {...props}
        />
      )}
      {error && <p className="text-red-300 text-[0.6rem] mt-1">{error}</p>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Contact() {
  const { cartItems, clearCart } = useCart();
  const { orderState, submitOrder, resetOrder } = useOrder();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    notes: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const hasItems = cartItems.length > 0;
  const total = cartItems.reduce(
    (s, i) => s + i.price * (i.cartQty || i.quantity || 1),
    0,
  );
  const isLoading = orderState.status === "loading";
  const isSuccess = orderState.status === "success";

  // ── Validation ──
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^(\+254|0)[17]\d{8}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Kenyan phone number";
    if (!form.location.trim()) e.location = "Delivery location is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    return e;
  }

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  // ── Submit email order ──
  async function handleEmailOrder(e) {
    e.preventDefault();
    if (!hasItems) return;

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const result = await submitOrder({
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        notes: form.notes.trim(),
      },
      items: cartItems,
      totalPrice: total,
      channel: "email",
      customerEmail: form.email.trim() || undefined,
    });

    if (result.success) {
      clearCart?.();
    }
  }

  // ── WhatsApp order ──
  function handleWhatsApp() {
    if (!hasItems) return;
    const lines = [
      `*New Order — Smart Global*`,
      ``,
      ...cartItems.map(
        (i) =>
          `• ${i.title || i.name} × ${i.cartQty || i.quantity || 1} — Ksh ${(i.price * (i.cartQty || i.quantity || 1)).toLocaleString()}`,
      ),
      ``,
      `*Total: Ksh ${total.toLocaleString()}*`,
    ];
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/254700000000?text=${text}`, "_blank");
  }

  // ── Reset ──
  function handleReset() {
    resetOrder();
    setForm({ name: "", phone: "", location: "", notes: "", email: "" });
    setErrors({});
    setShowForm(false);
  }

  return (
    <section className="page-x section-y">
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-red) 0%, var(--color-red-dark) 60%, #5a0a0a 100%)",
        }}
      >
        {/* Decorative arc */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-end pointer-events-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 400 400"
            className="h-full w-auto opacity-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(380,200)">
              {[320, 260, 200, 140, 80].map((r, i) => (
                <path
                  key={r}
                  d={`M${r},0 A${r},${r} 0 0,1 0,${r} L0,0 Z`}
                  fill={i % 2 === 0 ? "#FFD41D" : "#ffffff"}
                  opacity={0.6 - i * 0.08}
                />
              ))}
            </g>
          </svg>
        </div>

        {/* Corner accents */}
        <div className="absolute top-5 right-5 w-12 h-12 border-t border-r border-white/10 rounded-tr-xl" />
        <div className="absolute bottom-5 left-5 w-12 h-12 border-b border-l border-white/10 rounded-bl-xl" />

        {/* Content */}
        <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-14 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* ── Left — text + CTAs ── */}
            <div className="max-w-xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--color-orange)" }}
                />
                <span className="font-body text-white/80 text-[0.6rem] font-bold uppercase tracking-[0.2em]">
                  Get in Touch
                </span>
              </div>

              <h2 className="text-hero text-white leading-tight">
                Place your order
              </h2>

              <p className="font-body text-sm text-white/75 mt-4 leading-relaxed max-w-md">
                Get Smart Global premium products delivered to your doorstep.
                Order via WhatsApp for instant service, or email us for bulk
                orders.
              </p>

              {/* Cart summary */}
              {hasItems && (
                <div className="mt-6">
                  <CartSummary items={cartItems} />
                </div>
              )}

              {!hasItems && (
                <div
                  className="mt-6 flex items-center gap-2 px-4 py-3 rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <ShoppingCart size={14} className="text-white/40" />
                  <span className="text-white/50 text-xs font-body">
                    Add products to your cart to place an order
                  </span>
                </div>
              )}

              {/* CTA buttons */}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  disabled={!hasItems}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-bold text-white text-xs uppercase tracking-widest transition-all duration-200 hover:scale-105 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    backgroundColor: "#25D366",
                    boxShadow: hasItems
                      ? "0 4px 14px rgba(37,211,102,0.35)"
                      : "none",
                  }}
                >
                  <MessageCircle size={14} />
                  WhatsApp Order
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm((v) => !v)}
                  disabled={!hasItems}
                  className="btn-white inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ fontSize: "0.65rem" }}
                >
                  <Mail size={14} />
                  Email Order
                </button>
              </div>

              {/* Contact meta */}
              <div className="mt-6 flex flex-wrap gap-5">
                {[
                  { icon: MessageCircle, text: "+254 700 000 000" },
                  { icon: Mail, text: "orders@smartglobal.co.ke" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon size={13} style={{ color: "var(--color-orange)" }} />
                    <span className="font-body text-xs text-white/70 font-medium">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right — Order form / Success / Error ── */}
            <div className="lg:flex lg:justify-center lg:items-start">
              {/* Success state */}
              {isSuccess && (
                <div
                  className="w-full max-w-sm rounded-2xl p-6 text-center"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "rgba(34,197,94,0.2)" }}
                  >
                    <CheckCircle size={28} className="text-green-400" />
                  </div>
                  <h3 className="text-white font-heading font-bold text-lg mb-2">
                    Order Placed!
                  </h3>
                  <p className="text-white/70 font-body text-xs leading-relaxed mb-1">
                    Your order has been received. Our team will contact you
                    shortly to confirm.
                  </p>
                  {orderState.orderId && (
                    <p className="text-white/40 font-body text-[0.6rem] mt-3 mb-5">
                      Order #{orderState.orderId}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-body font-bold text-white/60 underline hover:text-white transition-colors"
                  >
                    Place another order
                  </button>
                </div>
              )}

              {/* Email order form */}
              {!isSuccess && showForm && (
                <div
                  className="w-full max-w-sm rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* Form header */}
                  <div
                    className="flex items-center justify-between px-5 py-4 border-b border-white/10"
                    style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                  >
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-orange-300" />
                      <span className="text-white font-body font-bold text-xs uppercase tracking-wider">
                        Email Order
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <form
                    onSubmit={handleEmailOrder}
                    className="p-5 space-y-3.5"
                    noValidate
                  >
                    <InputField
                      label="Full Name *"
                      id="name"
                      type="text"
                      placeholder="e.g. Jane Wanjiku"
                      value={form.name}
                      onChange={set("name")}
                      error={errors.name}
                    />
                    <InputField
                      label="Phone Number *"
                      id="phone"
                      type="tel"
                      placeholder="e.g. 0712 345 678"
                      value={form.phone}
                      onChange={set("phone")}
                      error={errors.phone}
                    />
                    <InputField
                      label="Delivery Location *"
                      id="location"
                      type="text"
                      placeholder="e.g. Westlands, Nairobi"
                      value={form.location}
                      onChange={set("location")}
                      error={errors.location}
                    />
                    <InputField
                      label="Email (for confirmation)"
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={set("email")}
                      error={errors.email}
                    />
                    <InputField
                      label="Additional Notes"
                      id="notes"
                      textarea
                      placeholder="Special requests, preferred delivery time…"
                      value={form.notes}
                      onChange={set("notes")}
                    />

                    {/* API error */}
                    {orderState.status === "error" && (
                      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/20 border border-red-400/30">
                        <AlertCircle
                          size={13}
                          className="text-red-300 mt-0.5 flex-shrink-0"
                        />
                        <p className="text-red-300 text-[0.65rem] font-body leading-relaxed">
                          {orderState.error}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !hasItems}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-body font-bold uppercase tracking-widest transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: "var(--color-orange)",
                        color: "#fff",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Placing Order…
                        </>
                      ) : (
                        <>
                          <Mail size={13} />
                          Send Order — Ksh {total.toLocaleString()}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Default decorative rings when form is hidden */}
              {!isSuccess && !showForm && (
                <div className="hidden lg:flex justify-center items-center">
                  <div className="relative flex items-center justify-center w-72 h-72">
                    {[140, 110, 80, 50].map((r, i) => (
                      <div
                        key={r}
                        className="absolute rounded-full"
                        style={{
                          width: r * 2,
                          height: r * 2,
                          border: `1px solid rgba(255,212,29,${0.08 + i * 0.06})`,
                        }}
                      />
                    ))}
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,212,29,0.35) 0%, transparent 70%)",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full"
                        style={{
                          backgroundColor: "rgba(255,212,29,0.5)",
                          boxShadow: "0 0 24px rgba(255,212,29,0.6)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
