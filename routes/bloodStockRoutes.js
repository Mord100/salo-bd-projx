const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const bloodStockController = require('../controllers/bloodStockController');

router.post('/',
  authMiddleware,
  [
    check('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    check('quantityMl').isNumeric()
  ],
  bloodStockController.createBloodStock
);

router.get('/', authMiddleware, bloodStockController.getAllBloodStock);
router.get('/:id', authMiddleware, bloodStockController.getBloodStockById);
router.put('/:id', authMiddleware, bloodStockController.updateBloodStock);
router.delete('/:id', authMiddleware, bloodStockController.deleteBloodStock);
router.get('/alerts/low-stock', authMiddleware, bloodStockController.getLowStockAlerts);

module.exports = router;