const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    // Persistent per-browser identifier (generated client-side, stored in
    // localStorage) — lets us group a visitor's actions without accounts.
    anonId: {
      type: String,
      required: [true, "anonId is required"],
      trim: true,
    },
    // Friendly display name generated client-side alongside anonId, e.g.
    // "Curious Otter 42" — shown in the dashboard instead of a raw id.
    anonName: {
      type: String,
      required: [true, "anonName is required"],
      trim: true,
      maxlength: 60,
    },
    action: {
      type: String,
      required: true,
      enum: ["add_to_cart", "read_blog"],
    },
    targetId: {
      type: String,
      trim: true,
    },
    targetTitle: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
    },
    path: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  { timestamps: true },
);

activitySchema.index({ createdAt: -1 });
activitySchema.index({ action: 1 });
activitySchema.index({ anonId: 1 });

module.exports = mongoose.model("Activity", activitySchema);
