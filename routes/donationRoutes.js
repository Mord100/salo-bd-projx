const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const donationController = require('../controllers/donationController');

router.post('/',
  authMiddleware,
  [
    check('donor').isMongoId(),
    check('donationDate').isDate(),
    check('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    check('quantityMl').isNumeric(),
    check('donationCenter').notEmpty()
  ],
  donationController.createDonation
);

router.get('/', authMiddleware, donationController.getAllDonations);
router.get('/:id', authMiddleware, donationController.getDonationById);
router.put('/:id', authMiddleware, donationController.updateDonation);
router.delete('/:id', authMiddleware, donationController.deleteDonation);

module.exports = router;