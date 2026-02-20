import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Mail,
  MessageCircle,
  ArrowLeft,
  Package,
  ChevronRight,
  User,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { useCart } from "../context/Cartcontext";

const SALES_EMAIL = "sales@smartglobal.com";
const WHATSAPP_NUMBER = "254797743366"; // international format, no +

function getImage(product) {
  return (
    product.image?.url ||
    product.imageUrl ||
    product.img ||
    product.photo ||
    "https://via.placeholder.com/80?text=IMG"
  );
}

export default function PlaceOrder() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQty, clearCart, totalPrice } =
    useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* ── Validation ── */
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Your name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.location.trim())
      newErrors.location = "Delivery location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Build order summary ── */
  const buildOrderText = () => {
    const lines = cartItems.map(
      (item) =>
        `• ${item.title || item.name} x${item.cartQty || 1} — KSh ${(
          (item.price || 0) * (item.cartQty || 1)
        ).toLocaleString()}`,
    );
    return [
      `*New Order — Smart Global*`,
      ``,
      `*Customer Details*`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Location: ${form.location}`,
      form.notes ? `Notes: ${form.notes}` : null,
      ``,
      `*Order Items*`,
      ...lines,
      ``,
      `*Total: KSh ${totalPrice.toLocaleString()}*`,
    ]
      .filter((l) => l !== null)
      .join("\n");
  };

  /* ── WhatsApp — use location.href so it works on mobile too ── */
  const handleWhatsApp = () => {
    if (!validateForm()) return;
    const text = encodeURIComponent(buildOrderText());
    // wa.me deep link works on both desktop and mobile
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    setSubmitted(true);
  };

  /* ── Email (mailto) ── */
  const handleEmail = () => {
    if (!validateForm()) return;
    const subject = encodeURIComponent(
      `New Order from ${form.name} — Smart Global`,
    );
    const plainText = buildOrderText().replace(/\*/g, "");
    const body = encodeURIComponent(plainText);
    window.location.href = `mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  /* ── Empty cart ── */
  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-soft flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <ShoppingCart className="w-9 h-9 text-muted" />
          </div>
          <h2 className="text-section-title text-gray-900 mb-2">
            YOUR CART IS EMPTY
          </h2>
          <div className="section-rule-center" />
          <p className="text-body mt-4 mb-6">
            Add some products before placing an order.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-soft flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <Package className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-section-title text-gray-900 mb-2">ORDER SENT!</h2>
          <div className="section-rule-center" />
          <p className="text-body mt-4 mb-2">
            Our sales team will confirm your order shortly.
          </p>
          <p className="text-xs text-muted mb-8">
            Reach us at{" "}
            <a
              href={`mailto:${SALES_EMAIL}`}
              className="text-red underline font-semibold"
            >
              {SALES_EMAIL}
            </a>
          </p>
          <button
            onClick={() => {
              clearCart();
              navigate("/");
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-body font-bold text-muted hover:text-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1
            className="text-section-title text-gray-900"
            style={{ fontSize: "1.1rem" }}
          >
            PLACE ORDER
          </h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto page-x py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* ── LEFT: Form + Cart ── */}
        <div className="space-y-6">
          {/* Contact Details */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-heading text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-red" />
              Your Details
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-label block mb-1.5 text-gray-700">
                  Full Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Wanjiku"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-body font-medium outline-none transition-all duration-200 focus:ring-2 ${
                    errors.name
                      ? "border-red bg-red-50 focus:ring-red/20"
                      : "border-border bg-soft focus:border-red focus:ring-red/15"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red mt-1 font-body">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-label block mb-1.5 text-gray-700">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0712 345 678"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-body font-medium outline-none transition-all duration-200 focus:ring-2 ${
                      errors.phone
                        ? "border-red bg-red-50 focus:ring-red/20"
                        : "border-border bg-soft focus:border-red focus:ring-red/15"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red mt-1 font-body">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="text-label block mb-1.5 text-gray-700">
                  Delivery Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Westlands, Nairobi"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-body font-medium outline-none transition-all duration-200 focus:ring-2 ${
                      errors.location
                        ? "border-red bg-red-50 focus:ring-red/20"
                        : "border-border bg-soft focus:border-red focus:ring-red/15"
                    }`}
                  />
                </div>
                {errors.location && (
                  <p className="text-xs text-red mt-1 font-body">
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-label block mb-1.5 text-gray-700">
                  Additional Notes{" "}
                  <span className="font-body font-normal text-muted normal-case text-xs">
                    (optional)
                  </span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 w-4 h-4 text-muted" />
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Anything specific about your order or delivery..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-soft text-sm font-body font-medium outline-none transition-all duration-200 focus:border-red focus:ring-2 focus:ring-red/15 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-heading text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-red" />
              Your Cart
              <span className="ml-auto text-xs font-body font-bold text-muted">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
              </span>
            </h2>

            <div className="divide-y divide-border">
              {cartItems.map((item) => {
                const id = item._id || item.id;
                const qty = item.cartQty || 1;
                const subtotal = (item.price || 0) * qty;
                return (
                  <div key={id} className="py-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-soft border border-border overflow-hidden flex-shrink-0">
                      <img
                        src={getImage(item)}
                        alt={item.title || item.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80?text=IMG";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm font-bold text-gray-900 truncate">
                        {item.title || item.name}
                      </p>
                      <p className="text-body mt-0.5">
                        KSh {(item.price || 0).toLocaleString()} each
                      </p>
                      {/* Qty controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(id, qty - 1)}
                          className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:border-red hover:text-red transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-heading text-sm font-bold w-5 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQty(id, qty + 1)}
                          className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:border-red hover:text-red transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-heading text-sm font-bold text-red">
                        KSh {subtotal.toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeFromCart(id)}
                        className="mt-2 text-gray-300 hover:text-red transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Summary + CTA ── */}
        <div>
          <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-heading text-base font-bold text-gray-900 mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
              {cartItems.map((item) => {
                const id = item._id || item.id;
                const qty = item.cartQty || 1;
                return (
                  <div key={id} className="flex justify-between">
                    <span className="font-body text-muted truncate max-w-[170px]">
                      {item.title || item.name}{" "}
                      <span className="text-gray-400">×{qty}</span>
                    </span>
                    <span className="font-body font-bold text-gray-800 ml-2 flex-shrink-0">
                      KSh {((item.price || 0) * qty).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-heading font-bold text-gray-900">
                Total
              </span>
              <span className="font-heading text-xl font-black text-red">
                KSh {totalPrice.toLocaleString()}
              </span>
            </div>

            <p className="text-body mb-6 text-xs">
              Delivery fees will be confirmed by our team after order placement.
            </p>

            {/* ── CTA Buttons ── */}
            <div className="space-y-3">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl font-body font-bold text-sm text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background:
                    "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  boxShadow: "0 6px 24px rgba(37, 211, 102, 0.3)",
                }}
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-sm font-black">Order via WhatsApp</div>
                    <div className="text-[10px] opacity-80 font-medium">
                      Opens WhatsApp chat
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70 flex-shrink-0" />
              </button>

              {/* Email */}
              <button
                onClick={handleEmail}
                className="btn-primary w-full flex items-center justify-between px-5 py-4 rounded-2xl"
                style={{ borderRadius: "1rem" }}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-sm font-black">Order via Email</div>
                    <div className="text-[10px] opacity-80 font-medium">
                      Opens your mail app
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70 flex-shrink-0" />
              </button>
            </div>

            <p className="text-center text-[10px] text-muted mt-4 font-body">
              Sends to{" "}
              <span className="font-semibold text-gray-500">{SALES_EMAIL}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
