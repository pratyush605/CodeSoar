const Sequelize = require('sequelize');
const db = require('../Utils/database.js');

const ContactName = db.define('ContactName', {
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
    }
}, {
    tableName: 'contact_names',
    timestamps: true,
});

module.exports = ContactName;