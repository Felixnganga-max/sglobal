const Order = require("../models/Order");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ─────────────────────────────────────────────
//  Internal helper — sign a JWT
// ─────────────────────────────────────────────
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// ─────────────────────────────────────────────
//  Build a safe user payload — always includes both id and _id
//  so the frontend never gets confused regardless of which field it reads
// ─────────────────────────────────────────────
function buildUserPayload(user) {
  return {
    _id: user._id,
    id: user._id, // include both so frontend works however it accesses it
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// ─────────────────────────────────────────────
//  POST /orders/create-order
//
//  Flow:
//   A) Already logged in (optionalAuth set req.user) → place order directly
//   B) Not logged in → email + password required in body
//        • New email    → auto-register + login + place order
//        • Email exists + password matches → login + place order
//        • Email exists + wrong password   → 401 with clear message
// ─────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      deliveryZone,
      subtotal,
      deliveryFee,
      totalPrice,
      channel,
      password,
    } = req.body;

    // ── Validation ───────────────────────────
    if (!customer?.name || !customer?.phone || !customer?.location) {
      return res.status(400).json({
        success: false,
        message: "Customer name, phone, and location are required.",
      });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item.",
      });
    }
    if (!["whatsapp", "email"].includes(channel)) {
      return res.status(400).json({
        success: false,
        message: "Channel must be 'whatsapp' or 'email'.",
      });
    }

    // Normalise email
    const email = customer.email?.toLowerCase().trim() || null;
    if (customer.email) customer.email = email;

    // ── Resolve user ─────────────────────────
    let userId = null;
    let autoAuthPayload = null;

    if (req.user) {
      // PATH A — already authenticated via token
      userId = req.user._id;
    } else {
      // PATH B — guest checkout, must supply email + password
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Please provide your email address to place an order.",
        });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a password (min 6 characters) to save your order history.",
        });
      }

      const existing = await User.findOne({ email }).select("+password");

      if (existing) {
        // Email already registered — validate password
        const passwordMatch = await bcrypt.compare(password, existing.password);
        if (!passwordMatch) {
          return res.status(401).json({
            success: false,
            // Clear, actionable message so the user knows exactly what to do
            message:
              "This email is already registered and the password is incorrect. Please use your correct password, or sign in from the login page.",
          });
        }
        // Correct password — log them in silently
        userId = existing._id;
        autoAuthPayload = {
          token: signToken(existing._id),
          user: buildUserPayload(existing),
        };
      } else {
        // Brand new customer — auto-register silently
        const hashed = await bcrypt.hash(password, 12);
        const newUser = await User.create({
          name: customer.name,
          email,
          password: hashed,
          role: "user",
        });
        userId = newUser._id;
        autoAuthPayload = {
          token: signToken(newUser._id),
          user: buildUserPayload(newUser),
        };
      }
    }

    // ── Create the order ─────────────────────
    const order = await Order.create({
      customer,
      items,
      deliveryZone,
      subtotal,
      deliveryFee,
      totalPrice,
      channel,
      sessionId: null,
      user: userId,
    });

    // ── Respond ──────────────────────────────
    return res.status(201).json({
      success: true,
      message: autoAuthPayload
        ? "Account ready and order placed successfully!"
        : "Order placed successfully.",
      data: order,
      ...(autoAuthPayload && {
        token: autoAuthPayload.token,
        user: autoAuthPayload.user,
      }),
    });
  } catch (err) {
    console.error("createOrder error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

// ─────────────────────────────────────────────
//  GET /orders/my  — requires login
// ─────────────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    console.error("getMyOrders error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
//  GET /orders/session/:sessionId  — legacy guest data
// ─────────────────────────────────────────────
exports.getOrdersBySession = async (req, res) => {
  try {
    const orders = await Order.find({ sessionId: req.params.sessionId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    console.error("getOrdersBySession error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
//  GET /orders/:id  — owner or admin
// ─────────────────────────────────────────────
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    const isAdmin = req.user?.role === "admin";
    const isOwner =
      order.user &&
      req.user &&
      order.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized." });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    console.error("getSingleOrder error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
//  PATCH /orders/:id/complete  — admin only
// ─────────────────────────────────────────────
exports.markComplete = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only." });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "complete" },
      { new: true },
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    res.json({
      success: true,
      message: "Order marked as complete.",
      data: order,
    });
  } catch (err) {
    console.error("markComplete error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
//  GET /orders  — admin: all orders with pagination
// ─────────────────────────────────────────────
exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only." });
    }
    const { status, page = 1, limit = 50 } = req.query;
    const filter = status ? { status } : {};

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.json({ success: true, total, page: Number(page), data: orders });
  } catch (err) {
    console.error("getAllOrders error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
