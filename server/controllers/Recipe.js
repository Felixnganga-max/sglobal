const Recipe = require("../models/Recipe");
const Product = require("../models/productModel");
const { deleteImage, uploadBase64Image } = require("../db/claudinary");

// @desc    Get all recipes with filtering, sorting, and pagination
// @route   GET /api/recipes
// @access  Public
exports.getAllRecipes = async (req, res) => {
  try {
    const {
      category,
      search,
      difficulty,
      featured,
      productId,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category && category !== "all" && category !== "all-recipes") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (productId) {
      filter.product = productId;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Execute query with population
    const recipes = await Recipe.find(filter)
      .populate("product", "title category image price")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Recipe.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: recipes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single recipe by ID or slug
// @route   GET /api/recipes/:identifier
// @access  Public
exports.getRecipe = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Try to find by ID first, then by slug
    let recipe;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      recipe = await Recipe.findById(identifier).populate("product");
    } else {
      recipe = await Recipe.findOne({ slug: identifier }).populate("product");
    }

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Increment views
    recipe.views += 1;
    await recipe.save();

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get recipes by product
// @route   GET /api/recipes/product/:productId
// @access  Public
exports.getRecipesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const recipes = await Recipe.find({
      product: productId,
      isActive: true,
    })
      .populate("product", "title category image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      product: {
        id: product._id,
        title: product.title,
        category: product.category,
      },
      data: recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private/Admin
exports.createRecipe = async (req, res) => {
  try {
    const {
      title,
      slug,
      productId,
      category,
      description,
      prepTime,
      cookTime,
      servings,
      difficulty,
      rating,
      reviews,
      ingredients,
      directions,
      tips,
      tags,
      nutrition,
      featured,
      imageData,
      imageName, // If using existing product image
    } = req.body;

    // Validation
    if (
      !title ||
      !productId ||
      !category ||
      !description ||
      !prepTime ||
      !cookTime ||
      !servings
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one ingredient is required",
      });
    }

    if (!directions || directions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one direction is required",
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let imageInfo;

    // Handle image upload
    if (req.file) {
      // Image uploaded via multipart/form-data
      imageInfo = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    } else if (imageData) {
      // Image uploaded as base64
      imageInfo = await uploadBase64Image(imageData, "kent-boringer-recipes");
    } else if (imageName && product.image) {
      // Use existing product image
      imageInfo = {
        url: product.image.url,
        publicId: product.image.publicId,
      };
    } else {
      return res.status(400).json({
        success: false,
        message: "Recipe image is required",
      });
    }

    // Create recipe
    const recipe = await Recipe.create({
      title,
      slug:
        slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      product: productId,
      category,
      description,
      prepTime: parseInt(prepTime),
      cookTime: parseInt(cookTime),
      servings: parseInt(servings),
      difficulty: difficulty || "Easy",
      rating: rating ? parseFloat(rating) : 0,
      reviews: reviews ? parseInt(reviews) : 0,
      ingredients: Array.isArray(ingredients)
        ? ingredients
        : JSON.parse(ingredients),
      directions: Array.isArray(directions)
        ? directions
        : JSON.parse(directions),
      tips: tips ? (Array.isArray(tips) ? tips : JSON.parse(tips)) : [],
      tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
      nutrition: nutrition || {},
      featured: featured || false,
      image: imageInfo,
    });

    // Populate product info
    await recipe.populate("product", "title category image");

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: recipe,
    });
  } catch (error) {
    // If image was uploaded but recipe creation failed, delete the image
    if (req.file) {
      await deleteImage(req.file.filename);
    }

    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A recipe with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private/Admin
exports.updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    const {
      title,
      slug,
      productId,
      category,
      description,
      prepTime,
      cookTime,
      servings,
      difficulty,
      rating,
      reviews,
      ingredients,
      directions,
      tips,
      tags,
      nutrition,
      featured,
      imageData,
    } = req.body;

    // Verify product if changing
    if (productId && productId !== recipe.product.toString()) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    }

    // Handle image update
    let imageInfo = recipe.image;

    if (req.file) {
      // New image uploaded via multipart/form-data
      // Delete old image only if it's not a product image
      if (!recipe.image.publicId.includes("products")) {
        await deleteImage(recipe.image.publicId);
      }
      imageInfo = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    } else if (imageData) {
      // New image uploaded as base64
      // Delete old image only if it's not a product image
      if (!recipe.image.publicId.includes("products")) {
        await deleteImage(recipe.image.publicId);
      }
      imageInfo = await uploadBase64Image(imageData, "kent-boringer-recipes");
    }

    // Build update object
    const updateData = {
      title: title || recipe.title,
      slug: slug || recipe.slug,
      product: productId || recipe.product,
      category: category || recipe.category,
      description: description || recipe.description,
      prepTime: prepTime !== undefined ? parseInt(prepTime) : recipe.prepTime,
      cookTime: cookTime !== undefined ? parseInt(cookTime) : recipe.cookTime,
      servings: servings !== undefined ? parseInt(servings) : recipe.servings,
      difficulty: difficulty || recipe.difficulty,
      rating: rating !== undefined ? parseFloat(rating) : recipe.rating,
      reviews: reviews !== undefined ? parseInt(reviews) : recipe.reviews,
      ingredients: ingredients
        ? Array.isArray(ingredients)
          ? ingredients
          : JSON.parse(ingredients)
        : recipe.ingredients,
      directions: directions
        ? Array.isArray(directions)
          ? directions
          : JSON.parse(directions)
        : recipe.directions,
      tips: tips
        ? Array.isArray(tips)
          ? tips
          : JSON.parse(tips)
        : recipe.tips,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : JSON.parse(tags)
        : recipe.tags,
      nutrition: nutrition || recipe.nutrition,
      featured: featured !== undefined ? featured : recipe.featured,
      image: imageInfo,
    };

    recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("product", "title category image");

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private/Admin
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Delete image from Cloudinary only if it's not a product image
    if (!recipe.image.publicId.includes("products")) {
      await deleteImage(recipe.image.publicId);
    }

    // Delete recipe
    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
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

// @desc    Toggle featured status
// @route   PATCH /api/recipes/:id/featured
// @access  Private/Admin
exports.toggleFeatured = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    recipe.featured = !recipe.featured;
    await recipe.save();

    res.status(200).json({
      success: true,
      message: `Recipe ${recipe.featured ? "marked as featured" : "unmarked as featured"}`,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get recipe statistics
// @route   GET /api/recipes/stats
// @access  Private/Admin
exports.getRecipeStats = async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments({ isActive: true });
    const featuredRecipes = await Recipe.countDocuments({
      isActive: true,
      featured: true,
    });

    const totalViewsResult = await Recipe.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);
    const totalViews =
      totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;

    const categoryStats = await Recipe.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          totalViews: { $sum: "$views" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const topRecipes = await Recipe.find({ isActive: true })
      .populate("product", "title image")
      .sort({ views: -1 })
      .limit(5)
      .select("title views rating reviews image product");

    const recentRecipes = await Recipe.find({ isActive: true })
      .populate("product", "title image")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt category image product");

    const recipesByProduct = await Recipe.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$product",
          count: { $sum: 1 },
          totalViews: { $sum: "$views" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Populate product details
    await Recipe.populate(recipesByProduct, {
      path: "_id",
      select: "title category image",
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalRecipes,
          featuredRecipes,
          totalViews,
        },
        categoryStats,
        topRecipes,
        recentRecipes,
        recipesByProduct,
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
