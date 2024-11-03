const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.post('/',
  [
    check('name').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('role').isIn(['admin', 'staff'])
  ],
  adminController.createAdmin
);

router.post('/login',
  [
    check('email').isEmail(),
    check('password').exists()
  ],
  adminController.login
);

router.get('/', authMiddleware, adminController.getAllAdmins);
router.get('/:id', authMiddleware, adminController.getAdminById);
router.put('/:id', authMiddleware, adminController.updateAdmin);
router.post('/change-password', authMiddleware, adminController.changePassword);
router.delete('/:id', authMiddleware, adminController.deleteAdmin);

module.exports = router;