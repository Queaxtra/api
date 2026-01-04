const { passwordService } = require('../services');
const { sendSuccess, sendError } = require('../utils');

async function generatePassword(req, res) {
  try {
    const { length, options } = passwordService.parsePasswordOptions(req.query);
    const result = passwordService.createPassword(length, options);

    if (!result.success) {
      sendError(res, result.error);
      return;
    }

    sendSuccess(res, result.data);
  } catch (error) {
    sendError(res, error.message);
  }
}

module.exports = {
  generatePassword
};
