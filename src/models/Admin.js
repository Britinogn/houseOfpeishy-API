const mongoose = require ('mongoose');

const adminSchema = new mongoose.Schema({
    userName:{type: String, required:true, unique:true, trim: true},
    email:{type: String, required:true, unique:true, trim: true, lowercase:true},
    password: {type: String, required:true,  minlength: 6, },
    adminRole: {type: String,  enum: ['owner', 'manager'],  default: 'owner'},
    profileImage: {type: String, },

}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema)