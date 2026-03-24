const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error('request.failed', {
    requestId: req.requestId,
    message: err.message,
    path: req.path,
    method: req.method
  });

  if (err.message === 'CORS origin is not allowed.') {
    res.status(HTTP_STATUS.FORBIDDEN).json({
      error: err.message,
      requestId: req.requestId
    });
    return;
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: 'Internal Server Error',
    requestId: req.requestId
  });
}

function notFoundHandler(req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: 'Route not found',
    requestId: req.requestId
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
