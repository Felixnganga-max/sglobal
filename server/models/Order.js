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
    quantity: { type: Number, required: true, min: 1 },
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

    // ── Guest session token — used to claim orders after signup ──
    sessionId: {
      type: String,
      default: null,
      index: true,
    },

    // ── Customer details (filled from the form) ──
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      location: { type: String, required: true, trim: true },
      notes: { type: String, default: "" },
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
    totalPrice: { type: Number, required: true, min: 0 },

    // ── How they sent the order ──
    channel: {
      type: String,
      enum: ["whatsapp", "email"],
      required: true,
    },

    // ── Status — only the team can flip to complete ──
    status: {
      type: String,
      enum: ["pending", "complete"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ sessionId: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
