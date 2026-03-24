const cors = require('cors');

function setupCors(app, config) {
  const allowedOrigins = config.security.corsOrigins;
  const origin = allowedOrigins.length === 0
    ? '*'
    : function resolveOrigin(requestOrigin, callback) {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin is not allowed.'));
    };

  app.use(cors({
    origin,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'X-Request-Id']
  }));
}

module.exports = { setupCors };
