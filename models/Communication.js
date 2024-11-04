const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  messageType: {
    type: String,
    enum: ['SMS', 'EMAIL'],
    required: true
  },
  messageContent: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Communication', communicationSchema);
