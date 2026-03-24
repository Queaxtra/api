function createHealthHandlers(config) {
  function healthHandler(req, res) {
    res.status(200).json({
      status: 'ok',
      uptime: Number(process.uptime().toFixed(2)),
      env: config.app.env
    });
  }

  function readinessHandler(req, res) {
    res.status(200).json({
      status: 'ready',
      apiKeyProtection: config.security.requireApiKey,
      corsConfigured: config.security.corsOrigins.length > 0 || !config.app.isProduction
    });
  }

  return {
    healthHandler,
    readinessHandler
  };
}

module.exports = {
  createHealthHandlers
};
