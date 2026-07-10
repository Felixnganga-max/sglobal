const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrdersBySession,
  getSingleOrder,
  markComplete,
  getAllOrders,
  getOrderStats,
} = require("../controllers/Order");

const { protect, optionalAuth } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────
// optionalAuth: reads token if present (logged-in users), otherwise passes
// through as guest (controller handles auto-register via email+password)
router.post("/create-order", optionalAuth, createOrder);

// Legacy guest lookup — kept so old sessionId orders are not lost
router.get("/session/:sessionId", getOrdersBySession);

// ── Authenticated ─────────────────────────────────────────────────────────
router.get("/my", protect, getMyOrders);

// ── Admin (registered before "/:id" so "stats" isn't swallowed as an id) ───
router.get("/stats", protect, getOrderStats);
router.get("/", protect, getAllOrders);
router.patch("/:id/complete", protect, markComplete);

router.get("/:id", protect, getSingleOrder);

module.exports = router;
