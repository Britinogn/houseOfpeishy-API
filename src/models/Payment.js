const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    appointmentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true},
    amount: {type: Number, required: true, min: 0},
    paymentMethod: {
        type: String, 
        required: true,
        enum: ['cash', 'bank_transfer', 'POS', 'card']
    },
    paymentStatus: {
        type: String, 
        required: true,
        enum: ['pending', 'completed', 'refunded'],
        default: 'pending'
    },
    transactionReference: {type: String, default: null},  // Changed from transactionId
    paidAt: {type: Date, default: null},  // When payment was actually received
    notes: {type: String, default: ''}
}, {timestamps: true});

module.exports = mongoose.model('Payment', paymentSchema);  // Fixed: was 'Appointment'