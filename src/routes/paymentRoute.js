const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// All payment routes require authentication (admin only)
router.post('/', authMiddleware, paymentController.recordPayment);  // Record payment
router.get('/', authMiddleware, paymentController.getAllPayments);  // Get all payments
router.get('/:id', authMiddleware, paymentController.getPaymentById);  // Get single payment
router.get('/appointment/:appointmentId', authMiddleware, paymentController.getPaymentByAppointment);  // Get payment for specific appointment
router.put('/:id', authMiddleware, paymentController.updatePayment);  // Update payment details
router.get('/stats/summary', authMiddleware, paymentController.getPaymentSummary);  // Revenue stats

module.exports = router;