
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
        name: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);