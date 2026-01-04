const express = require('express');
const router = express.Router();
const { qrCodeController } = require('../controllers');

router.get('/', qrCodeController.generateQrCode);

module.exports = router;
