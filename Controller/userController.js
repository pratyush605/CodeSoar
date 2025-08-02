const { User, ContactNumber, ContactName, ContactNameMapping } = require("../Models");
const database = require("../Utils/database");

const userController = {
    markSpam: async (req, res, next) => {
        try{
            const number = req.body.number;
            const user = await User.findOne({ where: { phoneNumber: number } });
            if(user){
                const spamCount = user.spam;
                await user.update({
                    spam: spamCount + 1
                });
            } else {
                const contact = ContactNumber.findOne({where: {phoneNumber: number}});
                if(contact){
                    const spamCount = contact.spam;
                    await contact.update({
                        spam: spamCount + 1
                    });
                } else {
                    const newNumber = await ContactNumber.create({
                        phoneNumber: number,
                        spam: 1
                    });
                    const newName = await ContactName.create({
                        name: 'spam',
                        ContactNumberId: newNumber.id
                    });
                    await newNumber.update({
                        ContactNameId: newName.id
                    })
                }
            }
            res.status(200).json({message: 'Marked spam successfully!!!'});
        } catch(err) {
            res.status(500).json({message: 'error while marking spam!! try again'})
            console.log(err);
        }
    },

    search: async (req, res, next) => {
        try{
            const searchQuery = req.body.search;
            const charRegex = /^[a-zA-Z]+$/;
            if (!isNaN(searchQuery)) {
                const digitRegex = /^\d{10}$/;
                if (digitRegex.test(searchQuery)) {
                    const user = await User.findOne({where: {phoneNumber: searchQuery}});
                    if (user) {
                        return res.status(200).json({
                            message: 'Registered user found!!!',
                            user: user
                        });
                    } else {
                        const searchNumber = await ContactNumber.findOne({where: { phoneNumber: searchQuery}});
                        if(searchNumber){
                            const allNames = await ContactNameMapping.findAll({where: {ContactNumberId: searchNumber.id}});
                            return res.status(200).json({allNames: allNames});
                        } else {
                            return res.status(200).json({message: 'no number found!!!'});
                        }
                    }
                } else {
                    return res.status(400).json({message: 'Number should be of 10 digits.'});
                }
            } else if (charRegex.test(searchQuery)) {
                const searchSqlQuery = `select * from contact_names where lower(name) like '%${searchQuery.toLowerCase()}%'`;
                const allNames = await database.query(searchSqlQuery, {type: db.QueryTypes.SELECT});
                return res.status(200).json({allNames});
            }
        } catch(err) {
            res.status(500).json({message: 'error while searching'});
            console.log(err);
        }
    }
}

module.exports = userController;