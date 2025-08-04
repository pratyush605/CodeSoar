const express = require('express');
const authController = require('../Controller/authController.js');
const applyAuthMiddleware = require('../middleware/applyAuth.js');

const router = express.Router();

router.post('/signup', authController.createUser);

router.post('/update', applyAuthMiddleware, authController.updateUser);

router.get('/delete', authController.deleteUser);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;