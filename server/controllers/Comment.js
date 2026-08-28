const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// @desc    Get all comments for a blog
// @route   GET /smartglobal/blogs/:blogId/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Add a comment to a blog
// @route   POST /smartglobal/blogs/:blogId/comments
// @access  Public
exports.createComment = async (req, res) => {
  try {
    const { name, message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment message is required",
      });
    }

    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comment = await Comment.create({
      blog: req.params.blogId,
      name: name?.trim() || "Anonymous",
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Comment posted",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete a comment (moderation)
// @route   DELETE /smartglobal/blogs/comments/:commentId
// @access  Private/Admin
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Comment deleted",
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

// @desc    Reply to a comment as Smart Global
// @route   PATCH /smartglobal/blogs/comments/:commentId/reply
// @access  Private/Admin
exports.replyToComment = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { adminReply: { message: message.trim(), repliedAt: new Date() } },
      { new: true, runValidators: true },
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reply posted",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Like a comment (business appreciation gesture)
// @route   PATCH /smartglobal/blogs/comments/:commentId/like
// @access  Private/Admin
exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { $inc: { likes: 1 } },
      { new: true },
    );
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Mark all comments on a blog as read
// @route   PATCH /smartglobal/blogs/:blogId/comments/mark-read
// @access  Private/Admin
exports.markCommentsRead = async (req, res) => {
  try {
    await Comment.updateMany(
      { blog: req.params.blogId, read: false },
      { read: true },
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Count unread comments, grouped by blog — powers the "new
//          comment" badges in the dashboard
// @route   GET /smartglobal/blogs/comments/unread-counts
// @access  Private/Admin
exports.getUnreadCommentCounts = async (req, res) => {
  try {
    const results = await Comment.aggregate([
      { $match: { read: false } },
      { $group: { _id: "$blog", count: { $sum: 1 } } },
    ]);

    const byBlog = {};
    let total = 0;
    results.forEach((r) => {
      byBlog[r._id.toString()] = r.count;
      total += r.count;
    });

    res.status(200).json({ success: true, data: { total, byBlog } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
