const express = require('express');
const router = express.Router();
const { dnsController } = require('../controllers');

router.get('/', dnsController.lookupDns);

module.exports = router;
