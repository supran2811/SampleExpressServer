const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

class Product extends Sequelize.Model {}

Product.init({
    id: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull : false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{sequelize , modelName:'product'});

module.exports = Product;