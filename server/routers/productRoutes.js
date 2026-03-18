const express = require("express");
const router = express.Router();
const { upload } = require("../db/claudinary");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deactivateProduct,
  activateProduct,
  getProductStats,
  bulkUpdateStock,
  getProductsByCategory,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
// Static routes MUST come before /:id wildcard routes
router.get("/", getAllProducts);
router.get("/stats", getProductStats); // /stats before /:id
router.get("/category/:category", getProductsByCategory); // /category/:x before /:id
router.get("/:id", getProductById); // wildcard last

// ── Admin — bulk (no :id) ─────────────────────────────────────────────────────
// /bulk-stock must come before /:id/... routes
router.patch("/bulk-stock", protect, authorize("admin"), bulkUpdateStock);

// ── Admin — single product ────────────────────────────────────────────────────
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 10),
  createProduct,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.array("images", 10),
  updateProduct,
);
router.delete("/:id", protect, authorize("admin"), deleteProduct);
router.patch("/:id/deactivate", protect, authorize("admin"), deactivateProduct);
router.patch("/:id/activate", protect, authorize("admin"), activateProduct);

module.exports = router;
