
const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

class OrderItem extends Sequelize.Model {}

OrderItem.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true
    },
    qty: Sequelize.STRING
},{sequelize , modelName:'orderItem'});

module.exports = OrderItem;