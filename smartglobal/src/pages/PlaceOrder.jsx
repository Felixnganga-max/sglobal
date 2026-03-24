import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart, Trash2, Plus, Minus, Mail, MessageCircle,
  ArrowLeft, Package, ChevronRight, User, Phone, MapPin, FileText,
} from "lucide-react";
import { useCart } from "../context/Cartcontext";
import emailjs from "@emailjs/browser";

// ─── EmailJS Configuration ───────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_clzf6de";
const EMAILJS_ADMIN_TEMPLATE_ID    = "template_abh0rep"; // → sends to orders@smartglobal.com
const EMAILJS_CUSTOMER_TEMPLATE_ID = "template_CUSTOMER"; // → sends to customer (set To Email = {{customer_email}} in dashboard)
const EMAILJS_PUBLIC_KEY  = "zm6PlmVWX9FqeDYD0";

const WHATSAPP_NUMBER = "254140252223";
// ─────────────────────────────────────────────────────────────────────────────

function getSessionId() {
  let id = sessionStorage.getItem("sg_session_id");
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem("sg_session_id", id);
  }
  return id;
}

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
  const { cartItems, removeFromCart, updateQty, clearCart, totalPrice } = useCart();
  const topRef  = useRef(null);

  const [form, setForm] = useState({ name: "", phone: "", location: "", notes: "", email: "" });
  const [errors, setErrors]           = useState({});
  const [submitted, setSubmitted]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState(null);
  const [successChannel, setSuccessChannel] = useState(null);

  useEffect(() => { topRef.current?.scrollIntoView({ behavior: "smooth" }); }, [submitted]);
  useEffect(() => { emailjs.init(EMAILJS_PUBLIC_KEY); }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim())     newErrors.name     = "Required";
    if (!form.phone.trim())    newErrors.phone    = "Required";
    if (!form.location.trim()) newErrors.location = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Shared params — all {{variables}} used across both email templates
  const buildEmailParams = () => {
    const itemsList = cartItems
      .map((item) =>
        `• ${item.title || item.name} x${item.cartQty || 1} — KSh ${((item.price || 0) * (item.cartQty || 1)).toLocaleString()}`
      )
      .join("\n");

    return {
      from_name:         form.name,
      customer_name:     form.name,
      customer_phone:    form.phone,
      customer_location: form.location,
      customer_notes:    form.notes || "No additional notes",
      customer_email:    form.email || "Not provided",   // used as {{customer_email}} in customer template To field
      order_items:       itemsList,
      total_amount:      `KSh ${totalPrice.toLocaleString()}`,
      session_id:        getSessionId(),
      order_date:        new Date().toLocaleString(),
    };
  };

  const submitToAPI = async (channel) => {

     // 🔍 TEMP DEBUG — remove after fixing
  console.table({
    SERVICE_ID:  EMAILJS_SERVICE_ID,
    TEMPLATE_ID: EMAILJS_ADMIN_TEMPLATE_ID,
    PUBLIC_KEY:  EMAILJS_PUBLIC_KEY,
  });
  console.log("Params being sent:", buildEmailParams());
  // end debug
    if (!validateForm()) return;
    setLoading(true);
    setApiError(null);

    try {
      if (channel === "email") {
        const emailParams = buildEmailParams();

        // 1️⃣ Admin notification → orders@smartglobal.com
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ADMIN_TEMPLATE_ID, emailParams);

        // 2️⃣ Customer confirmation → only if they provided an email
        if (form.email) {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE_ID, emailParams);
        }

        // 3️⃣ Optional: sync order to backend (non-blocking)
        try {
          const token   = localStorage.getItem("sg_token") || null;
          const headers = { "Content-Type": "application/json" };
          if (token) headers["Authorization"] = `Bearer ${token}`;

          await fetch("https://sglobal-plf6.vercel.app/smartglobal/orders/create-order", {
            method: "POST",
            headers,
            body: JSON.stringify({
              customer:      { name: form.name, phone: form.phone, location: form.location, notes: form.notes },
              items:         cartItems.map((item) => ({
                productId: item._id || item.id,
                title:     item.title || item.name,
                price:     item.price,
                quantity:  item.cartQty || 1,
                image:     item.image?.url || item.imageUrl || item.img || "",
                category:  item.category || "",
              })),
              totalPrice,
              channel,
              sessionId:     getSessionId(),
              customerEmail: form.email || undefined,
            }),
          });
        } catch (backendErr) {
          console.warn("Email sent — backend sync failed:", backendErr);
        }

      } else if (channel === "whatsapp") {
        // 1️⃣ Save order to backend first
        const token   = localStorage.getItem("sg_token") || null;
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res  = await fetch("https://sglobal-plf6.vercel.app/smartglobal/orders/create-order", {
          method: "POST",
          headers,
          body: JSON.stringify({
            customer:      { name: form.name, phone: form.phone, location: form.location, notes: form.notes },
            items:         cartItems.map((item) => ({
              productId: item._id || item.id,
              title:     item.title || item.name,
              price:     item.price,
              quantity:  item.cartQty || 1,
              image:     item.image?.url || item.imageUrl || item.img || "",
              category:  item.category || "",
            })),
            totalPrice,
            channel,
            sessionId:     getSessionId(),
            customerEmail: form.email || undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to place order.");

        // 2️⃣ Open WhatsApp
        const lines = cartItems.map(
          (item) => `• ${item.title || item.name} x${item.cartQty || 1} — KSh ${((item.price || 0) * (item.cartQty || 1)).toLocaleString()}`
        );
        const text = encodeURIComponent(
          [
            `*New Order — Smart Global*`, ``,
            `Name: ${form.name}`,
            `Phone: ${form.phone}`,
            `Location: ${form.location}`,
            form.notes ? `Notes: ${form.notes}` : null,
            ``, ...lines, ``,
            `*Total: KSh ${totalPrice.toLocaleString()}*`,
          ].filter(Boolean).join("\n")
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
      }

      setSuccessChannel(channel);
      setSubmitted(true);

    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Styles ────────────────────────────────────────────────────────────────
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; }

    .po-root { font-family: 'Outfit', sans-serif; background: #f5f5f5; min-height: 100vh; color: #1a1a1a; }

    /* Nav */
    .po-nav { position: sticky; top: 0; z-index: 100; background: #fff; border-bottom: 1px solid #e8e8e8; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
    .po-nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 20px; height: 60px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .po-back-btn { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #555; background: none; border: none; cursor: pointer; padding: 6px 10px; border-radius: 8px; transition: background 0.15s, color 0.15s; white-space: nowrap; }
    .po-back-btn:hover { background: #f0f0f0; color: #BF1A1A; }
    .po-nav-title { font-size: 16px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.01em; }
    .po-badge { font-size: 11px; font-weight: 700; color: #BF1A1A; background: #fef2f2; border: 1px solid #fecaca; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }

    /* Layout */
    .po-layout { max-width: 1100px; margin: 0 auto; padding: 28px 20px 60px; display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
    @media (max-width: 860px) { .po-layout { grid-template-columns: 1fr; padding: 20px 16px 60px; } }

    /* Cards */
    .po-card { background: #fff; border: 1px solid #e8e8e8; border-radius: 16px; padding: 24px; }
    .po-card + .po-card { margin-top: 16px; }
    .po-section-head { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
    .po-step-dot { width: 26px; height: 26px; border-radius: 50%; background: #BF1A1A; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .po-step-title { font-size: 15px; font-weight: 700; color: #1a1a1a; }

    /* Form */
    .po-field { margin-bottom: 14px; }
    .po-field:last-child { margin-bottom: 0; }
    .po-label { display: block; font-size: 12px; font-weight: 600; color: #555; margin-bottom: 6px; }
    .po-label span { font-weight: 400; color: #999; }
    .po-input-wrap { position: relative; }
    .po-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none; }
    .po-input { width: 100%; background: #fafafa; border: 1.5px solid #e8e8e8; border-radius: 10px; padding: 11px 14px 11px 38px; font-family: 'Outfit', sans-serif; font-size: 14px; color: #1a1a1a; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
    .po-input::placeholder { color: #bbb; }
    .po-input:focus { border-color: #BF1A1A; background: #fff; box-shadow: 0 0 0 3px rgba(191,26,26,0.08); }
    .po-input.error { border-color: #ef4444; }
    .po-textarea { width: 100%; background: #fafafa; border: 1.5px solid #e8e8e8; border-radius: 10px; padding: 11px 14px 11px 38px; font-family: 'Outfit', sans-serif; font-size: 14px; color: #1a1a1a; outline: none; transition: border-color 0.2s, box-shadow 0.2s; resize: none; }
    .po-textarea::placeholder { color: #bbb; }
    .po-textarea:focus { border-color: #BF1A1A; background: #fff; box-shadow: 0 0 0 3px rgba(191,26,26,0.08); }
    .po-error-msg { font-size: 11px; color: #ef4444; margin-top: 4px; font-weight: 500; }

    /* Cart items */
    .po-cart-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f0f0f0; }
    .po-cart-item:last-child { border-bottom: none; padding-bottom: 0; }
    .po-cart-item:first-child { padding-top: 0; }
    .po-cart-img { width: 60px; height: 60px; border-radius: 10px; background: #f5f5f5; border: 1px solid #e8e8e8; object-fit: contain; padding: 6px; flex-shrink: 0; }
    .po-cart-info { flex: 1; min-width: 0; }
    .po-cart-name { font-size: 14px; font-weight: 600; color: #1a1a1a; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .po-cart-price { font-size: 12px; color: #888; margin-top: 2px; }
    .po-qty-ctrl { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
    .po-qty-btn { width: 26px; height: 26px; border-radius: 8px; border: 1.5px solid #e0e0e0; background: #fff; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; padding: 0; flex-shrink: 0; }
    .po-qty-btn:hover { border-color: #BF1A1A; color: #BF1A1A; background: #fef2f2; }
    .po-qty-num { font-size: 14px; font-weight: 700; color: #1a1a1a; width: 20px; text-align: center; }
    .po-cart-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
    .po-subtotal { font-size: 14px; font-weight: 700; color: #BF1A1A; }
    .po-remove-btn { width: 30px; height: 30px; border-radius: 8px; border: 1.5px solid #e8e8e8; background: #fff; color: #bbb; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; padding: 0; }
    .po-remove-btn:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

    /* Summary */
    .po-summary-card { background: #fff; border: 1px solid #e8e8e8; border-radius: 16px; padding: 24px; position: sticky; top: 76px; }
    @media (max-width: 860px) { .po-summary-card { position: static; order: -1; } }
    .po-summary-title { font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
    .po-summary-line { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; gap: 8px; }
    .po-summary-name { font-size: 13px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
    .po-summary-val { font-size: 13px; font-weight: 600; color: #1a1a1a; flex-shrink: 0; }
    .po-divider { height: 1px; background: #f0f0f0; margin: 14px 0; }
    .po-total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .po-total-label { font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.06em; }
    .po-total-amount { font-size: 24px; font-weight: 700; color: #1a1a1a; }
    .po-delivery-note { font-size: 11px; color: #bbb; margin-top: 4px; margin-bottom: 20px; }

    /* Buttons */
    .po-btn-wa { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; border-radius: 12px; border: none; cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px; color: #fff; background: #25D366; transition: all 0.2s; margin-bottom: 10px; }
    .po-btn-wa:hover { background: #1fba58; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,211,102,0.3); }
    .po-btn-wa:active { transform: translateY(0); }
    .po-btn-wa:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
    .po-btn-email { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; border-radius: 12px; border: 1.5px solid #BF1A1A; cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px; color: #BF1A1A; background: #fff; transition: all 0.2s; }
    .po-btn-email:hover { background: #BF1A1A; color: #fff; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(191,26,26,0.2); }
    .po-btn-email:active { transform: translateY(0); }
    .po-btn-email:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
    .po-btn-icon-wrap { display: flex; align-items: center; gap: 10px; }
    .po-btn-label { font-size: 13px; font-weight: 600; }
    .po-btn-sub { font-size: 10px; opacity: 0.65; font-weight: 400; margin-top: 1px; }

    .po-api-error { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #ef4444; margin-bottom: 14px; }

    .po-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .po-footer-note { text-align: center; font-size: 11px; color: #ccc; margin-top: 14px; }

    /* Success */
    .po-success { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
    .po-success-inner { max-width: 440px; width: 100%; text-align: center; }
    .po-success-icon-wrap { width: 80px; height: 80px; border-radius: 50%; background: #fef2f2; border: 2px solid #fecaca; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    .po-success-h { font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
    .po-success-sub { font-size: 14px; color: #777; margin-bottom: 28px; line-height: 1.6; }
    .po-success-detail { background: #fafafa; border: 1px solid #e8e8e8; border-radius: 14px; padding: 18px 20px; margin-bottom: 28px; text-align: left; }
    .po-success-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid #f0f0f0; gap: 12px; }
    .po-success-row:last-child { border-bottom: none; }
    .po-success-key { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #aaa; }
    .po-success-val { font-size: 13px; font-weight: 600; color: #1a1a1a; text-align: right; }
    .po-channel-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .po-channel-wa { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
    .po-channel-email { background: #fef2f2; color: #BF1A1A; border: 1px solid #fecaca; }
    .po-home-btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 32px; background: #BF1A1A; color: #fff; border: none; border-radius: 50px; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .po-home-btn:hover { background: #a51717; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(191,26,26,0.3); }

    /* Empty */
    .po-empty { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
    .po-empty-inner { text-align: center; max-width: 320px; }
    .po-empty-icon { width: 72px; height: 72px; border-radius: 50%; background: #f5f5f5; border: 1px solid #e8e8e8; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
    .po-empty-h { font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px; }
    .po-empty-p { font-size: 14px; color: #888; margin-bottom: 24px; line-height: 1.6; }
    .po-browse-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: #BF1A1A; color: #fff; border: none; border-radius: 50px; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .po-browse-btn:hover { background: #a51717; }

    @media (max-width: 480px) { .po-card { padding: 18px; } .po-summary-card { padding: 18px; } .po-cart-img { width: 50px; height: 50px; } }
  `;

  // ─── Empty cart ─────────────────────────────────────────────────────────────
  if (cartItems.length === 0 && !submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="po-root">
          <div ref={topRef} />
          <div className="po-empty">
            <div className="po-empty-inner">
              <div className="po-empty-icon"><ShoppingCart size={28} color="#bbb" /></div>
              <h2 className="po-empty-h">Your cart is empty</h2>
              <p className="po-empty-p">Add some products before you place an order with us.</p>
              <button className="po-browse-btn" onClick={() => navigate("/products")}>
                <ArrowLeft size={14} /> Browse Products
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="po-root">
          <div ref={topRef} />
          <div className="po-success">
            <div className="po-success-inner">
              <div className="po-success-icon-wrap"><Package size={32} color="#BF1A1A" /></div>
              <h1 className="po-success-h">Order Received!</h1>
              <p className="po-success-sub">
                Your order has been saved and our team
                <br />will reach out to confirm shortly.
                {successChannel === "email" && form.email && (
                  <><br /><br />A confirmation has been sent to <strong>{form.email}</strong></>
                )}
              </p>
              <div className="po-success-detail">
                <div className="po-success-row">
                  <span className="po-success-key">Customer</span>
                  <span className="po-success-val">{form.name}</span>
                </div>
                <div className="po-success-row">
                  <span className="po-success-key">Phone</span>
                  <span className="po-success-val">{form.phone}</span>
                </div>
                <div className="po-success-row">
                  <span className="po-success-key">Location</span>
                  <span className="po-success-val">{form.location}</span>
                </div>
                <div className="po-success-row">
                  <span className="po-success-key">Total</span>
                  <span className="po-success-val">KSh {totalPrice.toLocaleString()}</span>
                </div>
                <div className="po-success-row">
                  <span className="po-success-key">Channel</span>
                  <span className={`po-channel-pill ${successChannel === "whatsapp" ? "po-channel-wa" : "po-channel-email"}`}>
                    {successChannel === "whatsapp" ? <MessageCircle size={10} /> : <Mail size={10} />}
                    {successChannel}
                  </span>
                </div>
                {form.email && (
                  <div className="po-success-row">
                    <span className="po-success-key">Confirmation</span>
                    <span className="po-success-val">{form.email}</span>
                  </div>
                )}
              </div>
              <button className="po-home-btn" onClick={() => { clearCart(); navigate("/"); }}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── Main form ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="po-root">
        <div ref={topRef} />

        <nav className="po-nav">
          <div className="po-nav-inner">
            <button className="po-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} /> Back
            </button>
            <span className="po-nav-title">Place Order</span>
            <span className="po-badge">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</span>
          </div>
        </nav>

        <div className="po-layout">
          {/* LEFT */}
          <div>
            {/* Details */}
            <div className="po-card">
              <div className="po-section-head">
                <div className="po-step-dot">1</div>
                <span className="po-step-title">Your Details</span>
              </div>

              <div className="po-field">
                <label className="po-label">Full Name *</label>
                <div className="po-input-wrap">
                  <User size={14} className="po-input-icon" />
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Jane Wanjiku" className={`po-input ${errors.name ? "error" : ""}`} />
                </div>
                {errors.name && <p className="po-error-msg">{errors.name}</p>}
              </div>

              <div className="po-field">
                <label className="po-label">Phone Number *</label>
                <div className="po-input-wrap">
                  <Phone size={14} className="po-input-icon" />
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0712 345 678" className={`po-input ${errors.phone ? "error" : ""}`} />
                </div>
                {errors.phone && <p className="po-error-msg">{errors.phone}</p>}
              </div>

              <div className="po-field">
                <label className="po-label">Delivery Location *</label>
                <div className="po-input-wrap">
                  <MapPin size={14} className="po-input-icon" />
                  <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Westlands, Nairobi" className={`po-input ${errors.location ? "error" : ""}`} />
                </div>
                {errors.location && <p className="po-error-msg">{errors.location}</p>}
              </div>

              <div className="po-field">
                <label className="po-label">Email <span>— optional, for confirmation copy</span></label>
                <div className="po-input-wrap">
                  <Mail size={14} className="po-input-icon" />
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. jane@gmail.com" className="po-input" />
                </div>
              </div>

              <div className="po-field">
                <label className="po-label">Notes <span>— optional</span></label>
                <div className="po-input-wrap">
                  <FileText size={14} style={{ position: "absolute", left: 12, top: 13, color: "#aaa", pointerEvents: "none" }} />
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Special instructions or delivery notes..." className="po-textarea" />
                </div>
              </div>
            </div>

            {/* Cart review */}
            <div className="po-card" style={{ marginTop: 16 }}>
              <div className="po-section-head">
                <div className="po-step-dot">2</div>
                <span className="po-step-title">Review Your Cart</span>
              </div>

              {cartItems.map((item) => {
                const id  = item._id || item.id;
                const qty = item.cartQty || 1;
                return (
                  <div key={id} className="po-cart-item">
                    <img src={getImage(item)} alt={item.title || item.name} className="po-cart-img" onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=IMG"; }} />
                    <div className="po-cart-info">
                      <div className="po-cart-name">{item.title || item.name}</div>
                      <div className="po-cart-price">KSh {(item.price || 0).toLocaleString()} each</div>
                      <div className="po-qty-ctrl">
                        <button className="po-qty-btn" onClick={() => updateQty(id, qty - 1)}><Minus size={10} /></button>
                        <span className="po-qty-num">{qty}</span>
                        <button className="po-qty-btn" onClick={() => updateQty(id, qty + 1)}><Plus size={10} /></button>
                      </div>
                    </div>
                    <div className="po-cart-right">
                      <div className="po-subtotal">KSh {((item.price || 0) * qty).toLocaleString()}</div>
                      <button className="po-remove-btn" onClick={() => removeFromCart(id)} title="Remove item"><Trash2 size={13} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div>
            <div className="po-summary-card">
              <div className="po-summary-title">Order Summary</div>

              {cartItems.map((item) => {
                const id  = item._id || item.id;
                const qty = item.cartQty || 1;
                return (
                  <div key={id} className="po-summary-line">
                    <span className="po-summary-name">{item.title || item.name} <span style={{ color: "#bbb" }}>×{qty}</span></span>
                    <span className="po-summary-val">KSh {((item.price || 0) * qty).toLocaleString()}</span>
                  </div>
                );
              })}

              <div className="po-divider" />
              <div className="po-total-row">
                <span className="po-total-label">Total</span>
                <span className="po-total-amount">KSh {totalPrice.toLocaleString()}</span>
              </div>
              <p className="po-delivery-note">Delivery fees confirmed after order placement</p>

              {apiError && <div className="po-api-error">{apiError}</div>}

              <button className="po-btn-wa" onClick={() => submitToAPI("whatsapp")} disabled={loading}>
                <div className="po-btn-icon-wrap">
                  {loading ? <div className="po-spinner" /> : <MessageCircle size={16} />}
                  <div>
                    <div className="po-btn-label">{loading ? "Placing order…" : "Order via WhatsApp"}</div>
                    <div className="po-btn-sub">Saves order · opens chat</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>

              <button className="po-btn-email" onClick={() => submitToAPI("email")} disabled={loading}>
                <div className="po-btn-icon-wrap">
                  {loading ? <div className="po-spinner" style={{ borderTopColor: "#BF1A1A", borderColor: "rgba(191,26,26,0.3)" }} /> : <Mail size={16} />}
                  <div>
                    <div className="po-btn-label">{loading ? "Placing order…" : "Order via Email"}</div>
                    <div className="po-btn-sub">Saves order · sends confirmation</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>

              <p className="po-footer-note">Orders are saved to your account history</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}