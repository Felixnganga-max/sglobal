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
} = require("../controllers/Order");

// ── Import your existing auth middleware ──
// Adjust the path to match your project structure
const { protect, optionalAuth } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────
// Create order — auth is optional (middleware reads token if present)
router.post("/create-order", optionalAuth, createOrder);

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
