
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title : {
        type:String,
        required:true
    },
    imageUrl : {
        type:String,
        required:true
    },
    price : {
        type:String,
        required:true
    },
    description : String,
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Product',productSchema);


// const getDb = require('../utils/database').getDb;
// const mongoDb = require('mongodb');
// const pino = require('../utils/logger');

// class Product {
//     constructor(title, price, imageUrl, description,id , userId) {
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//         this._id = id ? new mongoDb.ObjectID(id) : null;
//         this.userId = userId;
//     }

//     async save() {
//         if (this._id) {
//             await getDb().collection('products').updateOne({ _id: this._id }, { $set: this });
//         }
//         else {
//             await getDb().collection("products").insertOne(this);
//         }
//     }

//     static async deleteById(id) {
//         await getDb().collection('products').deleteOne({ _id: new mongoDb.ObjectId(id) });
//     }

//     static async fetchAll() {
//         return await getDb().collection('products').find().toArray();
//     }

//     static async findByid(id) {
//         return await getDb().collection('products').findOne({ _id: new mongoDb.ObjectID(id) });
//     }
// }

// module.exports = Product;