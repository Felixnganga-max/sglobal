const express = require("express");
const router = express.Router();
const { uploadImage } = require("../db/claudinary");
const {
  getAllRecipes,
  getRecipe,
  getRecipesByProduct,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFeatured,
  getRecipeStats,
} = require("../controllers/Recipe");
const { protect, authorize } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", getAllRecipes);
router.get("/stats", getRecipeStats);
router.get("/product/:productId", getRecipesByProduct);
router.get("/:identifier", getRecipe);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadImage.single("image"),
  createRecipe,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadImage.single("image"),
  updateRecipe,
);
router.delete("/:id", protect, authorize("admin"), deleteRecipe);
router.patch("/:id/featured", protect, authorize("admin"), toggleFeatured);

module.exports = router;
