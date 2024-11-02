const Donor = require('../models/Donor');
const { validationResult } = require('express-validator');

exports.createDonor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const donor = new Donor(req.body);
    await donor.save();
    
    res.status(201).json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllDonors = async (req, res) => {
  try {
    const { bloodType, eligibilityStatus } = req.query;
    const filter = {};

    if (bloodType) filter.bloodType = bloodType;
    if (eligibilityStatus !== undefined) {
      filter.eligibilityStatus = eligibilityStatus === 'true';
    }

    const donors = await Donor.find(filter);
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateDonor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.recordDonation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    donor.lastDonationDate = new Date();
    donor.eligibilityStatus = false;
    await donor.save();

    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.checkEligibility = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const isEligible = !donor.lastDonationDate || donor.lastDonationDate <= threeMonthsAgo;

    if (donor.eligibilityStatus !== isEligible) {
      donor.eligibilityStatus = isEligible;
      await donor.save();
    }

    res.json({
      isEligible,
      lastDonationDate: donor.lastDonationDate,
      nextEligibleDate: donor.lastDonationDate ? 
        new Date(donor.lastDonationDate.getTime() + (90 * 24 * 60 * 60 * 1000)) : 
        null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDonorStats = async (req, res) => {
  try {
    const stats = await Donor.aggregate([
      {
        $group: {
          _id: '$bloodType',
          count: { $sum: 1 },
          eligibleDonors: {
            $sum: { $cond: ['$eligibilityStatus', 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};