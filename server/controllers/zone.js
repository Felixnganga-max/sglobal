const Zone = require("../models/zone");

// ── GET all active zones (public) ─────────────────────────────────────────
exports.getAllZones = async (req, res) => {
  try {
    const zones = await Zone.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, data: zones });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET all zones including inactive (admin) ───────────────────────────────
exports.getAllZonesAdmin = async (req, res) => {
  try {
    const zones = await Zone.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: zones });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET single zone ────────────────────────────────────────────────────────
exports.getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone)
      return res
        .status(404)
        .json({ success: false, message: "Zone not found" });
    res.status(200).json({ success: true, data: zone });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST create zone (admin) ───────────────────────────────────────────────
exports.createZone = async (req, res) => {
  try {
    const { name, deliveryFee, description } = req.body;
    if (!name || deliveryFee === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Name and deliveryFee are required" });
    }
    const zone = await Zone.create({ name, deliveryFee, description });
    res.status(201).json({ success: true, data: zone });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Zone name already exists" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT update zone (admin) ────────────────────────────────────────────────
exports.updateZone = async (req, res) => {
  try {
    const zone = await Zone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!zone)
      return res
        .status(404)
        .json({ success: false, message: "Zone not found" });
    res.status(200).json({ success: true, data: zone });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH toggle active/inactive (admin) ──────────────────────────────────
exports.toggleZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone)
      return res
        .status(404)
        .json({ success: false, message: "Zone not found" });
    zone.isActive = !zone.isActive;
    await zone.save();
    res.status(200).json({ success: true, data: zone });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE zone (admin) ────────────────────────────────────────────────────
exports.deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findByIdAndDelete(req.params.id);
    if (!zone)
      return res
        .status(404)
        .json({ success: false, message: "Zone not found" });
    res.status(200).json({ success: true, message: "Zone deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
