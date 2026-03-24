function createMemoryCache({ ttlMs, maxEntries = 100 } = {}) {
  const store = new Map();

  function get(key) {
    const entry = store.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      store.delete(key);
      return null;
    }

    return entry.value;
  }

  function set(key, value) {
    if (store.size >= maxEntries) {
      const oldestKey = store.keys().next().value;
      store.delete(oldestKey);
    }

    store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs
    });
  }

  return { get, set };
}

module.exports = { createMemoryCache };
