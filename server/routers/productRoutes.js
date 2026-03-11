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

// Public routes
router.get("/", getAllProducts);
router.get("/stats", getProductStats);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

// Protected/Admin routes
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
router.patch("/bulk-stock", protect, authorize("admin"), bulkUpdateStock);

module.exports = router;
