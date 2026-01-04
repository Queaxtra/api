const { HTTP_STATUS } = require('../constants');

function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: err.message || 'Internal Server Error'
  });
}

function notFoundHandler(req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: 'Route not found'
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
