const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');
const {uploadService} = require('../middleware/uploadMiddleware');

// Public routes (customers can view)
router.get('/', serviceController.getAllServices);  // Get all active services
router.get('/:id', serviceController.getServiceById);  // Get single service
router.get('/category/:category', serviceController.getServicesByCategory);  // Filter by category


// Protected routes (admin only)
router.post('/', authMiddleware, uploadService.single('coverImage'), serviceController.createService);
router.put('/:id', authMiddleware, uploadService.single('coverImage'), serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);
router.patch('/:id/toggle-status', authMiddleware, serviceController.toggleServiceStatus);  // Activate/deactivate

module.exports = router;