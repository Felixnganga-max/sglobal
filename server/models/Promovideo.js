const mongoose = require("mongoose");

const promoVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    // Cloudinary video
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    videoPublicId: {
      type: String,
      required: [true, "Video public ID is required"],
    },

    // Optional thumbnail (auto-generated or manually uploaded)
    thumbnailUrl: {
      type: String,
      default: null,
    },
    thumbnailPublicId: {
      type: String,
      default: null,
    },

    // Display settings
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },

    // Optional categorisation
    tags: {
      type: [String],
      default: [],
    },

    // Video metadata (populated from Cloudinary response)
    duration: {
      type: Number, // seconds
      default: null,
    },
    format: {
      type: String,
      default: null,
    },
    size: {
      type: Number, // bytes
      default: null,
    },

    // Soft-delete
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// ─── Indexes ────────────────────────────────────────────────────────────────
promoVideoSchema.index({ isActive: 1, displayOrder: 1 });
promoVideoSchema.index({ isFeatured: 1 });
promoVideoSchema.index({ tags: 1 });
promoVideoSchema.index({ isDeleted: 1 });

// ─── Instance Methods ────────────────────────────────────────────────────────

/**
 * Returns a safe public-facing object (strips internal fields).
 */
promoVideoSchema.methods.toPublic = function () {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    videoUrl: this.videoUrl,
    thumbnailUrl: this.thumbnailUrl,
    isActive: this.isActive,
    isFeatured: this.isFeatured,
    displayOrder: this.displayOrder,
    tags: this.tags,
    duration: this.duration,
    format: this.format,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// ─── Static Methods ───────────────────────────────────────────────────────

/**
 * Fetch all active, non-deleted videos sorted by displayOrder then newest.
 */
promoVideoSchema.statics.getActiveVideos = function () {
  return this.find({ isActive: true, isDeleted: false })
    .sort({ displayOrder: 1, createdAt: -1 })
    .select("-isDeleted");
};

/**
 * Fetch featured videos only.
 */
promoVideoSchema.statics.getFeaturedVideos = function () {
  return this.find({ isFeatured: true, isActive: true, isDeleted: false })
    .sort({ displayOrder: 1, createdAt: -1 })
    .select("-isDeleted");
};

const PromoVideo = mongoose.model("PromoVideo", promoVideoSchema);

module.exports = PromoVideo;
