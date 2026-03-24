const express = require("express");
const router = express.Router();
const {
  getAllZones,
  getAllZonesAdmin,
  getZoneById,
  createZone,
  updateZone,
  toggleZone,
  deleteZone,
} = require("../controllers/zone");

// ── Public ────────────────────────────────────────────────────
router.get("/", getAllZones); // active zones for PlaceOrder dropdown

// ── Admin ─────────────────────────────────────────────────────
router.get("/admin/all", getAllZonesAdmin);
router.get("/:id", getZoneById);
router.post("/", createZone);
router.put("/:id", updateZone);
router.patch("/:id/toggle", toggleZone);
router.delete("/:id", deleteZone);

module.exports = router;
