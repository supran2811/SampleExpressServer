
const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

class User extends Sequelize.Model {}

User.init({
    id: {
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        allowNull : false
    },
    name : {
        type: Sequelize.STRING,
        allowNull : false
    },
    email : {
        type: Sequelize.STRING,
        allowNull:false
    }
} , {sequelize , modelName:'user'});

module.exports  = User;