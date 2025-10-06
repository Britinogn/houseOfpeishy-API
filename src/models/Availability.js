const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    dayOfWeek: {
        type: String, 
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    openTime: {type: String, required: true},  // e.g., "09:00"
    closeTime: {type: String, required: true},  // e.g., "18:00"
    isClosed: {type: Boolean, default: false},  // Changed from isOpen
    slotDuration: {type: Number, default: 60},  // Duration of each appointment slot in minutes
    bufferTime: {type: Number, default: 15}  // Break time between appointments in minutes
}, {timestamps: true});

module.exports = mongoose.model('Availability', availabilitySchema);