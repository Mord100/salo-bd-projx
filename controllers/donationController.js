const Donation = require('../models/Donation');
const BloodStock = require('../models/BloodStock');
const { validationResult } = require('express-validator');

exports.createDonation = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const { donationDate, bloodType, quantityMl, donationCenter } = req.body;
    console.log("Request body:", req.body);
    const donation = new Donation({
      donationDate,
      bloodType,
      quantityMl,
      donationCenter
    });
    await donation.save();

    // Update blood stock
    await BloodStock.findOneAndUpdate(
      { bloodType: donation.bloodType },
      { $inc: { quantityMl: donation.quantityMl } },
      { upsert: true }
    );

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};