const { ipService } = require('../services');
const { sendSuccess, sendError } = require('../utils');

async function getIpInfo(req, res) {
  try {
    const ipAddress = req.query.ip;
    const validation = ipService.validateIpAddress(ipAddress);

    if (!validation.valid) {
      sendError(res, validation.error);
      return;
    }

    const result = await ipService.getIpInfo(ipAddress);

    if (!result.success) {
      sendError(res, result.error, 500);
      return;
    }

    sendSuccess(res, result.data);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

module.exports = {
  getIpInfo
};
