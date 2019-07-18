
const getDb = require('../utils/database').getDb;
const mongoDb = require('mongodb');
const pino = require('../utils/logger');

class Product {
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    async save() {
        try {
            await getDb().collection("products").insertOne(this);
        } catch (error) {
            pino.error(error);
        }
    }

    async update(id) {
        try {
            await getDb().collection('products').updateOne({ _id : new mongoDb.ObjectId(id) } ,{$set : this});
        } catch(error) {
            pino.error(error);
        }
    }

    static async deleteById(id) {
        await getDb().collection('products').deleteOne({_id : new mongoDb.ObjectId(id)});
    }

    static async fetchAll() {
        try {
            const products = await getDb().collection('products').find().toArray();
            return products;
        } catch (error) {
            pino.error(error);
        }
    }

    static async findByid(id) {
        try {
            return await getDb().collection('products').findOne({}, { _id: new mongoDb.ObjectID(id) });

        } catch (error) {
            pino.error(error);
        }
    }
}

module.exports = Product;