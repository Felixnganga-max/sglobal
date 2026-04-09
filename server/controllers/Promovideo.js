const PromoVideo = require("../models/Promovideo");
const { deleteVideo, deleteImage, cloudinary } = require("../db/claudinary");

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Derive a Cloudinary thumbnail URL from a video public_id.
 * Cloudinary can generate a poster frame automatically.
 */
const buildAutoThumbnail = (publicId, cloudName) =>
  `https://res.cloudinary.com/${cloudName}/video/upload/so_0/${publicId}.jpg`;

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/promo-videos
 * Upload a new promotional video (multipart/form-data).
 * Fields: title, description?, tags?, isFeatured?, displayOrder?
 * File:   video  (field name: "video")
 */
const createPromoVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Video file is required." });
    }

    const { title, description, tags, isFeatured, displayOrder } = req.body;

    if (!title) {
      // Clean up the uploaded file if validation fails
      await deleteVideo(req.file.filename || req.file.public_id);
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    // req.file is populated by multer-storage-cloudinary
    const videoPublicId = req.file.filename; // cloudinary public_id
    const videoUrl = req.file.path; // secure_url

    // Fetch extra metadata from Cloudinary
    let duration = null;
    let format = null;
    let size = req.file.size || null;

    try {
      const info = await cloudinary.api.resource(videoPublicId, {
        resource_type: "video",
      });
      duration = info.duration || null;
      format = info.format || null;
      size = info.bytes || size;
    } catch (_) {
      // Non-fatal – metadata is optional
    }

    // Auto-generate thumbnail from Cloudinary
    const thumbnailUrl = buildAutoThumbnail(
      videoPublicId,
      process.env.CLOUD_NAME,
    );

    const promoVideo = await PromoVideo.create({
      title,
      description: description || "",
      videoUrl,
      videoPublicId,
      thumbnailUrl,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim())
        : [],
      isFeatured: isFeatured === "true" || isFeatured === true,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
      duration,
      format,
      size,
    });

    return res.status(201).json({
      success: true,
      message: "Promotional video uploaded successfully.",
      data: promoVideo.toPublic(),
    });
  } catch (error) {
    console.error("createPromoVideo error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

/**
 * GET /api/promo-videos
 * Return all active videos (public-facing endpoint).
 * Query: ?featured=true  → only featured videos
 */
const getPromoVideos = async (req, res) => {
  try {
    const { featured } = req.query;

    const videos =
      featured === "true"
        ? await PromoVideo.getFeaturedVideos()
        : await PromoVideo.getActiveVideos();

    return res.status(200).json({
      success: true,
      count: videos.length,
      data: videos.map((v) => v.toPublic()),
    });
  } catch (error) {
    console.error("getPromoVideos error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

/**
 * GET /api/promo-videos/admin
 * Return ALL videos including inactive (admin only).
 * Query: ?page=1&limit=20
 */
const getAllPromoVideosAdmin = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [videos, total] = await Promise.all([
      PromoVideo.find({ isDeleted: false })
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-isDeleted"),
      PromoVideo.countDocuments({ isDeleted: false }),
    ]);

    return res.status(200).json({
      success: true,
      count: videos.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: videos,
    });
  } catch (error) {
    console.error("getAllPromoVideosAdmin error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

/**
 * GET /api/promo-videos/:id
 * Return a single video by ID.
 */
const getPromoVideoById = async (req, res) => {
  try {
    const video = await PromoVideo.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).select("-isDeleted");

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Promotional video not found." });
    }

    return res.status(200).json({ success: true, data: video });
  } catch (error) {
    console.error("getPromoVideoById error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

/**
 * PATCH /api/promo-videos/:id
 * Update metadata (title, description, tags, isActive, isFeatured, displayOrder).
 * Optionally replace the video file or thumbnail.
 * File (optional): "video" field for a new video, "thumbnail" for a new thumbnail.
 */
const updatePromoVideo = async (req, res) => {
  try {
    const video = await PromoVideo.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Promotional video not found." });
    }

    const { title, description, tags, isActive, isFeatured, displayOrder } =
      req.body;

    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (tags !== undefined)
      video.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((t) => t.trim());
    if (isActive !== undefined)
      video.isActive = isActive === "true" || isActive === true;
    if (isFeatured !== undefined)
      video.isFeatured = isFeatured === "true" || isFeatured === true;
    if (displayOrder !== undefined) video.displayOrder = Number(displayOrder);

    // Replace video file if a new one was uploaded
    if (req.file && req.file.fieldname === "video") {
      const oldPublicId = video.videoPublicId;

      video.videoUrl = req.file.path;
      video.videoPublicId = req.file.filename;
      video.thumbnailUrl = buildAutoThumbnail(
        req.file.filename,
        process.env.CLOUD_NAME,
      );
      video.thumbnailPublicId = null;

      // Fetch fresh metadata
      try {
        const info = await cloudinary.api.resource(req.file.filename, {
          resource_type: "video",
        });
        video.duration = info.duration || null;
        video.format = info.format || null;
        video.size = info.bytes || req.file.size || null;
      } catch (_) {}

      // Delete old video (non-fatal)
      if (oldPublicId) {
        deleteVideo(oldPublicId).catch((e) =>
          console.warn("Failed to delete old video:", oldPublicId, e.message),
        );
      }
    }

    await video.save();

    return res.status(200).json({
      success: true,
      message: "Promotional video updated successfully.",
      data: video.toPublic(),
    });
  } catch (error) {
    console.error("updatePromoVideo error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

/**
 * PATCH /api/promo-videos/:id/toggle-active
 * Quickly toggle the isActive flag.
 */
const toggleActive = async (req, res) => {
  try {
    const video = await PromoVideo.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Promotional video not found." });
    }

    video.isActive = !video.isActive;
    await video.save();

    return res.status(200).json({
      success: true,
      message: `Video is now ${video.isActive ? "active" : "inactive"}.`,
      data: { id: video._id, isActive: video.isActive },
    });
  } catch (error) {
    console.error("toggleActive error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

/**
 * PATCH /api/promo-videos/reorder
 * Bulk-update display order.
 * Body: { order: [{ id, displayOrder }, ...] }
 */
const reorderVideos = async (req, res) => {
  try {
    const { order } = req.body;

    if (!Array.isArray(order) || order.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "order array is required." });
    }

    const ops = order.map(({ id, displayOrder }) =>
      PromoVideo.findByIdAndUpdate(id, { displayOrder: Number(displayOrder) }),
    );

    await Promise.all(ops);

    return res
      .status(200)
      .json({ success: true, message: "Display order updated." });
  } catch (error) {
    console.error("reorderVideos error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

/**
 * DELETE /api/promo-videos/:id
 * Soft-delete by default. Pass ?hard=true to permanently remove (also deletes from Cloudinary).
 */
const deletePromoVideo = async (req, res) => {
  try {
    const video = await PromoVideo.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Promotional video not found." });
    }

    const hard = req.query.hard === "true";

    if (hard) {
      // Remove from Cloudinary
      const cleanupTasks = [deleteVideo(video.videoPublicId)];
      if (video.thumbnailPublicId)
        cleanupTasks.push(deleteImage(video.thumbnailPublicId));
      await Promise.allSettled(cleanupTasks);

      await video.deleteOne();
      return res
        .status(200)
        .json({ success: true, message: "Video permanently deleted." });
    }

    // Soft delete
    video.isDeleted = true;
    video.isActive = false;
    await video.save();

    return res
      .status(200)
      .json({ success: true, message: "Video deleted successfully." });
  } catch (error) {
    console.error("deletePromoVideo error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

module.exports = {
  createPromoVideo,
  getPromoVideos,
  getAllPromoVideosAdmin,
  getPromoVideoById,
  updatePromoVideo,
  toggleActive,
  reorderVideos,
  deletePromoVideo,
};
