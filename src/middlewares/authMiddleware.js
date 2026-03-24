const crypto = require('node:crypto');

function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function createApiKeyMiddleware({ enabled, apiKeys }) {
  return function requireApiKey(req, res, next) {
    if (!enabled) {
      next();
      return;
    }

    const providedKey = req.headers['x-api-key'];

    if (!providedKey) {
      res.status(401).json({ error: 'API key is required.' });
      return;
    }

    const isAuthorized = apiKeys.some((apiKey) => safeEqual(apiKey, providedKey));

    if (!isAuthorized) {
      res.status(403).json({ error: 'Invalid API key.' });
      return;
    }

    next();
  };
}

module.exports = {
  createApiKeyMiddleware
};
