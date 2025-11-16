const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const sectors = sequelize.define('sectors',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

module.exports = sectors;