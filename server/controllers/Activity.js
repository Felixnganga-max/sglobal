const Activity = require("../models/Activity");

const ACTIONS = ["add_to_cart", "read_blog"];

// @desc    Record an anonymous user action (add to cart, read a blog, ...)
// @route   POST /smartglobal/activity
// @access  Public
exports.logActivity = async (req, res) => {
  try {
    const { anonId, anonName, action, targetId, targetTitle, meta, path } =
      req.body;

    if (!anonId || !anonName || !ACTIONS.includes(action)) {
      return res.status(400).json({
        success: false,
        message: "anonId, anonName and a valid action are required",
      });
    }

    await Activity.create({
      anonId,
      anonName,
      action,
      targetId,
      targetTitle,
      meta,
      path,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    List activity logs, most recent first
// @route   GET /smartglobal/activity
// @access  Private/Admin
exports.getActivityLogs = async (req, res) => {
  try {
    const { action, page = 1, limit = 50 } = req.query;
    const filter = action && ACTIONS.includes(action) ? { action } : {};

    const [logs, total] = await Promise.all([
      Activity.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Activity.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Activity summary — total events, unique visitors, per-action counts
// @route   GET /smartglobal/activity/stats
// @access  Private/Admin
exports.getActivityStats = async (req, res) => {
  try {
    const [totalEvents, uniqueVisitors, byAction] = await Promise.all([
      Activity.countDocuments(),
      Activity.distinct("anonId"),
      Activity.aggregate([
        { $group: { _id: "$action", count: { $sum: 1 } } },
      ]),
    ]);

    const counts = { add_to_cart: 0, read_blog: 0 };
    byAction.forEach((row) => {
      counts[row._id] = row.count;
    });

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        uniqueVisitors: uniqueVisitors.length,
        addToCart: counts.add_to_cart,
        readBlog: counts.read_blog,
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
