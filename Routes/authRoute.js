const express = require('express');
const authController = require('../Controller/authController.js');

const router = express.Router();

router.post('/signup', authController.createUser);

router.get('/delete', authController.deleteUser);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;