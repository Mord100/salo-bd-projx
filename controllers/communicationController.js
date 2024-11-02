const Communication = require('../models/Communication');
const Donor = require('../models/Donor');
const { validationResult } = require('express-validator');

exports.createCommunication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const communication = new Communication({
      donor: req.body.donor,
      messageType: req.body.messageType,
      messageContent: req.body.messageContent,
      status: 'pending'
    });

    // Here you would typically integrate with an SMS/Email service
    // For demonstration, we'll just mark it as sent
    communication.status = 'sent';
    await communication.save();

    res.status(201).json(communication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllCommunications = async (req, res) => {
  try {
    const communications = await Communication.find()
      .populate('donor', 'name contactInfo')
      .sort({ createdAt: -1 });
    res.json(communications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDonorCommunications = async (req, res) => {
  try {
    const communications = await Communication.find({ donor: req.params.donorId })
      .populate('donor', 'name contactInfo')
      .sort({ createdAt: -1 });
    res.json(communications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCommunicationById = async (req, res) => {
  try {
    const communication = await Communication.findById(req.params.id)
      .populate('donor', 'name contactInfo');
    
    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }
    
    res.json(communication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.bulkSendCommunications = async (req, res) => {
  try {
    const { donors, messageType, messageContent } = req.body;
    
    const communications = await Promise.all(
      donors.map(async (donorId) => {
        const communication = new Communication({
          donor: donorId,
          messageType,
          messageContent,
          status: 'sent'
        });
        await communication.save();
        return communication;
      })
    );

    res.status(201).json(communications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.sendDonationReminder = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const reminderMessage = `Dear ${donor.name}, it's time for your next blood donation. Please schedule your appointment soon.`;
    
    const communication = new Communication({
      donor: donor._id,
      messageType: donor.contactInfo.email ? 'EMAIL' : 'SMS',
      messageContent: reminderMessage,
      status: 'sent'
    });

    await communication.save();
    res.json(communication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Completing the adminController.js getDashboardStats function
// File: src/controllers/adminController.js (continuation)
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Basic statistics
    const totalDonors = await Donor.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const upcomingAppointments = await Appointment.find({
      appointmentDate: { $gte: today },
      status: 'scheduled'
    }).count();

    // Recent donations trend
    const recentDonations = await Donation.aggregate([
      {
        $match: {
          donationDate: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$donationDate" } },
          count: { $sum: 1 },
          totalQuantity: { $sum: "$quantityMl" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Blood stock levels
    const bloodStockLevels = await BloodStock.find().sort('bloodType');

    // Donor eligibility status
    const eligibleDonors = await Donor.countDocuments({ eligibilityStatus: true });
    const ineligibleDonors = totalDonors - eligibleDonors;

    // Appointment statistics
    const appointmentStats = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate donation success rate
    const completedDonations = await Donation.countDocuments({
      donationDate: { $gte: thirtyDaysAgo }
    });
    const scheduledAppointments = await Appointment.countDocuments({
      appointmentDate: { $gte: thirtyDaysAgo },
      status: { $in: ['scheduled', 'completed'] }
    });
    const donationSuccessRate = scheduledAppointments ? 
      (completedDonations / scheduledAppointments) * 100 : 0;

    // Get low stock alerts
    const lowStockThreshold = 1000; // 1 liter
    const lowStockAlerts = await BloodStock.find({
      quantityMl: { $lt: lowStockThreshold }
    });

    const dashboardData = {
      overview: {
        totalDonors,
        totalDonations,
        upcomingAppointments,
        eligibleDonors,
        ineligibleDonors
      },
      recentDonations,
      bloodStockLevels,
      appointmentStats,
      performance: {
        donationSuccessRate: donationSuccessRate.toFixed(2),
        lowStockAlerts
      },
      thirtyDayStats: {
        donations: completedDonations,
        appointmentsScheduled: scheduledAppointments
      }
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};