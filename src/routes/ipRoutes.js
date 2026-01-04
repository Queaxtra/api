const express = require('express');
const router = express.Router();
const { ipController } = require('../controllers');

router.get('/', ipController.getIpInfo);

module.exports = router;
