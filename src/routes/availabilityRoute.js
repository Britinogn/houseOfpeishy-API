const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (customers need to see when salon is open)
router.get('/', availabilityController.getWeekSchedule);  // Get full week schedule
router.get('/day/:day', availabilityController.getDaySchedule);  // Get specific day
router.get('/check', availabilityController.checkIfOpen);  // Check if open on specific date

// Protected routes (admin only)
router.post('/', authMiddleware, availabilityController.setAvailability);  // Set/create schedule
router.put('/:id', authMiddleware, availabilityController.updateAvailability);  // Update hours
//router.patch('/:id/toggle-closed', authMiddleware, availabilityController.toggleClosed);  // Mark day closed/open


//router.get('/availability/week', getWeekSchedule);

router.delete('/:id', authMiddleware, availabilityController.deleteAvailability);

module.exports = router;

//availability/check?date=2025-11-20