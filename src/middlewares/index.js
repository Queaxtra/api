const { setupCors } = require('./corsMiddleware');
const { errorHandler, notFoundHandler } = require('./errorHandler');
const { applySecurityHeaders, createRateLimiter } = require('./securityMiddleware');
const { attachRequestContext, requestLogger } = require('./requestContextMiddleware');
const { createHealthHandlers } = require('./healthMiddleware');

module.exports = {
  setupCors,
  applySecurityHeaders,
  createRateLimiter,
  attachRequestContext,
  requestLogger,
  createHealthHandlers,
  errorHandler,
  notFoundHandler
};
