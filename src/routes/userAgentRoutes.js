const express = require('express');
const router = express.Router();
const { userAgentController } = require('../controllers');

router.get('/', userAgentController.parseUserAgent);

module.exports = router;
