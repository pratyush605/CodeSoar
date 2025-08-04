const Sequelize = require('sequelize');
const db = require('../Utils/database.js');

const User = db.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    spam: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: true,
});

module.exports = User;