const express = require("express");
const router = express.Router();
const { uploadImage } = require("../db/claudinary");
const {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/Blog");
const { protect, authorize } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", getAllBlogs);
router.get("/:identifier", getBlog);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadImage.single("image"),
  createBlog,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadImage.single("image"),
  updateBlog,
);
router.delete("/:id", protect, authorize("admin"), deleteBlog);

module.exports = router;
