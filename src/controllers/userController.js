const { userService } = require('../services');
const { sendSuccess, sendError } = require('../utils');

async function generateUser(req, res) {
  try {
    const { length, options } = userService.parseUserOptions(req.query);
    const result = userService.generateUser(length, options);

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
  generateUser
};
