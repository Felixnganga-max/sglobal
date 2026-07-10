const express = require("express");
const router = express.Router();
const { uploadImage } = require("../db/claudinary");
const {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
} = require("../controllers/Blog");
const {
  getComments,
  createComment,
  deleteComment,
} = require("../controllers/Comment");
const { protect, authorize } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", getAllBlogs);
router.get("/:blogId/comments", getComments);
router.post("/:blogId/comments", createComment);
router.patch("/:id/like", likeBlog);
router.patch("/:id/dislike", dislikeBlog);
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
router.delete(
  "/comments/:commentId",
  protect,
  authorize("admin"),
  deleteComment,
);

module.exports = router;
