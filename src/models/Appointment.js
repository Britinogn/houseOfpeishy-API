const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    serviceId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    
    clientName:{type: String , required: true, trim: true},
    clientPhone: {type: String, required: true, trim: true},
    clientEmail:{type: String , required:  true, lowercase: true, trim: true },
    
    appointmentDate:{type: Date , required: true},
    appointmentTime: {type: String , required: true},

    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },

    notes: { type: String, trim: true },
    smsSent: {
        booking: {type: Boolean, default: false},
        confirmation: {type: Boolean, default: false},
        reminder: {type: Boolean, default: false}
    }
} , { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema)
