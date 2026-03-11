const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "kent-boringer-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

// Delete multiple images at once
const deleteMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
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

// Upload multiple base64 images concurrently
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
  upload,
  deleteImage,
  deleteMultipleImages,
  uploadBase64Image,
  uploadMultipleBase64Images,
};
