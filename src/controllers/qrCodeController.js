const { qrCodeService } = require('../services');
const { sendSuccess, sendError } = require('../utils');
const { HTTP_STATUS } = require('../constants');

async function generateQrCode(req, res) {
  try {
    const text = req.query.text;
    const size = req.query.size || '200x200';
    const validation = qrCodeService.validateQrCodeParams(text, size);

    if (!validation.valid) {
      sendError(res, validation.error);
      return;
    }

    const result = await qrCodeService.generateQrCode(text, size);

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
  generateQrCode
};
