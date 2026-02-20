const Order = require("../models/Order");
const nodemailer = require("nodemailer");

// ── Nodemailer transporter ──────────────────────────────────────────────────
// Set these in your .env:
//   MAIL_USER=your-gmail@gmail.com
//   MAIL_PASS=your-gmail-app-password   (Gmail App Password, not your login password)
//   SALES_EMAIL=sales@smartglobal.com
//   MAIL_FROM=Smart Global <your-gmail@gmail.com>
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a clean HTML email for the sales team.
 */
function buildSalesEmailHtml(order) {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${item.title}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">
          KSh ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#BF1A1A,#8B1414);padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:1px;">NEW ORDER — SMART GLOBAL</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">
        Received via ${order.channel.toUpperCase()} · ${new Date(order.createdAt).toLocaleString("en-KE")}
      </p>
    </div>

    <!-- Customer Details -->
    <div style="padding:24px 32px;border-bottom:1px solid #f0f0f0;">
      <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;">Customer Details</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:4px 0;color:#6b7280;width:120px;font-size:13px;">Name</td><td style="padding:4px 0;font-weight:600;font-size:13px;">${order.customer.name}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Phone</td><td style="padding:4px 0;font-weight:600;font-size:13px;">${order.customer.phone}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Location</td><td style="padding:4px 0;font-weight:600;font-size:13px;">${order.customer.location}</td></tr>
        ${order.customer.notes ? `<tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Notes</td><td style="padding:4px 0;font-size:13px;">${order.customer.notes}</td></tr>` : ""}
      </table>
    </div>

    <!-- Order Items -->
    <div style="padding:24px 32px;border-bottom:1px solid #f0f0f0;">
      <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;">Order Items</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;">Product</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <!-- Total -->
    <div style="padding:20px 32px;background:#fafafa;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:15px;font-weight:700;color:#1a1a1a;">TOTAL</span>
      <span style="font-size:22px;font-weight:900;color:#BF1A1A;">KSh ${order.totalPrice.toLocaleString()}</span>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;background:#f9fafb;text-align:center;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">
        Order ID: ${order._id} · Smart Global Foods · Nairobi, Kenya
      </p>
      <p style="margin:6px 0 0;font-size:11px;color:#9ca3af;">
        Payment will be discussed with the customer directly.
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Build a confirmation email for the customer (only sent if they provide email).
 */
function buildCustomerEmailHtml(order) {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;">${item.title} × ${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:600;">
          KSh ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#BF1A1A,#8B1414);padding:28px 32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:20px;">Order Received!</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Thank you, ${order.customer.name}. Our team will be in touch shortly.</p>
    </div>
    <div style="padding:24px 32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td style="padding:14px 12px;font-weight:700;font-size:14px;">Total</td>
            <td style="padding:14px 12px;text-align:right;font-size:18px;font-weight:900;color:#BF1A1A;">
              KSh ${order.totalPrice.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        Payment details will be discussed with you directly by our sales team.<br>
        Questions? Reply to this email or WhatsApp us.
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /smartglobal/orders
 * Creates an order, saves it, and fires emails.
 *
 * Body:
 *  {
 *    customer: { name, phone, location, notes },
 *    items: [{ productId, title, price, quantity, image, category }],
 *    totalPrice: Number,
 *    channel: "whatsapp" | "email",
 *    sessionId: String,      // from localStorage on the frontend (guest token)
 *    customerEmail: String,  // optional — to send confirmation to customer
 *  }
 *
 * Auth: optional — if Authorization header is present and valid, user is attached.
 */
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, totalPrice, channel, sessionId, customerEmail } =
      req.body;

    // Basic validation
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

    // Build order doc
    const orderData = {
      customer,
      items,
      totalPrice,
      channel,
      sessionId: sessionId || null,
      // If request came from a logged-in user, attach their id
      user: req.user ? req.user._id : null,
    };

    const order = await Order.create(orderData);

    // ── Send email to sales team ──────────────────────────────────────────
    try {
      await transporter.sendMail({
        from:
          process.env.MAIL_FROM ||
          `"Smart Global Orders" <${process.env.MAIL_USER}>`,
        to: process.env.SALES_EMAIL,
        subject: `New Order from ${customer.name} — KSh ${totalPrice.toLocaleString()}`,
        html: buildSalesEmailHtml(order),
      });
    } catch (mailErr) {
      // Log but don't fail the request — order is already saved
      console.error("Sales email failed:", mailErr.message);
    }

    // ── Send confirmation to customer (if email provided) ─────────────────
    if (customerEmail && customerEmail.includes("@")) {
      try {
        await transporter.sendMail({
          from:
            process.env.MAIL_FROM ||
            `"Smart Global" <${process.env.MAIL_USER}>`,
          to: customerEmail,
          subject: `Your Smart Global Order — ${customer.name}`,
          html: buildCustomerEmailHtml(order),
        });
      } catch (mailErr) {
        console.error("Customer confirmation email failed:", mailErr.message);
      }
    }

    res.status(201).json({
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

/**
 * POST /smartglobal/orders/claim
 * After a guest signs up, attach their session orders to their new user ID.
 *
 * Body: { sessionId: String }
 * Auth: required
 */
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

/**
 * GET /smartglobal/orders/my
 * Get all orders for the logged-in user, newest first.
 * Auth: required
 */
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

/**
 * GET /smartglobal/orders/session/:sessionId
 * Get orders by sessionId — for guests who haven't signed up yet.
 * No auth required, but sessionId must match exactly.
 */
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

/**
 * GET /smartglobal/orders/:id
 * Get a single order by ID.
 * Auth: required — user can only view their own, admin can view any.
 */
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    const isOwner =
      order.user && order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized." });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    console.error("getSingleOrder error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * PATCH /smartglobal/orders/:id/complete
 * Admin marks an order as complete.
 * Auth: admin only.
 */
exports.markComplete = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "complete" },
      { new: true },
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

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

/**
 * GET /smartglobal/orders (admin)
 * Get all orders. Admin only.
 */
exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only." });
    }

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
