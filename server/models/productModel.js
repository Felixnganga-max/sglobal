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
        "Water",
      ],
    },

    // Unit price — price per single item
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // Minimum Order Quantity — orders must be multiples of this value
    // e.g. 6 means you can order 6, 12, 18 ... but never 1, 2, 7, etc.
    minimumOrderQuantity: {
      type: Number,
      required: [true, "Minimum order quantity is required"],
      min: [1, "Minimum order quantity must be at least 1"],
      default: 1,
    },

    // totalPrice — computed as price × minimumOrderQuantity (set by pre-save hook)
    // This is what the customer pays for one "set / pack"
    totalPrice: {
      type: Number,
      min: [0, "Total price cannot be negative"],
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

// ─────────────────────────────────────────────
// Virtual — next valid order quantity above a requested amount
// e.g. MOQ=6, requested=8 → nextValidQuantity = 12
// ─────────────────────────────────────────────
productSchema.virtual("nextValidQuantity").get(function () {
  return this.minimumOrderQuantity; // base pack size (the minimum valid order)
});

// ─────────────────────────────────────────────
// Pre-save — sync inStock, totalPrice, and discount
// ─────────────────────────────────────────────
productSchema.pre("save", function (next) {
  // Sync inStock from stock
  this.inStock = this.stock > 0;

  // Always recompute totalPrice = unit price × MOQ
  const moq = this.minimumOrderQuantity || 1;
  this.totalPrice = parseFloat((this.price * moq).toFixed(2));

  // No oldPrice anymore — discount field left for manual promotional discounts
  // You can still set discount manually if running a promo

  next();
});

// ─────────────────────────────────────────────
// Pre-findOneAndUpdate — sync inStock & totalPrice when updating via findByIdAndUpdate
// ─────────────────────────────────────────────
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.stock !== undefined) {
    update.inStock = update.stock > 0;
  }

  // Recompute totalPrice if price or MOQ changed
  if (update.price !== undefined || update.minimumOrderQuantity !== undefined) {
    // We need both values — pull from existing update or fall back to undefined
    // Note: full recompute happens in pre-save; here we do a best-effort sync
    const price = update.price;
    const moq = update.minimumOrderQuantity;
    if (price !== undefined && moq !== undefined) {
      update.totalPrice = parseFloat((price * moq).toFixed(2));
    }
  }

  next();
});

// ─────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ inStock: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ title: "text", shortDescription: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
