const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ─── Image Storage (existing) ───────────────────────────────────────────────
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "kent-boringer-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// ─── Video Storage ────────────────────────────────────────────────────────
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "kent-boringer-promo-videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi", "mkv", "webm"],
    transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    // Preserve original filename (sanitised)
    public_id: `promo_${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_")}`,
  }),
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed!"), false);
    }
    cb(null, true);
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────

const deleteImage = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

const deleteMultipleImages = async (publicIds) => {
  try {
    return await cloudinary.api.delete_resources(publicIds);
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
    throw error;
  }
};

/**
 * Delete a single video from Cloudinary.
 * @param {string} publicId - Cloudinary public_id of the video
 */
const deleteVideo = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
  } catch (error) {
    console.error("Error deleting video from Cloudinary:", error);
    throw error;
  }
};

/**
 * Delete multiple videos from Cloudinary.
 * @param {string[]} publicIds
 */
const deleteMultipleVideos = async (publicIds) => {
  try {
    return await cloudinary.api.delete_resources(publicIds, {
      resource_type: "video",
    });
  } catch (error) {
    console.error("Error deleting videos from Cloudinary:", error);
    throw error;
  }
};

const uploadBase64Image = async (
  base64String,
  folder = "kent-boringer-products",
) => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder,
      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { quality: "auto" },
      ],
    });
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error("Error uploading base64 image to Cloudinary:", error);
    throw error;
  }
};

const uploadMultipleBase64Images = async (
  base64Array,
  folder = "kent-boringer-products",
) => {
  try {
    const uploads = base64Array.map((base64String) =>
      cloudinary.uploader.upload(base64String, {
        folder,
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" },
        ],
      }),
    );
    const results = await Promise.all(uploads);
    return results.map((r) => ({ url: r.secure_url, publicId: r.public_id }));
  } catch (error) {
    console.error("Error uploading multiple base64 images:", error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadVideo,
  deleteImage,
  deleteMultipleImages,
  deleteVideo,
  deleteMultipleVideos,
  uploadBase64Image,
  uploadMultipleBase64Images,
};
