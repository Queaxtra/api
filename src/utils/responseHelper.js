const { HTTP_STATUS } = require('../constants');

function sendSuccess(res, data) {
  res.status(HTTP_STATUS.OK).json(data);
}

function sendError(res, message, statusCode = HTTP_STATUS.BAD_REQUEST) {
  res.status(statusCode).json({
    error: message,
    requestId: res.getHeader('X-Request-Id')
  });
}

module.exports = {
  sendSuccess,
  sendError
};
