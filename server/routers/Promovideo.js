const express = require("express");
const router = express.Router();
const { uploadVideo } = require("../db/claudinary");
const {
  createPromoVideo,
  getPromoVideos,
  getAllPromoVideosAdmin,
  getPromoVideoById,
  updatePromoVideo,
  toggleActive,
  reorderVideos,
  deletePromoVideo,
} = require("../controllers/Promovideo");

// ── Multer error handler ──────────────────────────────────────────────────────
const handleMulterError = (err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File too large. Maximum size is 200MB.",
    });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", getPromoVideos);
router.get("/:id", getPromoVideoById);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get("/admin/all", getAllPromoVideosAdmin);
router.post(
  "/",

  uploadVideo.single("video"),
  handleMulterError,
  createPromoVideo,
);
router.patch("/reorder", reorderVideos);
router.patch("/:id/toggle-active", toggleActive);
router.patch(
  "/:id",

  uploadVideo.single("video"),
  handleMulterError,
  updatePromoVideo,
);
router.delete("/:id", deletePromoVideo);

module.exports = router;
