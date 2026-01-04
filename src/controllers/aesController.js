const { aesService } = require('../services');
const { sendSuccess, sendError } = require('../utils');
const { HTTP_STATUS } = require('../constants');

async function encrypt(req, res) {
  try {
    const text = req.query.text;
    const key = req.query.key;
    const validation = aesService.validateAesParams(text, key);

    if (!validation.valid) {
      sendError(res, validation.error);
      return;
    }

    const result = aesService.encryptAes(text, key);

    if (!result.success) {
      sendError(res, result.error, HTTP_STATUS.INTERNAL_SERVER_ERROR);
      return;
    }

    sendSuccess(res, result.data);
  } catch (error) {
    sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

async function decrypt(req, res) {
  try {
    const text = req.query.text;
    const key = req.query.key;
    const validation = aesService.validateAesParams(text, key);

    if (!validation.valid) {
      sendError(res, validation.error);
      return;
    }

    const result = aesService.decryptAes(text, key);

    if (!result.success) {
      sendError(res, result.error, HTTP_STATUS.INTERNAL_SERVER_ERROR);
      return;
    }

    sendSuccess(res, result.data);
  } catch (error) {
    sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  encrypt,
  decrypt
};
