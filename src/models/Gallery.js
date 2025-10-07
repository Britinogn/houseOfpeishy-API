const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    mediaType: {
        type: String,
        required: true,
        enum: ['image', 'video'],
        default: 'image'
    },
    coverImage: {
        url: {type: String},
        public_id: {type: String}
    },
    video: {
        url: {type: String},
        public_id: {type: String},
        duration: {type: Number}  // Duration in seconds
    },
    caption: {type: String, default: ''},
    category: {
        type: String, 
        required: true,
        enum: ['Beauty Salon', 'Hair Styling', 'Braid Style', 'Wig Making', 'Hair Sales', 'Before & After']
    }
}, {timestamps: true});

// Validation: Either coverImage or video must be provided
gallerySchema.pre('save', function(next) {
    if (this.mediaType === 'image' && (!this.coverImage.url || !this.coverImage.public_id)) {
        return next(new Error('Image URL and public_id are required for image type'));
    }
    if (this.mediaType === 'video' && (!this.video.url || !this.video.public_id)) {
        return next(new Error('Video URL and public_id are required for video type'));
    }
    if (this.mediaType === 'video' && this.video.duration > 900) {  // 900 seconds = 15 minutes
        return next(new Error('Video duration cannot exceed 15 minutes'));
    }
    next();
});

module.exports = mongoose.model('Gallery', gallerySchema);