const Sequelize = require('sequelize');
require('dotenv').config();

const database = async () => {
    const db = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
        host: process.env.DATABASE_HOST,
        dialect: 'postgres',
        port: process.env.DATABASE_PORT,
    });
    
    try{
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    return db;
}

module.exports = database();