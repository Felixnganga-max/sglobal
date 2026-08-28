const express = require("express");
const router = express.Router();
const {
  logActivity,
  getActivityLogs,
  getActivityStats,
} = require("../controllers/Activity");
const { protect, authorize } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────
router.post("/", logActivity);

// ── Admin ─────────────────────────────────────────────────────────────────
router.get("/stats", protect, authorize("admin"), getActivityStats);
router.get("/", protect, authorize("admin"), getActivityLogs);

module.exports = router;
