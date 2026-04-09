import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  ArrowRight,
  ShoppingBag,
  LogIn,
  MapPin,
  Phone,
  User,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const API_BASE = "https://sglobal-plf6.vercel.app/smartglobal/orders";

function getToken() {
  return localStorage.getItem("token") || null;
}

// Normalize _id <-> id so both fields always exist
function getUser() {
  try {
    const u = localStorage.getItem("user");
    if (!u) return null;
    const parsed = JSON.parse(u);
    if (parsed._id && !parsed.id) parsed.id = parsed._id;
    if (parsed.id && !parsed._id) parsed._id = parsed.id;
    return parsed;
  } catch {
    return null;
  }
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isPending = status === "pending";
  return (
    <span
      className="text-label inline-flex items-center gap-1 px-2 py-1 rounded-full"
      style={{
        fontSize: "0.6rem",
        background: isPending ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)",
        color: isPending ? "#d97706" : "#16a34a",
        border: `1px solid ${isPending ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)"}`,
      }}
    >
      {isPending ? <Clock size={9} /> : <CheckCircle size={9} />}
      {status}
    </span>
  );
}

// ── Channel badge ─────────────────────────────────────────────────────────────
function ChannelBadge({ channel }) {
  return (
    <span
      className="text-label inline-flex items-center gap-1 px-2 py-1 rounded-full"
      style={{
        fontSize: "0.6rem",
        background:
          channel === "whatsapp"
            ? "rgba(37,211,102,0.1)"
            : "rgba(191,26,26,0.08)",
        color: channel === "whatsapp" ? "#16a34a" : "#BF1A1A",
        border: `1px solid ${channel === "whatsapp" ? "rgba(37,211,102,0.25)" : "rgba(191,26,26,0.2)"}`,
      }}
    >
      {channel === "whatsapp" ? <MessageCircle size={9} /> : <Mail size={9} />}
      {channel}
    </span>
  );
}

// ── Single order card ─────────────────────────────────────────────────────────
function OrderCard({ order, index }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="bg-white rounded-2xl border mb-3 overflow-hidden"
      style={{
        borderColor: "var(--color-border)",
        animation: `slideUp 0.35s ease ${index * 70}ms both`,
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Top accent */}
      <div
        style={{
          height: 3,
          background:
            order.status === "complete"
              ? "linear-gradient(90deg,#22c55e,#16a34a)"
              : "linear-gradient(90deg,var(--color-red),var(--color-orange))",
        }}
      />

      {/* Header */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            width: 42,
            height: 42,
            background: "var(--color-bg-soft)",
            color: "var(--color-red)",
          }}
        >
          <ShoppingBag size={17} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="font-heading font-bold text-gray-900"
            style={{ fontSize: "0.85rem", letterSpacing: "0.04em" }}
          >
            #{order._id.slice(-8).toUpperCase()}
          </div>
          <div
            className="text-muted"
            style={{
              fontSize: "0.7rem",
              marginTop: 2,
              fontFamily: "var(--font-body)",
            }}
          >
            {dateStr} · {timeStr}
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            className="font-heading font-bold text-gray-900"
            style={{ fontSize: "1rem" }}
          >
            KSh {order.totalPrice.toLocaleString()}
          </div>
          <div className="flex gap-1 justify-end mt-1 flex-wrap">
            <StatusBadge status={order.status} />
            <ChannelBadge channel={order.channel} />
          </div>
        </div>

        <button
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 30,
            height: 30,
            flexShrink: 0,
            background: "var(--color-bg-soft)",
            border: "1px solid var(--color-border)",
            color: "var(--color-muted)",
            cursor: "pointer",
          }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-5 pb-5">
          <div
            style={{
              height: 1,
              background: "var(--color-border)",
              marginBottom: 16,
            }}
          />

          <div className="text-label text-muted mb-3">Items Ordered</div>
          <div
            className="mb-4"
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--color-red)",
                    flexShrink: 0,
                  }}
                />
                <span className="text-body flex-1" style={{ color: "#374151" }}>
                  {item.title}
                </span>
                <span
                  className="text-muted"
                  style={{ fontSize: "0.7rem", fontWeight: 600 }}
                >
                  ×{item.quantity}
                </span>
                <span
                  className="font-body font-bold text-gray-900"
                  style={{ fontSize: "0.8rem" }}
                >
                  KSh {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="text-label text-muted mb-3">Delivery Info</div>
          <div
            className="mb-4"
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          >
            {[
              { icon: <User size={11} />, val: order.customer.name },
              { icon: <Phone size={11} />, val: order.customer.phone },
              { icon: <MapPin size={11} />, val: order.customer.location },
              ...(order.customer.email
                ? [{ icon: <Mail size={11} />, val: order.customer.email }]
                : []),
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-body"
                style={{ color: "#555" }}
              >
                <span style={{ color: "var(--color-red)" }}>{row.icon}</span>
                {row.val}
              </div>
            ))}
            {order.customer.notes && (
              <div
                className="text-muted"
                style={{ fontSize: "0.75rem", fontStyle: "italic" }}
              >
                "{order.customer.notes}"
              </div>
            )}
          </div>

          <div
            className="flex justify-between items-center pt-3"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <span className="text-label text-muted">Order Total</span>
            <span
              className="font-heading font-bold text-red"
              style={{ fontSize: "1.1rem" }}
            >
              KSh {order.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Not logged in wall ────────────────────────────────────────────────────────
function LoginWall({ navigate }) {
  return (
    <div className="min-h-screen bg-soft flex items-center justify-center p-6">
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: "linear-gradient(135deg,#1a1a1a 0%,#2d0a0a 100%)",
          border: "1px solid rgba(191,26,26,0.25)",
          maxWidth: 400,
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle,rgba(191,26,26,0.18) 0%,transparent 70%)",
            top: -80,
            right: -60,
            pointerEvents: "none",
          }}
        />
        <div
          className="rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{
            width: 56,
            height: 56,
            background: "rgba(191,26,26,0.2)",
            border: "1px solid rgba(191,26,26,0.4)",
            color: "#ff6b6b",
            position: "relative",
          }}
        >
          <LogIn size={24} />
        </div>
        <h2
          className="font-heading font-bold text-white mb-2"
          style={{ fontSize: "1.3rem", position: "relative" }}
        >
          Sign in to view your orders
        </h2>
        <p
          className="text-body mb-6"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.85rem",
            position: "relative",
          }}
        >
          Your order history is saved to your account. Sign in or create a free
          account to access it.
        </p>
        <div
          className="flex gap-3 justify-center flex-wrap"
          style={{ position: "relative" }}
        >
          <button
            className="btn-primary inline-flex items-center gap-2"
            onClick={() => navigate("/auth")}
          >
            Sign In / Sign Up <ArrowRight size={13} />
          </button>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center font-body font-bold text-white"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "0.7rem 1.6rem",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 9999,
              cursor: "pointer",
            }}
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Orders() {
  const navigate = useNavigate();
  const topRef = useRef(null);

  const token = getToken();
  const user = getUser();
  const isLoggedIn = !!token && !!user;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isRefresh = false) => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to load orders.");
      setOrders(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    fetchOrders();
  }, []);

  if (!isLoggedIn) return <LoginWall navigate={navigate} />;

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .oh-spin { animation: spin2 0.8s linear infinite; }
        @keyframes spin2 { to { transform:rotate(360deg); } }
        .oh-shimmer { background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmer2 1.4s infinite; border-radius:10px; }
        @keyframes shimmer2 { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }
        .top-strip { height:3px; background:linear-gradient(90deg,var(--color-red),var(--color-orange),var(--color-red)); background-size:200% 100%; animation:shimmer2 3s linear infinite; }
      `}</style>

      <div ref={topRef} />
      <div className="min-h-screen bg-soft">
        <div className="top-strip" />

        {/* Nav */}
        <div
          className="bg-white sticky top-0 z-40"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="max-w-3xl mx-auto page-x h-14 flex items-center justify-between">
            <span
              className="font-heading font-bold text-gray-900"
              style={{ fontSize: "1rem", letterSpacing: "0.04em" }}
            >
              Order History
            </span>
            <div className="flex items-center gap-3">
              <span
                className="text-label px-3 py-1 rounded-full"
                style={{
                  background: "rgba(191,26,26,0.08)",
                  color: "var(--color-red)",
                }}
              >
                {user.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => fetchOrders(true)}
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 32,
                  height: 32,
                  background: "var(--color-bg-soft)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-muted)",
                  cursor: "pointer",
                }}
                title="Refresh"
              >
                <RefreshCw size={13} className={refreshing ? "oh-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-3xl mx-auto page-x py-8">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <div>
              <div className="text-eyebrow mb-1">{user.email}</div>
              <h1 className="text-section-title text-gray-900">Your Orders</h1>
              <div className="section-rule" />
            </div>
            {!loading && !error && (
              <span
                className="font-heading font-bold text-white px-4 py-2 rounded-full"
                style={{ background: "#1a1a1a", fontSize: "0.8rem" }}
              >
                {orders.length} order{orders.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5"
                  style={{ border: "1px solid var(--color-border)" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="oh-shimmer"
                      style={{ width: 42, height: 42, borderRadius: 12 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        className="oh-shimmer mb-2"
                        style={{ height: 14, width: "40%" }}
                      />
                      <div
                        className="oh-shimmer"
                        style={{ height: 10, width: "25%" }}
                      />
                    </div>
                    <div
                      className="oh-shimmer"
                      style={{ height: 20, width: 80 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div
              className="rounded-2xl p-5 flex items-start gap-4"
              style={{
                background: "rgba(191,26,26,0.05)",
                border: "1px solid rgba(191,26,26,0.2)",
              }}
            >
              <AlertCircle
                size={18}
                style={{
                  color: "var(--color-red)",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              />
              <div>
                <div
                  className="font-body font-bold text-gray-900 mb-1"
                  style={{ fontSize: "0.875rem" }}
                >
                  Couldn't load orders
                </div>
                <div className="text-body">{error}</div>
                <button
                  className="btn-primary mt-3"
                  style={{ padding: "0.5rem 1.2rem" }}
                  onClick={() => fetchOrders()}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-16">
              <div
                className="rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{
                  width: 72,
                  height: 72,
                  background: "white",
                  border: "1px solid var(--color-border)",
                  color: "#ccc",
                }}
              >
                <Package size={28} />
              </div>
              <h2
                className="text-section-title text-gray-900 mb-2"
                style={{ fontSize: "1.2rem" }}
              >
                No orders yet
              </h2>
              <div className="section-rule-center mb-4" />
              <p className="text-body mx-auto mb-6" style={{ maxWidth: 300 }}>
                When you place an order it will appear here.
              </p>
              <button
                className="btn-primary inline-flex items-center gap-2"
                onClick={() => navigate("/products")}
              >
                <ShoppingBag size={14} /> Shop Now
              </button>
            </div>
          )}

          {/* Orders list */}
          {!loading &&
            !error &&
            orders.length > 0 &&
            orders.map((order, i) => (
              <OrderCard key={order._id} order={order} index={i} />
            ))}
        </div>
      </div>
    </>
  );
}
