const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.post('/register',
  [
    check('name').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('role').isIn(['admin', 'staff'])
  ],
  adminController.register
);

router.post('/login',
  [
    check('email').isEmail(),
    check('password').exists()
  ],
  adminController.login
);

router.get('/profile', authMiddleware, adminController.getProfile);
router.put('/profile', authMiddleware, adminController.updateProfile);
router.get('/dashboard', authMiddleware, adminController.getDashboardStats);

module.exports = router;