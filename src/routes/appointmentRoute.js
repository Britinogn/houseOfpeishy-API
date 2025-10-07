const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (customers can book)
router.post('/', appointmentController.createAppointment);  // Book appointment
router.get('/available-slots/:serviceId', appointmentController.getAvailableSlots);  // Check available times

// Protected routes (admin only)
router.get('/', authMiddleware, appointmentController.getAllAppointments);  // Get all bookings
router.get('/:id', authMiddleware, appointmentController.getAppointmentById);  // Get single booking
router.put('/:id/status', authMiddleware, appointmentController.updateStatus);  // Confirm/complete/cancel
router.delete('/:id', authMiddleware, appointmentController.deleteAppointment);
router.get('/date/:date', authMiddleware, appointmentController.getAppointmentsByDate);  // Filter by date
router.get('/status/:status', authMiddleware, appointmentController.getAppointmentsByStatus);  // Filter by status

router.post('/appointments/:id/send-reminder',  authMiddleware, appointmentController.sendReminder);

module.exports = router;
