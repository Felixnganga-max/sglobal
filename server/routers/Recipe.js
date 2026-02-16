const express = require("express");
const router = express.Router();
const { upload } = require("../db/claudinary");
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

// Import auth middleware
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllRecipes);
router.get("/stats", getRecipeStats);
router.get("/product/:productId", getRecipesByProduct);
router.get("/:identifier", getRecipe); // Can use ID or slug

// Protected/Admin routes
router.post(
  "/",

  upload.single("image"),
  createRecipe,
);
router.put(
  "/:id",

  upload.single("image"),
  updateRecipe,
);
router.delete("/:id", deleteRecipe);
router.patch("/:id/featured", toggleFeatured);

module.exports = router;
