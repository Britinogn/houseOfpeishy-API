// routes/adminDashboardRoute.js
const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Get overall dashboard stats (Admin only)
router.get('/stats', authMiddleware, adminDashboardController.getDashboardStats);

module.exports = router;
