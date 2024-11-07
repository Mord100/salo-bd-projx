const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donationDate: {
    type: Date,
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  quantityMl: {
    type: Number,
    required: true
  },
  donationCenter: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);