const express = require('express');
const router = express.Router();
const { portScanController } = require('../controllers');

router.get('/', portScanController.scanPorts);

module.exports = router;
