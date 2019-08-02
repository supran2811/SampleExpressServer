
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    resetToken : String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            prodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }]
    }

});

userSchema.methods.addToCart = async function (product) {
    let updatedCart;
    if (this.cart) {
        const cartProductIndex = this.cart.items.findIndex(p => {
            return p.prodId.toString() === product._id.toString()
        });

        if (cartProductIndex >= 0) {
            this.cart.items[cartProductIndex].qty++;
        }
        else {
            this.cart.items.push({ prodId: product._id, qty: 1 });
        }
        updatedCart = this.cart;
    }
    else {
        updatedCart = { items: [{ prodId: product._id, qty: 1 }] };
    }
    this.cart = updatedCart;
    await this.save();
}

userSchema.methods.deleteFromCart = async function (productId) {

    const items = this.cart.items.filter(i => {
        return i.prodId.toString() !== productId.toString()
    });
    const updatedCart = { items };
    this.cart = updatedCart;
    await this.save();

}

userSchema.methods.clearCart = async function () {
    const cart = {
        items : []
    };
    this.cart = cart;
    await this.save();
}
module.exports = mongoose.model('User', userSchema);
