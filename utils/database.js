
const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete' , 'postgres' , 'admin' , {
    dialect:'postgres'
});

module.exports = sequelize;