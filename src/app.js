const express = require('express');
const { getConfig } = require('./config');
const {
  setupCors,
  applySecurityHeaders,
  createRateLimiter,
  attachRequestContext,
  requestLogger,
  createApiKeyMiddleware,
  createHealthHandlers,
  errorHandler,
  notFoundHandler
} = require('./middlewares');
const {
  passwordRoutes,
  userRoutes,
  ipRoutes,
  weatherRoutes,
  qrCodeRoutes,
  encryptRouter,
  decryptRouter,
  cardValidationRoutes,
  youtubeRoutes,
  dnsRoutes,
  portScanRoutes,
  colorRoutes,
  userAgentRoutes
} = require('./routes');

function createApp(config = getConfig()) {
  const app = express();
  const expensiveRouteLimiter = createRateLimiter({
    windowMs: config.security.expensiveRouteWindowMs,
    max: config.security.expensiveRouteLimit
  });
  const requireApiKey = createApiKeyMiddleware({
    enabled: config.security.requireApiKey,
    apiKeys: config.security.apiKeys
  });
  const { healthHandler, readinessHandler } = createHealthHandlers(config);

  app.set('trust proxy', true);
  app.disable('x-powered-by');
  app.use(express.urlencoded({ extended: false, limit: config.http.bodyLimit }));
  app.use(express.json({ limit: config.http.bodyLimit }));

  app.use(attachRequestContext);
  app.use(requestLogger);
  app.use(applySecurityHeaders);
  setupCors(app, config);

  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
  });
  app.get('/health', healthHandler);
  app.get('/ready', readinessHandler);

  app.use('/api/generate/password', passwordRoutes);
  app.use('/api/generate/user', userRoutes);
  app.use('/api/yt/download', requireApiKey, expensiveRouteLimiter, youtubeRoutes);
  app.use('/api/ip', requireApiKey, expensiveRouteLimiter, ipRoutes);
  app.use('/api/weather', requireApiKey, expensiveRouteLimiter, weatherRoutes);
  app.use('/api/validate/card', cardValidationRoutes);
  app.use('/api/generate/qrcode', requireApiKey, expensiveRouteLimiter, qrCodeRoutes);
  app.use('/api/aes/encrypt', requireApiKey, expensiveRouteLimiter, encryptRouter);
  app.use('/api/aes/decrypt', requireApiKey, expensiveRouteLimiter, decryptRouter);
  app.use('/api/dns', requireApiKey, expensiveRouteLimiter, dnsRoutes);
  app.use('/api/scan/port', requireApiKey, expensiveRouteLimiter, portScanRoutes);
  app.use('/api/color/convert', colorRoutes);
  app.use('/api/parse/useragent', userAgentRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
