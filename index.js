require('dotenv').config();
const { createApp } = require('./src/app');
const { getConfig } = require('./src/config');
const logger = require('./src/utils/logger');

const config = getConfig();
const app = createApp(config);
const server = app.listen(config.app.port, config.app.host, () => {
  logger.info('server.started', {
    port: config.app.port,
    host: config.app.host,
    env: config.app.env
  });
});

server.requestTimeout = config.http.requestTimeoutMs;
server.headersTimeout = config.http.headersTimeoutMs;
server.keepAliveTimeout = config.http.keepAliveTimeoutMs;

function shutdown(signal) {
  logger.info('server.shutdown.started', { signal });

  const forceCloseTimer = setTimeout(() => {
    logger.error('server.shutdown.timeout', { signal });
    process.exit(1);
  }, config.app.shutdownTimeoutMs);

  server.close((error) => {
    clearTimeout(forceCloseTimer);

    if (error) {
      logger.error('server.shutdown.failed', { signal, message: error.message });
      process.exit(1);
      return;
    }

    logger.info('server.shutdown.completed', { signal });
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
