const passwordRoutes = require('./passwordRoutes');
const userRoutes = require('./userRoutes');
const ipRoutes = require('./ipRoutes');
const weatherRoutes = require('./weatherRoutes');
const qrCodeRoutes = require('./qrCodeRoutes');
const { encryptRouter, decryptRouter } = require('./aesRoutes');
const cardValidationRoutes = require('./cardValidationRoutes');
const youtubeRoutes = require('./youtubeRoutes');
const dnsRoutes = require('./dnsRoutes');
const portScanRoutes = require('./portScanRoutes');

module.exports = {
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
};
