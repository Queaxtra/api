const express = require('express');
const router = express.Router();
const { passwordController } = require('../controllers');

router.get('/', passwordController.generatePassword);

module.exports = router;
