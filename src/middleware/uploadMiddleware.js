const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Storage for Service images only
const serviceStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'service_images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{width: 1200, height: 1200, crop: 'limit'}]
    }
});

// Storage for Gallery (images + videos)
const galleryStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        // Check if it's video or image
        const isVideo = file.mimetype.startsWith('video/');
        
        return {
            folder: isVideo ? 'gallery_videos' : 'gallery_images',
            allowed_formats: isVideo 
                ? ['mp4', 'mov', 'avi', 'mkv'] 
                : ['jpg', 'jpeg', 'png', 'webp'],
            resource_type: isVideo ? 'video' : 'image',
            transformation: isVideo 
                ? [{quality: 'auto', fetch_format: 'mp4'}] 
                : [{width: 1200, height: 1200, crop: 'limit'}]
        };
    }
});

// Create multer upload instances
const uploadService = multer({ 
    storage: serviceStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for images
});

const uploadGallery = multer({ 
    storage: galleryStorage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit (for videos)
});

module.exports = {
    uploadService,
    uploadGallery
};