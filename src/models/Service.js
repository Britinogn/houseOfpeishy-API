const mongoose = require ('mongoose')

const serviceSchema = new mongoose.Schema({
    name: {type: String, required: true,  trim: true},
    description: {type: String, required: true},
    category:  {type: String, required: true,
        enum: ['Beauty Treatment', 'Hair Styling', 'Wig Making', 'Hair Sales'],  // Restricts to my 4 categories
    },
    price: {type: Number, required: true , min: 0},
    coverImage:   {url: String, public_id: String},
    duration:{ type: Number, default: null },
    isActive:{type: Boolean, default: true},
    stockQuantity: {type: Number,  default: null},
    isProduct:  {type: Boolean,  default: false},
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema)


// required: function () {
//       return !this.isProduct;