const users = require("../models/userModel");
const sequelize = require("../util/db");

const connectToDB = async() => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        await users.findOrCreate({
                where: { email: 'superadmin@gmail.com' },
                defaults: {
                name: 'John Doe',
                email: 'superadmin@gmail.com',
                password: '$2b$10$nIh24sSpOos0AxStP8PrkO5OJRSfrFoWIATWHEfOrDF3FHDDFkEXm',
                role: 'superadmin',
                avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
                sector: [1, 2, 3],
            }
        });
        console.log("Database connected successfully");
    } catch(err){
        console.log("Database connection failed : ", err);
    }
}

module.exports = connectToDB;