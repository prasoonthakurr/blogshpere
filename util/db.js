require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DBNAME, process.env.USERNAME, process.env.PASSWORD,{
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;