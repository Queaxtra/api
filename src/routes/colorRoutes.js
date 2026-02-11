const express = require('express');
const router = express.Router();
const { colorController } = require('../controllers');

router.get('/', colorController.convertColor);

module.exports = router;
