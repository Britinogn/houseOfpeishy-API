const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');
const {uploadGallery} = require('../middleware/uploadMiddleware');

// Public routes (customers can view)
router.get('/', galleryController.getAllMedia);  // Get all images/videos
router.get('/category/:category', galleryController.getMediaByCategory);  // Filter by category
router.get('/:id', galleryController.getMediaById);  // Get single item

// Protected routes (admin only)
//router.post('/upload', authMiddleware, uploadGallery.single('file'), galleryController.uploadMedia);  
// Upload image/video
router.post('/upload', authMiddleware, uploadGallery.array('files', 10), galleryController.uploadMedia);

router.delete('/:id', authMiddleware, galleryController.deleteMedia);  // Delete from gallery
router.put('/:id', authMiddleware, galleryController.updateCaption);  // Update caption/category

module.exports = router;