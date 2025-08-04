const { User, ContactNumber, ContactName, ContactNameMapping, ContactUserMapping } = require("../Models");
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
                            const allNamesId = await ContactNameMapping.findAll({
                                where: {ContactNumberId: searchNumber.id},
                                raw: true
                            });
                            const contactNameIds = allNamesId.map(item => item.ContactNameId);
                            const allNames = await ContactName.findAll({
                                where: {id: contactNameIds},
                                raw: true
                            });
                            let data = [];
                            for(const name of allNames){
                                let result = {};
                                result.id = name.id;
                                result.name = name.name;
                                result.phoneNumber = searchNumber.phoneNumber;
                                result.spam = searchNumber.spam;
                                data.push(result);
                            }
                            return res.status(200).json({allNames: data});
                        } else {
                            return res.status(200).json({message: 'no number found!!!'});
                        }
                    }
                } else {
                    return res.status(400).json({message: 'Number should be of 10 digits.'});
                }
            } else if (charRegex.test(searchQuery)) {
                const searchSqlQuery = `select * from contact_names where lower(name) like '%${searchQuery.toLowerCase()}%'`;
                const allNames = await database.query(searchSqlQuery, {type: db.QueryTypes.SELECT})[0];
                return res.status(200).json({allNames});
            }
        } catch(err) {
            res.status(500).json({message: 'error while searching'});
            console.log(err);
        }
    },

    showDetails: async (req, res, next) => {
        try{
            const {phoneNumber, personNumber, nameId} = req.body;
            if(phoneNumber){
                const user = await User.findOne({where: {phoneNumber: phoneNumber}});
                if(user){
                    const searcher = await User.findOne({where: {phoneNumber: personNumber}});
                    if(!searcher){
                        searcher = await ContactNumber.findOne({where: {phoneNumber: personNumber}});
                    }
                    if(searcher) {
                        const showUserEmail = await ContactUserMapping.findOne({
                            where: {
                                UserId: user.id,
                                ContactNumberId: searcher.id
                            }
                        });
                        if(showUserEmail){
                            data = [user.name, phoneNumber, user.email, user.spam];
                            return res.status(200).json({data});
                        } else {
                            data = [user.name, phoneNumber, user.spam];
                            return res.status(200).json({data});
                        }
                    } else {
                        data = [user.name, phoneNumber, user.spam];
                        return res.status(200).json({data});
                    }
                }
            }
            if (nameId) {
                const numberId = await ContactNameMapping.findOne({
                    where: {ContactNameId: nameId}
                });
                const name = await ContactName.findOne({where: {id: nameId}});
                const number = await ContactNumber.findOne({where: {id: numberId.ContactNumberId}});
                const data = [name.name, number.phoneNumber, number.spam];
                return res.status(200).json({data});
            } else {
                res.status(404).json({message: 'Error!!! no data provided'});
            }
        } catch(err) {
            res.status(500).json({message: 'error while searching'});
            console.log(err);
        }
    }
}

module.exports = userController;