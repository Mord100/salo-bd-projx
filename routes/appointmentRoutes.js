const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

router.post('/',
  [
    check('donor').isMongoId(),
    check('appointmentDate').isDate(),
    check('status').isIn(['scheduled', 'completed', 'cancelled', 'rescheduled'])
  ],
  appointmentController.createAppointment
);

router.get('/', authMiddleware, appointmentController.getAllAppointments);
router.get('/:id', authMiddleware, appointmentController.getAppointmentById);
router.put('/:id', authMiddleware, appointmentController.updateAppointment);
router.delete('/:id', authMiddleware, appointmentController.deleteAppointment);

module.exports = router;