const { User } = require('../Models/index.js');
const bcrypt = require('bcryptjs');
const Joi = require("joi");
const jwtMethods = require('../middleware/jwtAuth.js');
const redisClient = require('../Utils/redisClient.js');

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    phoneNumber: Joi.string().length(10).pattern(/^[6-9]\d{9}$/).required(),
    email: Joi.string().email(),
    password: Joi.string().min(3).required(),
});

const authController = {
    createUser: async (req, res, next) => {
        try {
            userSchema.validate({
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                password: req.body.password
            });
            const name = req.body.name;
            const phoneNumber = req.body.phoneNumber;
            const email = req.body.email || '';
            const password = bcrypt.hashSync(req.body.password, 12);
        
            const existingUser = await User.findOne({ where: { phoneNumber: phoneNumber } });
            if (existingUser) {
                return res.status(400).json({ message: 'User already registered' });
            }
            try {
                await User.create({
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    password: password
                })
            } catch(err) {
                console.log(err);
                return res.status(500).json({ message: `error while creating user`});
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: `Inputs are not upto the requirement, Please refer README`});
        }
    },

    updateUser: async (req, res, next) => {
        try {
            userSchema.validate({
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                password: req.body.password
            });
            const name = req.body.name;
            const phoneNumber = req.body.phoneNumber;
            const email = req.body.email || '';
            const password = bcrypt.hashSync(req.body.password, 12);
        
            const existingUser = await User.findOne({ where: { id: req.user.userId } });
            try {
                if (existingUser) {
                    await existingUser.update({
                        name: name,
                        phoneNumber: phoneNumber,
                        email: email,
                        password: password
                    });
                } else {
                    res.status(404).json({message: 'user does not exist'});
                }
            } catch(err) {
                console.log(err);
                return res.status(500).json({ message: `error while updating user`});
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: `Inputs are not upto the requirement, Please refer README`});
        }
    },
    
    deleteUser: async (req, res, next) => {
        try{
            const user = await User.findOne({ where: { id: req.user.userId } });
            if (!user) {
                return res.status(404).json({ message: 'User not found! ' });
            }
            await User.destroy({ where: { id: user.id } });
            res.status(200).json({ message: 'User deleted! ' });
        } catch(err) {
            res.status(500).json({ message: `Error while deleting user` });
            console.log(err);
        }
    },
    
    login: async (req, res, next) => {
        try {
            userSchema.validate({
                phoneNumber: req.body.phoneNumber,
                password: req.body.password
            });
            const phoneNumber = req.body.phoneNumber;
            const password = req.body.password;
            const user = await User.findOne({ where: { phoneNumber: phoneNumber } })
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid Password' });
            }
            const payload = {
                userId: user.id,
                phoneNumber: phoneNumber
            }
            const token = jwtMethods.generateJwt(payload);
            await redisClient.set(payload.userId.toString(), token, { EX: 7 * 24 * 60 * 60 });
            return res.status(200).json({token});
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: `Inputs are not upto the requirement, Please refer README`});
        }
    },

    logout: (req, res) => {
        try{
            const userId = req.user.userId;
            redisClient.del(userId.toString());
            res.status(200).json({message: 'Logout successfull!!!'});
        } catch(err) {
            res.status(500).json({message: 'error while logout!!! try again.'});
            console.log(err);
        }
    }
}

module.exports = authController;