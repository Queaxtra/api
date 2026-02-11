const express = require('express');
const { setupCors, errorHandler, notFoundHandler } = require('./middlewares');
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
  portScanRoutes
} = require('./routes');

function createApp() {
  const app = express();

  app.set('trust proxy', true);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  setupCors(app);

  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
  });

  app.use('/api/generate/password', passwordRoutes);
  app.use('/api/generate/user', userRoutes);
  app.use('/api/yt/download', youtubeRoutes);
  app.use('/api/ip', ipRoutes);
  app.use('/api/weather', weatherRoutes);
  app.use('/api/validate/card', cardValidationRoutes);
  app.use('/api/generate/qrcode', qrCodeRoutes);
  app.use('/api/aes/encrypt', encryptRouter);
  app.use('/api/aes/decrypt', decryptRouter);
  app.use('/api/dns', dnsRoutes);
  app.use('/api/scan/port', portScanRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
