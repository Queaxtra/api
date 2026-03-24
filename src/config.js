function parsePositiveInt(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid numeric configuration value: ${value}`);
  }

  return parsed;
}

function parseList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';
  const corsOrigins = parseList(env.CORS_ORIGINS);

  const config = {
    app: {
      env: nodeEnv,
      isProduction,
      port: parsePositiveInt(env.PORT, 3000),
      host: env.HOST || '0.0.0.0',
      shutdownTimeoutMs: parsePositiveInt(env.SHUTDOWN_TIMEOUT_MS, 10000)
    },
    http: {
      bodyLimit: env.BODY_LIMIT || '16kb',
      requestTimeoutMs: parsePositiveInt(env.REQUEST_TIMEOUT_MS, 15000),
      headersTimeoutMs: parsePositiveInt(env.HEADERS_TIMEOUT_MS, 16000),
      keepAliveTimeoutMs: parsePositiveInt(env.KEEP_ALIVE_TIMEOUT_MS, 5000)
    },
    security: {
      corsOrigins,
      expensiveRouteLimit: parsePositiveInt(env.EXPENSIVE_ROUTE_LIMIT, 20),
      expensiveRouteWindowMs: parsePositiveInt(env.EXPENSIVE_ROUTE_WINDOW_MS, 60 * 1000)
    }
  };

  validateConfig(config);
  return config;
}

function validateConfig(config) {
  if (config.app.isProduction && config.security.corsOrigins.length === 0) {
    throw new Error('CORS_ORIGINS must be configured in production.');
  }

  if (config.http.headersTimeoutMs <= config.http.keepAliveTimeoutMs) {
    throw new Error('HEADERS_TIMEOUT_MS must be greater than KEEP_ALIVE_TIMEOUT_MS.');
  }
}

module.exports = {
  getConfig
};
