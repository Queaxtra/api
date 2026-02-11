const { userAgentService } = require('../services');
const { sendSuccess, sendError } = require('../utils');

function parseUserAgent(req, res) {
  try {
    const userAgentString = req.query.ua || req.headers['user-agent'];
    const result = userAgentService.parseUserAgent(userAgentString);

    if (!result.valid) {
      sendError(res, result.error);
      return;
    }

    sendSuccess(res, result.data);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

module.exports = {
  parseUserAgent
};
