

const getDb = require('../utils/database').getDb;
const mongoDb = require('mongodb');
const pino = require('../utils/logger');

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id ? new mongoDb.ObjectID(id) : null;
    }

    async save() {
        await getDb().collection("users").insertOne(this);
    }

    async addToCart(product) {
        let updatedCart;
        if (this.cart) {
            const cartProductIndex = this.cart.items.findIndex(p => {
                return p.prodId.toString() === product._id.toString()
            });

            if (cartProductIndex >= 0) {
                this.cart.items[cartProductIndex].qty++;
            }
            else {
                this.cart.items.push({ prodId: new mongoDb.ObjectID(product._id), qty: 1 });
            }
            updatedCart = this.cart;
        }
        else {
            updatedCart = { items: [{ prodId: new mongoDb.ObjectID(product._id), qty: 1 }] };
        }
        await getDb().collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
    }

    async deleteFromCart(productId) {
        if (this.cart) {
            const items = this.cart.items.filter(i => {
                return i.prodId.toString() !== productId.toString()
            });
            const updatedCart = { items };
            await getDb().collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
        }
    }

    async getCart() {
        const productIds = this.cart ? this.cart.items.map(i => i.prodId) : [];
        const products = await getDb().collection('products').find({ _id: { $in: productIds } }).toArray();
        return products.map(p => {
            return {
                ...p,
                qty: this.cart.items.find(c => p._id.toString() === c.prodId.toString()).qty
            }
        })
    }

    async addOrder() {
        try {
            const cartProducts = await this.getCart();
            const order = {
                items : cartProducts,
                user : {
                    _id : new mongoDb.ObjectID(this._id),
                    name : this.name
                }
            };
            await getDb().collection("orders").insertOne(order);
            const updatedCart = { items : []};
            await getDb().collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } });

        } catch (error) {

        }
    }

    async getOrders() {
        const orders = await getDb().collection("orders").find({
            'user._id' : new mongoDb.ObjectID(this._id)
        }).toArray();

        return orders;
    }

    static async findById(userId) {
        return await getDb().collection('users').findOne({ _id: new mongoDb.ObjectID(userId) });
    }
}

module.exports = User;