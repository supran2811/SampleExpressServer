
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [{
        product: { type: Object, required: true },
        qty: { type: Number , required: true  }
    }],
    user: {
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true
        },
        email: {
            type: String
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);