function log(level, message, metadata = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata
  };

  const serialized = JSON.stringify(entry);

  if (level === 'error' || level === 'warn') {
    console.error(serialized);
    return;
  }

  console.log(serialized);
}

module.exports = {
  info: (message, metadata) => log('info', message, metadata),
  warn: (message, metadata) => log('warn', message, metadata),
  error: (message, metadata) => log('error', message, metadata)
};
