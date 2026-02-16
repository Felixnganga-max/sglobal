const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [
        true,
        "Product is required - each recipe must be linked to a product",
      ],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Breakfast",
        "Soups",
        "Desserts",
        "Snacks",
        "Main Course",
        "Appetizers",
        "Beverages",
      ],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    image: {
      url: {
        type: String,
        required: [true, "Recipe image is required"],
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    prepTime: {
      type: Number,
      required: [true, "Prep time is required"],
      min: [0, "Prep time cannot be negative"],
    },
    cookTime: {
      type: Number,
      required: [true, "Cook time is required"],
      min: [0, "Cook time cannot be negative"],
    },
    totalTime: {
      type: Number,
    },
    servings: {
      type: Number,
      required: [true, "Servings is required"],
      min: [1, "Servings must be at least 1"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    reviews: {
      type: Number,
      min: [0, "Reviews cannot be negative"],
      default: 0,
    },
    ingredients: {
      type: [String],
      required: [true, "At least one ingredient is required"],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Recipe must have at least one ingredient",
      },
    },
    directions: {
      type: [String],
      required: [true, "At least one direction is required"],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Recipe must have at least one direction",
      },
    },
    tips: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    nutrition: {
      calories: {
        type: String,
        default: "",
      },
      protein: {
        type: String,
        default: "",
      },
      carbs: {
        type: String,
        default: "",
      },
      fat: {
        type: String,
        default: "",
      },
      fiber: {
        type: String,
        default: "",
      },
    },
    author: {
      name: {
        type: String,
        default: "Smart Global Team",
      },
      avatar: {
        type: String,
        default: "SG",
      },
      bio: {
        type: String,
        default: "Professional chefs and food developers",
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Auto-calculate total time before saving
recipeSchema.pre("save", function (next) {
  this.totalTime = this.prepTime + this.cookTime;
  next();
});

// Auto-generate slug if not provided
recipeSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

// Indexes for better query performance
recipeSchema.index({ product: 1 });
recipeSchema.index({ category: 1 });
recipeSchema.index({ featured: 1 });
recipeSchema.index({ slug: 1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ title: "text", description: "text", tags: "text" });

// Virtual for formatted total time
recipeSchema.virtual("totalTimeFormatted").get(function () {
  return `${this.totalTime} min`;
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
