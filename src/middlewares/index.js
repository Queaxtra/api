const { setupCors } = require('./corsMiddleware');
const { errorHandler, notFoundHandler } = require('./errorHandler');

module.exports = {
  setupCors,
  errorHandler,
  notFoundHandler
};
