const express = require("express");
const router = express.Router();
const {
  createOrder,
  claimGuestOrders,
  getMyOrders,
  getOrdersBySession,
  getSingleOrder,
  markComplete,
  getAllOrders,
} = require("../controllers/orderController");

// ── Import your existing auth middleware ──
// Adjust the path to match your project structure
const { protect } = require("../middleware/auth");

// ── Public ────────────────────────────────────────────────────────────────
// Create order — auth is optional (middleware reads token if present)
router.post("/", optionalAuth, createOrder);

// Guest order lookup by sessionId
router.get("/session/:sessionId", getOrdersBySession);

// ── Authenticated ─────────────────────────────────────────────────────────
// Claim guest orders after signup
router.post("/claim", protect, claimGuestOrders);

// My orders
router.get("/my", protect, getMyOrders);

// Single order (owner or admin)
router.get("/:id", protect, getSingleOrder);

// ── Admin ─────────────────────────────────────────────────────────────────
// All orders
router.get("/", protect, getAllOrders);

// Mark complete
router.patch("/:id/complete", protect, markComplete);

module.exports = router;

// ── optionalAuth middleware ───────────────────────────────────────────────
// Tries to decode the JWT if present, attaches req.user if valid.
// Does NOT block the request if no token is found.
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch (_) {
    // Invalid or expired token — treat as guest, don't block
  }
  next();
}
