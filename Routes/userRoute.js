const express = require('express');
const userController = require('../Controller/userController.js');
const applyAuthMiddleware = require('../middleware/applyAuth.js');

const router = express.Router();

router.use(applyAuthMiddleware);

router.post('/spam', userController.markSpam);

router.get('/search', userController.search);

module.exports = router;