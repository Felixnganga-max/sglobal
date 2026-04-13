const Product = require("../models/productModel");
const {
  deleteMultipleImages,
  uploadMultipleBase64Images,
} = require("../db/claudinary");

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const resolveImages = async (req) => {
  if (req.files && req.files.length > 0) {
    return req.files.map((f) => ({ url: f.path, publicId: f.filename }));
  }
  if (req.body.imageData) {
    const base64Array = Array.isArray(req.body.imageData)
      ? req.body.imageData
      : [req.body.imageData];
    return await uploadMultipleBase64Images(base64Array);
  }
  return [];
};

const safeDeleteImages = async (images = []) => {
  const publicIds = images.map((img) => img.publicId).filter(Boolean);
  if (!publicIds.length) return;
  await deleteMultipleImages(publicIds).catch((err) =>
    console.error("Cloudinary delete failed:", err),
  );
};

/**
 * Given a desired quantity and a product's MOQ, returns the smallest
 * valid order quantity that is >= desiredQty and a multiple of MOQ.
 *
 * Examples (MOQ = 6):
 *   resolveOrderQuantity(6,  6) → 6
 *   resolveOrderQuantity(8,  6) → 12
 *   resolveOrderQuantity(12, 6) → 12
 *   resolveOrderQuantity(1,  6) → 6
 */
const resolveOrderQuantity = (desiredQty, moq) => {
  if (desiredQty <= moq) return moq;
  return Math.ceil(desiredQty / moq) * moq;
};

// ─────────────────────────────────────────────
// @desc    Get all products
// @route   GET /api/products
// @access  Public
// ─────────────────────────────────────────────
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
    if (inStock !== undefined) filter.inStock = inStock === "true";
    if (badge) filter.badge = badge;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: order === "asc" ? 1 : -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
// ─────────────────────────────────────────────
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    product.views += 1;
    await product.save();
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
// ─────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  let uploadedImages = [];
  try {
    const {
      title,
      category,
      price,
      minimumOrderQuantity, // NEW — required field
      stock,
      badge,
      isHalal,
      rating,
      reviews,
      shortDescription,
      descriptionBlocks,
      features,
      specifications,
      discount,
    } = req.body;

    if (
      !title ||
      !category ||
      !price ||
      stock === undefined ||
      !shortDescription ||
      !minimumOrderQuantity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required: title, category, price, minimumOrderQuantity, stock, shortDescription",
      });
    }

    const moq = parseInt(minimumOrderQuantity);
    if (moq < 1) {
      return res.status(400).json({
        success: false,
        message: "minimumOrderQuantity must be at least 1",
      });
    }

    uploadedImages = await resolveImages(req);

    // totalPrice is auto-computed by the pre-save hook (price × MOQ)
    const product = await Product.create({
      title,
      category,
      price: parseFloat(price),
      minimumOrderQuantity: moq,
      // totalPrice computed by hook — no need to pass it
      stock: parseInt(stock),
      badge: badge || "",
      isHalal: isHalal !== undefined ? isHalal : true,
      rating: rating ? parseFloat(rating) : 0,
      reviews: reviews ? parseInt(reviews) : 0,
      shortDescription,
      descriptionBlocks: descriptionBlocks || [],
      features: features || [],
      specifications: specifications || [],
      images: uploadedImages,
      discount: discount ? parseFloat(discount) : null,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    await safeDeleteImages(uploadedImages);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Update product — APPENDS images, never replaces
// @route   PUT /api/products/:id
// @access  Private/Admin
// ─────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const {
      title,
      category,
      price,
      minimumOrderQuantity,
      stock,
      badge,
      isHalal,
      rating,
      reviews,
      shortDescription,
      descriptionBlocks,
      features,
      specifications,
      discount,
    } = req.body;

    // Validate MOQ if provided
    if (minimumOrderQuantity !== undefined) {
      const moq = parseInt(minimumOrderQuantity);
      if (moq < 1) {
        return res.status(400).json({
          success: false,
          message: "minimumOrderQuantity must be at least 1",
        });
      }
    }

    // Resolve any newly uploaded images
    const newImages = await resolveImages(req);

    // APPEND new images to existing ones — never replace
    const mergedImages = [...product.images, ...newImages];

    if (mergedImages.length > 10) {
      await safeDeleteImages(newImages);
      return res.status(400).json({
        success: false,
        message: `Cannot exceed 10 images. Product already has ${product.images.length}. Remove some first.`,
      });
    }

    const updatedPrice =
      price !== undefined ? parseFloat(price) : product.price;
    const updatedMoq =
      minimumOrderQuantity !== undefined
        ? parseInt(minimumOrderQuantity)
        : product.minimumOrderQuantity;

    // Recompute totalPrice whenever price or MOQ changes
    const updatedTotalPrice = parseFloat(
      (updatedPrice * updatedMoq).toFixed(2),
    );

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title: title ?? product.title,
        category: category ?? product.category,
        price: updatedPrice,
        minimumOrderQuantity: updatedMoq,
        totalPrice: updatedTotalPrice,
        stock: stock !== undefined ? parseInt(stock) : product.stock,
        badge: badge !== undefined ? badge : product.badge,
        isHalal: isHalal !== undefined ? isHalal : product.isHalal,
        rating: rating !== undefined ? parseFloat(rating) : product.rating,
        reviews: reviews !== undefined ? parseInt(reviews) : product.reviews,
        shortDescription: shortDescription ?? product.shortDescription,
        descriptionBlocks: descriptionBlocks ?? product.descriptionBlocks,
        features: features ?? product.features,
        specifications: specifications ?? product.specifications,
        images: mergedImages,
        discount:
          discount !== undefined
            ? discount
              ? parseFloat(discount)
              : null
            : product.discount,
      },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Validate and resolve a requested quantity to a valid MOQ multiple
// @route   POST /api/products/:id/resolve-quantity
// @body    { requestedQty: Number }
// @access  Public
//
// Use this on the frontend before adding to cart.
// Returns the adjusted quantity and the price for that quantity.
// ─────────────────────────────────────────────
exports.resolveQuantity = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const { requestedQty } = req.body;
    const qty = parseInt(requestedQty);

    if (!qty || qty < 1) {
      return res
        .status(400)
        .json({ success: false, message: "requestedQty must be at least 1" });
    }

    const resolvedQty = resolveOrderQuantity(qty, product.minimumOrderQuantity);
    const resolvedPrice = parseFloat((resolvedQty * product.price).toFixed(2));

    res.status(200).json({
      success: true,
      data: {
        requestedQty: qty,
        resolvedQty,
        minimumOrderQuantity: product.minimumOrderQuantity,
        unitPrice: product.price,
        totalPrice: resolvedPrice,
        wasAdjusted: resolvedQty !== qty,
        adjustmentMessage:
          resolvedQty !== qty
            ? `Quantity adjusted from ${qty} to ${resolvedQty} (must be a multiple of ${product.minimumOrderQuantity})`
            : null,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Remove specific images from a product
// @route   DELETE /api/products/:id/images
// @body    { publicIds: ["cloudinary_public_id_1", ...] }
// @access  Private/Admin
// ─────────────────────────────────────────────
exports.removeProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const { publicIds } = req.body;
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "publicIds array is required" });
    }

    const toRemove = product.images.filter((img) =>
      publicIds.includes(img.publicId),
    );
    const remaining = product.images.filter(
      (img) => !publicIds.includes(img.publicId),
    );

    await safeDeleteImages(toRemove);

    product.images = remaining;
    await product.save();

    res.status(200).json({
      success: true,
      message: `${toRemove.length} image(s) removed`,
      data: product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Replace ALL images on a product
// @route   PUT /api/products/:id/images/replace
// @access  Private/Admin
// ─────────────────────────────────────────────
exports.replaceProductImages = async (req, res) => {
  let newImages = [];
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    newImages = await resolveImages(req);
    if (newImages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images provided" });
    }

    await safeDeleteImages(product.images);

    product.images = newImages;
    await product.save();

    res
      .status(200)
      .json({ success: true, message: "Images replaced", data: product });
  } catch (error) {
    await safeDeleteImages(newImages);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete product (hard delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
// ─────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    await safeDeleteImages(product.images);
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: {},
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Soft delete
// @route   PATCH /api/products/:id/deactivate
// @access  Private/Admin
// ─────────────────────────────────────────────
exports.deactivateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res
      .status(200)
      .json({ success: true, message: "Product deactivated", data: product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Reactivate product
// @route   PATCH /api/products/:id/activate
// @access  Private/Admin
// ─────────────────────────────────────────────
exports.activateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true },
    );
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res
      .status(200)
      .json({ success: true, message: "Product activated", data: product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Product statistics
// @route   GET /api/products/stats
// @access  Private/Admin
// ─────────────────────────────────────────────
exports.getProductStats = async (req, res) => {
  try {
    const [
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      categoryStats,
      topRatedProducts,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, inStock: true }),
      Product.countDocuments({ isActive: true, inStock: false }),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
          },
        },
        { $sort: { count: -1 } },
      ]),
      Product.find({ isActive: true })
        .sort({ rating: -1 })
        .limit(5)
        .select("title rating reviews images"),
      Product.find({ isActive: true, stock: { $lt: 10, $gt: 0 } })
        .sort({ stock: 1 })
        .limit(10)
        .select("title stock category"),
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: { totalProducts, inStockProducts, outOfStockProducts },
        categoryStats,
        topRatedProducts,
        lowStockProducts,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Bulk update stock
// @route   PATCH /api/products/bulk-stock
// @access  Private/Admin
// ─────────────────────────────────────────────
exports.bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Updates must be a non-empty array" });
    }
    const bulkOps = updates.map(({ productId, stock }) => ({
      updateOne: {
        filter: { _id: productId },
        update: { stock: parseInt(stock), inStock: parseInt(stock) > 0 },
      },
    }));
    const result = await Product.bulkWrite(bulkOps);
    res.status(200).json({
      success: true,
      message: "Stock updated",
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
// ─────────────────────────────────────────────
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 12, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      Product.find({ category, isActive: true })
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Product.countDocuments({ category, isActive: true }),
    ]);
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
