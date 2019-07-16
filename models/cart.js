
const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

class Cart extends Sequelize.Model {}

Cart.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true
    }
},{sequelize , modelName:'cart'});

module.exports = Cart;