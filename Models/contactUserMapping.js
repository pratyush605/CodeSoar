const Sequelize = require('sequelize');
const db = require('../Utils/database.js');

const ContactUserMapping = db.define('ContactUserMapping', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        primaryKey: true
    }
}, {
    tableName: 'ContactUserMapping',
    timestamps: true,
});

module.exports = ContactUserMapping;