const express = require('express');
const encryptRouter = express.Router();
const decryptRouter = express.Router();
const { aesController } = require('../controllers');

encryptRouter.get('/', aesController.encrypt);
decryptRouter.get('/', aesController.decrypt);

module.exports = {
  encryptRouter,
  decryptRouter
};
