import React, { useState, useEffect, useRef } from "react";
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

const ORDER_API =
  "https://sglobal-plf6.vercel.app/smartglobal/orders/create-order";
const WHATSAPP_NUMBER = "254140252223";

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

// Floating particle background
function Particles() {
  return (
    <div className="particles-container" aria-hidden="true">
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          className={`particle particle-${i % 6}`}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function PlaceOrder() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQty, clearCart, totalPrice } =
    useCart();
  const topRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    notes: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [successChannel, setSuccessChannel] = useState(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [submitted]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    if (!form.location.trim()) newErrors.location = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitToAPI = async (channel) => {
    if (!validateForm()) return;
    setLoading(true);
    setApiError(null);
    try {
      const token = localStorage.getItem("sg_token") || null;
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(ORDER_API, {
        method: "POST",
        headers,
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            location: form.location,
            notes: form.notes,
          },
          items: cartItems.map((item) => ({
            productId: item._id || item.id,
            title: item.title || item.name,
            price: item.price,
            quantity: item.cartQty || 1,
            image: item.image?.url || item.imageUrl || item.img || "",
            category: item.category || "",
          })),
          totalPrice,
          channel,
          sessionId: getSessionId(),
          customerEmail: form.email || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to place order.");

      if (channel === "whatsapp") {
        const lines = cartItems.map(
          (item) =>
            `• ${item.title || item.name} x${item.cartQty || 1} — KSh ${((item.price || 0) * (item.cartQty || 1)).toLocaleString()}`,
        );
        const text = encodeURIComponent(
          [
            `*New Order — Smart Global*`,
            ``,
            `Name: ${form.name}`,
            `Phone: ${form.phone}`,
            `Location: ${form.location}`,
            form.notes ? `Notes: ${form.notes}` : null,
            ``,
            ...lines,
            ``,
            `*Total: KSh ${totalPrice.toLocaleString()}*`,
          ]
            .filter(Boolean)
            .join("\n"),
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

  // ── Styles injected once ──────────────────────────────────────────────────
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

    .po-root { font-family: 'DM Sans', sans-serif; background: #0a0a0a; min-height: 100vh; color: #fff; }
    .po-heading { font-family: 'Playfair Display', serif; }

    /* Particles */
    .particles-container { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
    .particle { position: absolute; border-radius: 50%; opacity: 0; animation: floatUp linear infinite; }
    .particle-0 { width: 3px; height: 3px; background: #BF1A1A; }
    .particle-1 { width: 5px; height: 5px; background: rgba(191,26,26,0.4); border-radius: 2px; }
    .particle-2 { width: 2px; height: 2px; background: rgba(255,255,255,0.3); }
    .particle-3 { width: 4px; height: 4px; background: rgba(191,26,26,0.2); }
    .particle-4 { width: 6px; height: 2px; background: rgba(255,200,100,0.2); }
    .particle-5 { width: 3px; height: 3px; background: rgba(255,255,255,0.15); border-radius: 0; transform: rotate(45deg); }
    @keyframes floatUp { 0% { transform: translateY(110vh) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 0.5; } 100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; } }

    /* Noise texture overlay */
    .po-root::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; z-index: 1; opacity: 0.5; }

    /* Nav */
    .po-nav { position: sticky; top: 0; z-index: 100; background: rgba(10,10,10,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); }
    .po-nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .po-back-btn { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.4); background: none; border: none; cursor: pointer; transition: color 0.2s; padding: 0; }
    .po-back-btn:hover { color: #BF1A1A; }
    .po-nav-title { font-family: 'Playfair Display', serif; font-size: 15px; color: rgba(255,255,255,0.9); letter-spacing: 0.05em; }
    .po-badge { font-size: 11px; font-weight: 700; color: #BF1A1A; background: rgba(191,26,26,0.12); border: 1px solid rgba(191,26,26,0.3); padding: 4px 10px; border-radius: 20px; letter-spacing: 0.06em; }

    /* Layout */
    .po-layout { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; display: grid; grid-template-columns: 1fr 360px; gap: 24px; }
    @media (max-width: 900px) { .po-layout { grid-template-columns: 1fr; } }

    /* Cards */
    .po-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 28px; backdrop-filter: blur(10px); position: relative; overflow: hidden; }
    .po-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(191,26,26,0.5), transparent); }

    /* Step indicator */
    .po-step-label { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
    .po-step-dot { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #BF1A1A, #8B1414); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; box-shadow: 0 0 16px rgba(191,26,26,0.4); }
    .po-step-title { font-family: 'Playfair Display', serif; font-size: 16px; color: rgba(255,255,255,0.95); }

    /* Form fields */
    .po-field { margin-bottom: 16px; }
    .po-label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 8px; }
    .po-input-wrap { position: relative; }
    .po-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.2); pointer-events: none; }
    .po-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 13px 16px 13px 42px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400; color: #fff; outline: none; transition: all 0.2s; box-sizing: border-box; }
    .po-input::placeholder { color: rgba(255,255,255,0.18); }
    .po-input:focus { border-color: rgba(191,26,26,0.6); background: rgba(191,26,26,0.04); box-shadow: 0 0 0 3px rgba(191,26,26,0.08); }
    .po-input.error { border-color: rgba(191,26,26,0.8); background: rgba(191,26,26,0.06); }
    .po-input-no-icon { padding-left: 16px; }
    .po-textarea { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 13px 16px 13px 42px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #fff; outline: none; transition: all 0.2s; resize: none; box-sizing: border-box; }
    .po-textarea::placeholder { color: rgba(255,255,255,0.18); }
    .po-textarea:focus { border-color: rgba(191,26,26,0.6); background: rgba(191,26,26,0.04); box-shadow: 0 0 0 3px rgba(191,26,26,0.08); }
    .po-error-msg { font-size: 11px; color: #ff6b6b; margin-top: 5px; font-weight: 500; }

    /* Cart items */
    .po-cart-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .po-cart-item:last-child { border-bottom: none; }
    .po-cart-img { width: 58px; height: 58px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); object-fit: contain; padding: 4px; flex-shrink: 0; }
    .po-cart-name { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.9); line-height: 1.3; }
    .po-cart-price { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 3px; }
    .po-qty-ctrl { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
    .po-qty-btn { width: 24px; height: 24px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); background: none; color: rgba(255,255,255,0.5); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; padding: 0; }
    .po-qty-btn:hover { border-color: #BF1A1A; color: #BF1A1A; background: rgba(191,26,26,0.1); }
    .po-qty-num { font-size: 13px; font-weight: 700; color: #fff; width: 20px; text-align: center; }
    .po-subtotal { font-size: 13px; font-weight: 700; color: #BF1A1A; margin-left: auto; text-align: right; flex-shrink: 0; }
    .po-remove { display: block; font-size: 10px; color: rgba(255,255,255,0.2); cursor: pointer; margin-top: 4px; background: none; border: none; padding: 0; transition: color 0.15s; }
    .po-remove:hover { color: #BF1A1A; }

    /* Summary card */
    .po-summary-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 24px; position: sticky; top: 80px; backdrop-filter: blur(10px); }
    .po-summary-title { font-family: 'Playfair Display', serif; font-size: 18px; color: #fff; margin-bottom: 20px; }
    .po-summary-line { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
    .po-summary-name { font-size: 12px; color: rgba(255,255,255,0.35); max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .po-summary-val { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.6); flex-shrink: 0; margin-left: 8px; }
    .po-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 16px 0; }
    .po-total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .po-total-label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
    .po-total-amount { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 900; color: #fff; }
    .po-delivery-note { font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: 0.03em; margin-bottom: 24px; }

    /* CTA buttons */
    .po-btn-wa { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 14px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px; color: #fff; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); box-shadow: 0 8px 28px rgba(37,211,102,0.25); transition: all 0.25s; margin-bottom: 10px; }
    .po-btn-wa:hover { transform: translateY(-1px); box-shadow: 0 12px 36px rgba(37,211,102,0.35); }
    .po-btn-wa:active { transform: translateY(0); }
    .po-btn-wa:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .po-btn-email { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 14px; border: 1px solid rgba(191,26,26,0.5); cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px; color: #fff; background: linear-gradient(135deg, rgba(191,26,26,0.15) 0%, rgba(139,20,20,0.25) 100%); transition: all 0.25s; }
    .po-btn-email:hover { background: linear-gradient(135deg, #BF1A1A 0%, #8B1414 100%); border-color: transparent; box-shadow: 0 8px 28px rgba(191,26,26,0.35); transform: translateY(-1px); }
    .po-btn-email:active { transform: translateY(0); }
    .po-btn-email:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .po-btn-icon-wrap { display: flex; align-items: center; gap: 10px; }
    .po-btn-label { font-size: 13px; font-weight: 700; }
    .po-btn-sub { font-size: 10px; opacity: 0.6; font-weight: 400; margin-top: 1px; }

    .po-api-error { background: rgba(191,26,26,0.1); border: 1px solid rgba(191,26,26,0.3); border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #ff8080; margin-bottom: 14px; }

    /* Loading spinner inside btn */
    .po-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Success screen */
    .po-success { position: relative; z-index: 2; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
    .po-success-inner { max-width: 480px; width: 100%; text-align: center; }
    .po-success-ring { width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 32px; position: relative; display: flex; align-items: center; justify-content: center; }
    .po-success-ring::before { content: ''; position: absolute; inset: -4px; border-radius: 50%; background: conic-gradient(#BF1A1A 0%, #25D366 50%, #BF1A1A 100%); animation: rotatering 3s linear infinite; z-index: 0; }
    .po-success-ring::after { content: ''; position: absolute; inset: 3px; border-radius: 50%; background: #0a0a0a; z-index: 1; }
    @keyframes rotatering { to { transform: rotate(360deg); } }
    .po-success-icon { position: relative; z-index: 2; }
    .po-success-h { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; color: #fff; margin-bottom: 8px; line-height: 1.1; }
    .po-success-sub { font-size: 14px; color: rgba(255,255,255,0.45); margin-bottom: 32px; line-height: 1.6; }
    .po-success-detail { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px 24px; margin-bottom: 32px; text-align: left; }
    .po-success-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .po-success-row:last-child { border-bottom: none; }
    .po-success-key { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
    .po-success-val { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.75); }
    .po-home-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: linear-gradient(135deg, #BF1A1A, #8B1414); color: #fff; border: none; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; letter-spacing: 0.05em; transition: all 0.25s; box-shadow: 0 8px 28px rgba(191,26,26,0.35); }
    .po-home-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(191,26,26,0.45); }

    /* Empty cart */
    .po-empty { position: relative; z-index: 2; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .po-empty-inner { text-align: center; max-width: 340px; padding: 40px 24px; }
    .po-empty-icon { width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    .po-empty-h { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; margin-bottom: 12px; }
    .po-empty-p { font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 28px; line-height: 1.6; }
    .po-browse-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: rgba(191,26,26,0.15); border: 1px solid rgba(191,26,26,0.4); color: #fff; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .po-browse-btn:hover { background: #BF1A1A; border-color: #BF1A1A; }

    /* Red accent line decorative */
    .po-accent-bar { height: 2px; background: linear-gradient(90deg, #BF1A1A, transparent); border-radius: 2px; margin-bottom: 24px; width: 40px; }

    /* Channel pill */
    .po-channel-pill { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .po-channel-wa { background: rgba(37,211,102,0.15); color: #25D366; border: 1px solid rgba(37,211,102,0.3); }
    .po-channel-email { background: rgba(191,26,26,0.15); color: #ff6b6b; border: 1px solid rgba(191,26,26,0.3); }

    /* Glow orb */
    .po-orb { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
    .po-orb-1 { width: 500px; height: 500px; background: rgba(191,26,26,0.07); top: -100px; right: -100px; }
    .po-orb-2 { width: 400px; height: 400px; background: rgba(191,26,26,0.04); bottom: -80px; left: -80px; }
  `;

  if (cartItems.length === 0 && !submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="po-root">
          <Particles />
          <div className="po-orb po-orb-1" />
          <div className="po-orb po-orb-2" />
          <div ref={topRef} />
          <div className="po-empty">
            <div className="po-empty-inner">
              <div className="po-empty-icon">
                <ShoppingCart size={28} color="rgba(255,255,255,0.3)" />
              </div>
              <h2 className="po-empty-h">Your cart is empty</h2>
              <p className="po-empty-p">
                Add some products before you place an order with us.
              </p>
              <button
                className="po-browse-btn"
                onClick={() => navigate("/products")}
              >
                <ArrowLeft size={14} /> Browse Products
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="po-root">
          <Particles />
          <div className="po-orb po-orb-1" />
          <div className="po-orb po-orb-2" />
          <div ref={topRef} />
          <div className="po-success">
            <div className="po-success-inner">
              <div className="po-success-ring">
                <div className="po-success-icon">
                  <Package size={36} color="#fff" />
                </div>
              </div>
              <h1 className="po-success-h">Order Received.</h1>
              <p className="po-success-sub">
                Your order has been saved and our team
                <br />
                will reach out to confirm shortly.
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
                  <span className="po-success-val">
                    KSh {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="po-success-row">
                  <span className="po-success-key">Channel</span>
                  <span
                    className={`po-channel-pill ${successChannel === "whatsapp" ? "po-channel-wa" : "po-channel-email"}`}
                  >
                    {successChannel === "whatsapp" ? (
                      <MessageCircle size={10} />
                    ) : (
                      <Mail size={10} />
                    )}
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
              <button
                className="po-home-btn"
                onClick={() => {
                  clearCart();
                  navigate("/");
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="po-root">
        <Particles />
        <div className="po-orb po-orb-1" />
        <div className="po-orb po-orb-2" />
        <div ref={topRef} />

        {/* Nav */}
        <nav className="po-nav">
          <div className="po-nav-inner">
            <button className="po-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} /> Back
            </button>
            <span className="po-nav-title">Place Order</span>
            <span className="po-badge">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </span>
          </div>
        </nav>

        <div className="po-layout">
          {/* LEFT */}
          <div>
            {/* Details card */}
            <div className="po-card" style={{ marginBottom: 20 }}>
              <div className="po-step-label">
                <div className="po-step-dot">1</div>
                <span className="po-step-title">Your Details</span>
              </div>
              <div className="po-accent-bar" />

              {/* Name */}
              <div className="po-field">
                <label className="po-label">Full Name *</label>
                <div className="po-input-wrap">
                  <User size={14} className="po-input-icon" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Jane Wanjiku"
                    className={`po-input ${errors.name ? "error" : ""}`}
                  />
                </div>
                {errors.name && <p className="po-error-msg">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div className="po-field">
                <label className="po-label">Phone Number *</label>
                <div className="po-input-wrap">
                  <Phone size={14} className="po-input-icon" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0712 345 678"
                    className={`po-input ${errors.phone ? "error" : ""}`}
                  />
                </div>
                {errors.phone && <p className="po-error-msg">{errors.phone}</p>}
              </div>

              {/* Location */}
              <div className="po-field">
                <label className="po-label">Delivery Location *</label>
                <div className="po-input-wrap">
                  <MapPin size={14} className="po-input-icon" />
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Westlands, Nairobi"
                    className={`po-input ${errors.location ? "error" : ""}`}
                  />
                </div>
                {errors.location && (
                  <p className="po-error-msg">{errors.location}</p>
                )}
              </div>

              {/* Email */}
              <div className="po-field">
                <label className="po-label">
                  Email{" "}
                  <span
                    style={{
                      opacity: 0.5,
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    — optional, for confirmation
                  </span>
                </label>
                <div className="po-input-wrap">
                  <Mail size={14} className="po-input-icon" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. jane@gmail.com"
                    className="po-input"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="po-field" style={{ marginBottom: 0 }}>
                <label className="po-label">
                  Notes{" "}
                  <span
                    style={{
                      opacity: 0.5,
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    — optional
                  </span>
                </label>
                <div className="po-input-wrap">
                  <FileText
                    size={14}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: 14,
                      color: "rgba(255,255,255,0.2)",
                      pointerEvents: "none",
                    }}
                  />
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Special instructions or delivery notes..."
                    className="po-textarea"
                  />
                </div>
              </div>
            </div>

            {/* Cart card */}
            <div className="po-card">
              <div className="po-step-label">
                <div className="po-step-dot">2</div>
                <span className="po-step-title">Review Your Cart</span>
              </div>
              <div className="po-accent-bar" />

              {cartItems.map((item) => {
                const id = item._id || item.id;
                const qty = item.cartQty || 1;
                return (
                  <div key={id} className="po-cart-item">
                    <img
                      src={getImage(item)}
                      alt={item.title || item.name}
                      className="po-cart-img"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80?text=IMG";
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="po-cart-name">
                        {item.title || item.name}
                      </div>
                      <div className="po-cart-price">
                        KSh {(item.price || 0).toLocaleString()} each
                      </div>
                      <div className="po-qty-ctrl">
                        <button
                          className="po-qty-btn"
                          onClick={() => updateQty(id, qty - 1)}
                        >
                          <Minus size={10} />
                        </button>
                        <span className="po-qty-num">{qty}</span>
                        <button
                          className="po-qty-btn"
                          onClick={() => updateQty(id, qty + 1)}
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div className="po-subtotal">
                        KSh {((item.price || 0) * qty).toLocaleString()}
                      </div>
                      <button
                        className="po-remove"
                        onClick={() => removeFromCart(id)}
                      >
                        remove
                      </button>
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
                const id = item._id || item.id;
                const qty = item.cartQty || 1;
                return (
                  <div key={id} className="po-summary-line">
                    <span className="po-summary-name">
                      {item.title || item.name}{" "}
                      <span style={{ opacity: 0.4 }}>×{qty}</span>
                    </span>
                    <span className="po-summary-val">
                      KSh {((item.price || 0) * qty).toLocaleString()}
                    </span>
                  </div>
                );
              })}

              <div className="po-divider" />

              <div className="po-total-row">
                <span className="po-total-label">Total</span>
                <span className="po-total-amount">
                  KSh {totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="po-delivery-note">
                Delivery fees confirmed after order placement
              </p>

              {apiError && <div className="po-api-error">{apiError}</div>}

              {/* WhatsApp */}
              <button
                className="po-btn-wa"
                onClick={() => submitToAPI("whatsapp")}
                disabled={loading}
              >
                <div className="po-btn-icon-wrap">
                  {loading ? (
                    <div className="po-spinner" />
                  ) : (
                    <MessageCircle size={16} />
                  )}
                  <div>
                    <div className="po-btn-label">
                      {loading ? "Placing order…" : "Order via WhatsApp"}
                    </div>
                    <div className="po-btn-sub">Saves order · opens chat</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>

              {/* Email */}
              <button
                className="po-btn-email"
                onClick={() => submitToAPI("email")}
                disabled={loading}
              >
                <div className="po-btn-icon-wrap">
                  {loading ? (
                    <div className="po-spinner" />
                  ) : (
                    <Mail size={16} />
                  )}
                  <div>
                    <div className="po-btn-label">
                      {loading ? "Placing order…" : "Order via Email"}
                    </div>
                    <div className="po-btn-sub">
                      Saves order · sends confirmation
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>

              <p
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.15)",
                  marginTop: 16,
                  letterSpacing: "0.05em",
                }}
              >
                Orders are saved to your account history
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
