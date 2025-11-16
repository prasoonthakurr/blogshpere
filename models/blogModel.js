const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const blogs = sequelize.define('blogs',{
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sector: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isPrivate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'users',
        key: 'id',
        },
    },
    isApproved:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isRejected:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    approvedBy:{
        type: DataTypes.INTEGER,
    },
    rejectedBy:{
        type: DataTypes.INTEGER,
    },
    updatedBy: {
        type: DataTypes.INTEGER,
    },
    deletedBy: {
        type: DataTypes.INTEGER,
    },
}, {
    timestamps: true,
    paranoid: true,
});

module.exports = blogs;