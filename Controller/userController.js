const { User, ContactNumber, ContactName, ContactNameMapping, ContactUserMapping } = require("../Models");
const database = require("../Utils/database.js");

const userController = {
    markSpam: async (req, res, next) => {
        try{
            const number = req.body.number;
            const user = await User.findOne({ where: { phoneNumber: number } });
            if(user){
                await user.increment('spam', { by: 1 });
            } else {
                const contact = await ContactNumber.findOne({where: {phoneNumber: number}});
                if(contact){
                    await contact.increment('spam', { by: 1 });
                } else {
                    const newNumber = await ContactNumber.create({
                        phoneNumber: number,
                        spam: 1
                    });
                    const newName = await ContactName.create({
                        name: `spam_${number}`
                    });
                    await ContactNameMapping.create({
                        ContactNameId: newName.id,
                        ContactNumberId: newNumber.id
                    });
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
                            user: {
                                id: user.id,
                                name: user.name,
                                phoneNumber: user.phoneNumber,
                                spam: user.spam
                            }
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
                const searchSqlQuery = `SELECT * FROM contact_names WHERE LOWER(name) LIKE '%${searchQuery.toLowerCase()}%' ORDER BY POSITION(LOWER('${searchQuery.toLowerCase()}') IN LOWER(name));`;
                const allNames = await database.query(searchSqlQuery, {type: database.QueryTypes.SELECT});
                return res.status(200).json({allNames});
            }
        } catch(err) {
            res.status(500).json({message: 'error while searching'});
            console.log(err);
        }
    },

    showDetails: async (req, res, next) => {
        try{
            const nameId = req.body.nameId;
            const phoneNumber = req.body.number;
            if(phoneNumber){
                const user = await User.findOne({where: {phoneNumber: phoneNumber}});
                if(user){
                    const searcher = await ContactNumber.findOne({where: {phoneNumber: req.user.phoneNumber}});
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
                res.status(404).json({message: 'Error!!! either nameId not provied or the number is not a user. Either provide a user register number of a nameId'});
            }
        } catch(err) {
            res.status(500).json({message: 'error while searching'});
            console.log(err);
        }
    }
}

module.exports = userController;