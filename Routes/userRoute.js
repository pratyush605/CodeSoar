const express = require('express');
const userController = require('../Controller/userController.js');
const applyAuthMiddleware = require('../middleware/applyAuth.js');

const router = express.Router();

router.use(applyAuthMiddleware);

router.post('/spam', userController.markSpam);

router.post('/search', userController.search);

router.post('/show-details', userController.showDetails);

module.exports = router;