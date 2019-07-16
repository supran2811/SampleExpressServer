
const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

class CartItem extends Sequelize.Model {}

CartItem.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true
    },
    qty: Sequelize.STRING
},{sequelize , modelName:'cartItem'});

module.exports = CartItem;