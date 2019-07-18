const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

/// this is for caching db connection in the pool
let _db;

const connectMongo = (cb) => {
    MongoClient.connect('mongodb+srv://supran:1234@supran-cluster0-zzni5.mongodb.net/shop?retryWrites=true&w=majority')
    .then( client => {
        _db = client.db();
        cb();
    }).catch(error => {
        cb(error);
    });
}

exports.getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No Db Connection!'
};
exports.connectMongo = connectMongo;

