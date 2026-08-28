const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    // Auto-filled from the visitor's generated anonymous identity — no
    // "type your name" prompt slowing down the comment form.
    name: {
      type: String,
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
      default: "Anonymous",
    },
    message: {
      type: String,
      required: [true, "Comment message is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    // A single admin reply is enough for direct customer engagement —
    // no need for full threading.
    adminReply: {
      message: {
        type: String,
        trim: true,
        maxlength: [1000, "Reply cannot exceed 1000 characters"],
      },
      repliedAt: Date,
    },
    likes: {
      type: Number,
      default: 0,
    },
    // Lets the dashboard show "new" comments until an admin actually opens
    // that post's comments panel.
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ read: 1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
