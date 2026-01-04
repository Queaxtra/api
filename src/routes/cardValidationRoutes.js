const express = require('express');
const router = express.Router();
const { cardValidationController } = require('../controllers');

router.get('/', cardValidationController.validateCard);

module.exports = router;
