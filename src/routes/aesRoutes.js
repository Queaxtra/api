const express = require('express');
const encryptRouter = express.Router();
const decryptRouter = express.Router();
const { aesController } = require('../controllers');

encryptRouter.post('/', aesController.encrypt);
decryptRouter.post('/', aesController.decrypt);

module.exports = {
  encryptRouter,
  decryptRouter
};
