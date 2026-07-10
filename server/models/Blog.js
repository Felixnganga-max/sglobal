const mongoose = require("mongoose");

const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["heading", "subheading", "paragraph", "image"],
      required: true,
    },
    text: { type: String },
    src: { type: String },
    alt: { type: String },
  },
  { _id: false },
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Product Guides",
        "Recipe Ideas",
        "Nutrition & Health",
        "Family Cooking",
        "Quality Standards",
        "Shopping Tips",
      ],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: {
      type: [contentBlockSchema],
      required: [true, "At least one content block is required"],
      validate: {
        validator: (v) => v && v.length > 0,
        message: "Blog must have content",
      },
    },
    featuredImage: {
      url: {
        type: String,
        required: [true, "Featured image is required"],
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    author: {
      name: { type: String, default: "Smart Global Team" },
      role: { type: String, default: "FMCG Product Specialists" },
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    published: {
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

blogSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

blogSchema.index({ category: 1 });
blogSchema.index({ published: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ title: "text", excerpt: "text", tags: "text" });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
