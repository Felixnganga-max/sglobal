const Product = require("../models/productModel");
const {
  deleteImage,
  deleteMultipleImages,
  uploadBase64Image,
  uploadMultipleBase64Images,
} = require("../db/claudinary");

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      badge,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category && category !== "all" && category !== "all-products") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (inStock !== undefined) {
      filter.inStock = inStock === "true";
    }

    if (badge) {
      filter.badge = badge;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  let uploadedPublicIds = []; // Track uploads for rollback on failure

  try {
    const {
      title,
      category,
      price,
      oldPrice,
      stock,
      badge,
      isHalal,
      rating,
      reviews,
      shortDescription,
      descriptionBlocks,
      features,
      specifications,
      imageData, // Base64 string or array of base64 strings
    } = req.body;

    // Validation
    if (!title || !category || !price || !stock || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      // Images uploaded via multipart/form-data
      images = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
      uploadedPublicIds = images.map((img) => img.publicId);
    } else if (imageData) {
      // Images uploaded as base64 (single string or array)
      const base64Array = Array.isArray(imageData) ? imageData : [imageData];
      images = await uploadMultipleBase64Images(base64Array);
      uploadedPublicIds = images.map((img) => img.publicId);
    } else {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // Create product
    const product = await Product.create({
      title,
      category,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      stock: parseInt(stock),
      badge: badge || "",
      isHalal: isHalal !== undefined ? isHalal : true,
      rating: rating ? parseFloat(rating) : 0,
      reviews: reviews ? parseInt(reviews) : 0,
      shortDescription,
      descriptionBlocks: descriptionBlocks || [],
      features: features || [],
      specifications: specifications || [],
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // Rollback: delete any uploaded images if product creation failed
    if (uploadedPublicIds.length > 0) {
      await deleteMultipleImages(uploadedPublicIds).catch((err) =>
        console.error("Rollback image delete failed:", err),
      );
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      title,
      category,
      price,
      oldPrice,
      stock,
      badge,
      isHalal,
      rating,
      reviews,
      shortDescription,
      descriptionBlocks,
      features,
      specifications,
      imageData, // Base64 string or array of base64 strings
    } = req.body;

    // Default to existing images unless new ones are provided
    let images = product.images;

    if (req.files && req.files.length > 0) {
      // Delete all old images from Cloudinary
      await deleteMultipleImages(product.images.map((img) => img.publicId));
      images = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
    } else if (imageData) {
      // Delete all old images from Cloudinary
      await deleteMultipleImages(product.images.map((img) => img.publicId));
      const base64Array = Array.isArray(imageData) ? imageData : [imageData];
      images = await uploadMultipleBase64Images(base64Array);
    }

    // Build update object
    const updateData = {
      title: title || product.title,
      category: category || product.category,
      price: price !== undefined ? parseFloat(price) : product.price,
      oldPrice:
        oldPrice !== undefined
          ? oldPrice
            ? parseFloat(oldPrice)
            : null
          : product.oldPrice,
      stock: stock !== undefined ? parseInt(stock) : product.stock,
      badge: badge !== undefined ? badge : product.badge,
      isHalal: isHalal !== undefined ? isHalal : product.isHalal,
      rating: rating !== undefined ? parseFloat(rating) : product.rating,
      reviews: reviews !== undefined ? parseInt(reviews) : product.reviews,
      shortDescription: shortDescription || product.shortDescription,
      descriptionBlocks: descriptionBlocks || product.descriptionBlocks,
      features: features || product.features,
      specifications: specifications || product.specifications,
      images,
    };

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete all images from Cloudinary
    await deleteMultipleImages(product.images.map((img) => img.publicId));

    // Delete product
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Soft delete product (set isActive to false)
// @route   PATCH /api/products/:id/deactivate
// @access  Private/Admin
exports.deactivateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Reactivate product
// @route   PATCH /api/products/:id/activate
// @access  Private/Admin
exports.activateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product activated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private/Admin
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const inStockProducts = await Product.countDocuments({
      isActive: true,
      inStock: true,
    });
    const outOfStockProducts = await Product.countDocuments({
      isActive: true,
      inStock: false,
    });

    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const topRatedProducts = await Product.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(5)
      .select("title rating reviews images");

    const lowStockProducts = await Product.find({
      isActive: true,
      stock: { $lt: 10, $gt: 0 },
    })
      .sort({ stock: 1 })
      .limit(10)
      .select("title stock category");

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProducts,
          inStockProducts,
          outOfStockProducts,
        },
        categoryStats,
        topRatedProducts,
        lowStockProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Bulk update stock
// @route   PATCH /api/products/bulk-stock
// @access  Private/Admin
exports.bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { productId, stock }

    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: "Updates must be an array",
      });
    }

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.productId },
        update: { stock: parseInt(update.stock) },
      },
    }));

    const result = await Product.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 12, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find({
      category,
      isActive: true,
    })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ category, isActive: true });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
