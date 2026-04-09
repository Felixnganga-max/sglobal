const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required:  true, min: 1 },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    // ── Linked to a registered user (null if guest) ──
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Guest session token ──
    sessionId: {
      type: String,
      default: null,
    },

    // ── Customer details ──
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      location: { type: String, required: true, trim: true },
      notes: { type: String, default: "" },
      // ✅ NEW — allows email-based order lookup without an account
      email: { type: String, default: null, trim: true, lowercase: true },
    },

    // ── Order items ──
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => v && v.length > 0,
        message: "Order must have at least one item",
      },
    },

    // ── Totals ──
    subtotal: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    deliveryZone: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", default: null },
      name: { type: String, default: "" },
      location: { type: String, default: "" },
      fee: { type: Number, default: 0 },
    },
    totalPrice: { type: Number, required: true, min: 0 },

    // ── How they sent the order ──
    channel: {
      type: String,
      enum: ["whatsapp", "email"],
      required: true,
    },

    // ── Status ──
    status: {
      type: String,
      enum: ["pending", "complete"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// ── Indexes ───────────────────────────────────────────────────────────────────
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ sessionId: 1 });
orderSchema.index({ "customer.email": 1 }); // ✅ NEW — fast email lookups
orderSchema.index({ status: 1 });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
