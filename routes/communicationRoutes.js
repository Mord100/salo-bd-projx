const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const communicationController = require('../controllers/communicationController');

router.post('/',
  authMiddleware,
  [
    check('donor').isMongoId(),
    check('messageType').isIn(['SMS', 'EMAIL']),
    check('messageContent').notEmpty()
  ],
  communicationController.createCommunication
);

router.get('/', authMiddleware, communicationController.getAllCommunications);
router.get('/donor/:donorId', authMiddleware, communicationController.getDonorCommunications);
router.get('/:id', authMiddleware, communicationController.getCommunicationById);
router.post('/bulk-send', authMiddleware, communicationController.bulkSendCommunications);
router.post('/reminder/:donorId', authMiddleware, communicationController.sendDonationReminder);

module.exports = router;