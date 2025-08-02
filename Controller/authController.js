const { User, Role, Permission } = require('../Models/index.js');
const bcrypt = require('bcryptjs');
const sendVerificationCode = require('../Middleware/email.js');
const Joi = require("joi");
const jwtMethods = require('../middleware/jwtAuth.js');

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    phoneNumber: Joi.number().min(10).required,
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
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            try {
                await User.create({
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    password: password,
                    verificationCode: verificationCode,
                    verificationExpiresAt: new Date(new Date().getTime() + 1000 * 60 * 10)
                })
                try{
                    sendVerificationCode(email, verificationCode);
                } catch(err) {
                    console.log(err);
                    return res.status(500).json({ message: `error while sending otp`});
                }
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
    
    deleteUser: async (req, res, next) => {
        const phoneNumber = req.body.phoneNumber;
        try{
            const user = await User.findOne({ where: { phoneNumber: phoneNumber } })
            if (!user) {
                return res.status(404).json({ message: 'User not found! ' });
            }
            await User.destroy({ where: { phoneNumber: phoneNumber } });
            res.status(200).json({ message: 'User deleted! ' });
        } catch(err) {
            res.status(500).json({ message: `Error while deleting user` });
            console.log(err);
        }
    },
    
    verifyUser: async (req, res, next) => {
        const verificationCode = req.body.verificationCode.toString();
        try{
            const user = await User.findOne({ where: { phoneNumber: req.body.phoneNumber } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.verificationExpiresAt >= new Date() && verificationCode === user.verificationCode) {
                await user.update({
                    isActive: true,
                    verificationCode: null,
                    verificationExpiresAt: null
                });
                return res.status(200).json({ message: "User verified successfully!!!" });
            } else if (user.verificationExpiresAt <= new Date()){
                return res.status(400).json({ message: "otp Expired!! Please send request for otp" });
            } else {
                return res.status(400).json({ message: "Incorrect otp" });
            }
        } catch(err) {
            res.status(500).json({ message: 'Error while finding or updating user' });
            console.log(err);
        }
    },
    
    resendVerification: async (req, res, next) => {
        try{
            const user = await User.findOne({ where: { phoneNumber: req.body.phoneNumber } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            user.update({
                verificationCode: verificationCode,
                verificationExpiresAt: new Date(new Date().getTime() + 1000 * 60 * 10)
            });
            try{
                sendVerificationCode(email, verificationCode);
            } catch(err) {
                console.log(err);
                return res.status(500).json({ message: `error while sending otp`});
            }
            res.status(200).json({ message: 'otp sent successfully!!!' });
        } catch(err) {
            res.status(500).json({ message: 'Error while finding or updating user' });
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
            if (user.isActive) {
                const isMatch = bcrypt.compareSync(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid Password' });
                }
                const token = jwtMethods.generateJwt({user, phoneNumber});
                return res.status(200).json(token);
            } else {
                return res.status(400).json({ message: 'Please verify before login!!!'});
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: `Inputs are not upto the requirement, Please refer README`});
        }
    },

    logout: (req, res) => {
        res.status(200).json({message: 'It is jwt stateless authentication. Handle logout on client-side.'});
    }
}

module.exports = authController;