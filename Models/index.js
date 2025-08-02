const ContactNumber = require('./contactNumber.js');
const ContactName = require('./contactName.js');
const ContactNameMapping = require('./contactNameMapping.js');
const ContactUserMapping = require('./contactUserMapping.js');
const User = require('./user.js');

ContactNumber.belongsToMany(ContactName, {
    through: ContactNameMapping,
    foreignKey: 'ContactNumberId',
    otherKey: 'ContactNameId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
ContactName.belongsToMany(ContactNumber, {
    through: ContactNameMapping,
    foreignKey: 'ContactNameId',
    otherKey: 'ContactNumberId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.belongsToMany(ContactNumber, {
    through: ContactUserMapping,
    foreignKey: 'ContactNumberId',
    otherKey: 'ContactNameId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
ContactNumber.belongsToMany(User, {
    through: ContactUserMapping,
    foreignKey: 'ContactNameId',
    otherKey: 'ContactNumberId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = {
    ContactNumber,
    ContactName,
    ContactNameMapping,
    ContactUserMapping,
    User
};