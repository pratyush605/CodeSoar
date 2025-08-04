const Sequelize = require('sequelize');
const db = require('../Utils/database.js');

const ContactNumber = db.define('ContactNumber', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    spam: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    tableName: 'contact_numbers',
    timestamps: true,
});

module.exports = ContactNumber;