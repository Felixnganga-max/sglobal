const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      deliveryZone,
      subtotal,
      deliveryFee,
      totalPrice,
      channel,
      sessionId,
      customerEmail,
    } = req.body;

    if (!customer?.name || !customer?.phone || !customer?.location) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Customer name, phone, and location are required.",
        });
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Order must contain at least one item.",
        });
    }
    if (!["whatsapp", "email"].includes(channel)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Channel must be 'whatsapp' or 'email'.",
        });
    }

    const order = await Order.create({
      customer,
      items,
      deliveryZone,
      subtotal,
      deliveryFee,
      totalPrice,
      channel,
      sessionId: sessionId || null,
      user: req.user ? req.user._id : null,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Order placed successfully.",
        data: order,
      });
  } catch (err) {
    console.error("createOrder error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

exports.claimGuestOrders = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId is required." });
    }
    const result = await Order.updateMany(
      { sessionId, user: null },
      { $set: { user: req.user._id } },
    );
    res.json({
      success: true,
      message: `${result.modifiedCount} order(s) linked to your account.`,
    });
  } catch (err) {
    console.error("claimGuestOrders error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    console.error("getMyOrders error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getOrdersBySession = async (req, res) => {
  try {
    const orders = await Order.find({ sessionId: req.params.sessionId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    console.error("getOrdersBySession error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });

    const isOwner =
      order.user && order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res
        .status(403)
        .json({ success: false, message: "Not authorized." });

    res.json({ success: true, data: order });
  } catch (err) {
    console.error("getSingleOrder error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.markComplete = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin only." });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "complete" },
      { new: true },
    );
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });

    res.json({
      success: true,
      message: "Order marked as complete.",
      data: order,
    });
  } catch (err) {
    console.error("markComplete error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin only." });

    const { status, page = 1, limit = 50 } = req.query;
    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Order.countDocuments(filter);
    res.json({ success: true, total, page: Number(page), data: orders });
  } catch (err) {
    console.error("getAllOrders error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
