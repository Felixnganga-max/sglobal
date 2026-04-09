const express = require("express");
const router = express.Router();
const { uploadImage } = require("../db/claudinary");
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
  removeProductImages,
  replaceProductImages,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", getAllProducts);
router.get("/stats", getProductStats);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

// ── Admin — no :id ────────────────────────────────────────────────────────────
router.patch("/bulk-stock", protect, authorize("admin"), bulkUpdateStock);

// ── Admin — single product ────────────────────────────────────────────────────
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadImage.array("images", 10),
  createProduct,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadImage.array("images", 10),
  updateProduct,
);
router.delete("/:id", protect, authorize("admin"), deleteProduct);
router.patch("/:id/deactivate", protect, authorize("admin"), deactivateProduct);
router.patch("/:id/activate", protect, authorize("admin"), activateProduct);

// ── Admin — image management ──────────────────────────────────────────────────
router.delete("/:id/images", protect, authorize("admin"), removeProductImages);
router.put(
  "/:id/images/replace",
  protect,
  authorize("admin"),
  uploadImage.array("images", 10),
  replaceProductImages,
);

module.exports = router;
