const BloodStock = require('../models/BloodStock');
const { validationResult } = require('express-validator');

exports.createBloodStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bloodStock = new BloodStock(req.body);
    await bloodStock.save();
    res.status(201).json(bloodStock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllBloodStock = async (req, res) => {
  try {
    const bloodStock = await BloodStock.find();
    res.json(bloodStock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBloodStockById = async (req, res) => {
  try {
    const bloodStock = await BloodStock.findById(req.params.id);
    if (!bloodStock) {
      return res.status(404).json({ message: 'Blood stock not found' });
    }
    res.json(bloodStock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBloodStock = async (req, res) => {
  try {
    const bloodStock = await BloodStock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!bloodStock) {
      return res.status(404).json({ message: 'Blood stock not found' });
    }
    res.json(bloodStock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteBloodStock = async (req, res) => {
  try {
    const bloodStock = await BloodStock.findByIdAndDelete(req.params.id);
    if (!bloodStock) {
      return res.status(404).json({ message: 'Blood stock not found' });
    }
    res.json({ message: 'Blood stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLowStockAlerts = async (req, res) => {
  try {
    const lowStockThreshold = 1000; // 1 liter threshold
    const lowStock = await BloodStock.find({
      quantityMl: { $lt: lowStockThreshold }
    });
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};