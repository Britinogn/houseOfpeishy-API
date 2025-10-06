const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);  // Create first admin
router.post('/login', authController.login);

// Protected routes (require authentication)
//router.post('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/update-password', authMiddleware, authController.updatePassword);

module.exports = router;