const mongoose = require("mongoose");

const descriptionBlockSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["paragraph", "heading", "bullet-list", "ordered-list"],
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false },
);

const specificationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Craft cooked potato chips",
        "Just fruits",
        "Hum Hum",
        "Cakemix",
        "Brownie & Pancake",
        "Whipped creams",
        "Boringer topping sauces",
        "Kent soups",
        "Kent stocks",
        "Kent syrups",
        "Kent sauces",
        "Kent spreads",
        "Kizembe spring water",
      ],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    oldPrice: {
      type: Number,
      min: [0, "Old price cannot be negative"],
      default: null,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    badge: {
      type: String,
      enum: ["SPECIAL OFFER", "HOT DEALS", "LIMITED OFFER", ""],
      default: "",
    },
    isHalal: {
      type: Boolean,
      default: true,
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
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    descriptionBlocks: {
      type: [descriptionBlockSchema],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    specifications: {
      type: [specificationSchema],
      default: [],
    },

    // Images — optional, 0 to 10 allowed
    images: {
      type: [imageSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "A product cannot have more than 10 images",
      },
    },

    inStock: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
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

// Virtual — calculated discount percentage
productSchema.virtual("calculatedDiscount").get(function () {
  if (this.price && this.oldPrice && this.oldPrice > this.price) {
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  }
  return null;
});

// Pre-save — sync inStock and discount
productSchema.pre("save", function (next) {
  this.inStock = this.stock > 0;

  if (this.oldPrice && this.oldPrice > this.price) {
    this.discount = Math.round(
      ((this.oldPrice - this.price) / this.oldPrice) * 100,
    );
  } else {
    this.discount = null;
  }

  next();
});

// Pre-findOneAndUpdate — sync inStock when updating via findByIdAndUpdate
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.stock !== undefined) {
    update.inStock = update.stock > 0;
  }
  next();
});

// Indexes
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ inStock: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ title: "text", shortDescription: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
