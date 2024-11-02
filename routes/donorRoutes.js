const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const donorController = require('../controllers/donorController');

router.post('/',
  [
    check('name').notEmpty(),
    check('dateOfBirth').isDate(),
    check('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    check('contactInfo.email').isEmail(),
    check('address').notEmpty()
  ],
  donorController.createDonor
);

router.get('/', authMiddleware, donorController.getAllDonors);
router.get('/:id', authMiddleware, donorController.getDonorById);
router.put('/:id', authMiddleware, donorController.updateDonor);
router.delete('/:id', authMiddleware, donorController.deleteDonor);

module.exports = router;