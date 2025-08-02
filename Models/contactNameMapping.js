const Sequelize = require('sequelize');
const db = require('../Utils/database.js');
const Role = require('./role.js');
const Permission = require('./permission.js');

const ContactNameMapping = db.define('ContactNameMapping', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        primaryKey: true
    }
}, {
    tableName: 'ContactNameMapping',
    timestamps: true,
});

module.exports = ContactNameMapping;