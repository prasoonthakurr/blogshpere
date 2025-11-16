const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const blogs = require("./blogModel");

const users = sequelize.define('users',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.TEXT,
    },
    sector: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    createdBy: {
        type: DataTypes.INTEGER,
    },
    updatedBy: {
        type: DataTypes.INTEGER,
    },
    deletedBy: {
        type: DataTypes.INTEGER,
    },
},{
    timestamps: true,
    paranoid: true,
});

module.exports = users;