const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_MAX_BYTES = 1024 * 1024;

async function readStreamWithLimit(stream, maxBytes) {
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of stream) {
    totalBytes += chunk.length;

    if (totalBytes > maxBytes) {
      throw new Error('Upstream response exceeded the allowed size.');
    }

    chunks.push(chunk);
  }

  return Buffer.concat(chunks, totalBytes).toString('utf8');
}

async function fetchJson(fetchImpl, url, {
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxBytes = DEFAULT_MAX_BYTES,
  ...options
} = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      ...options,
      signal: controller.signal
    });

    const contentLength = Number(response.headers.get('content-length'));

    if (Number.isFinite(contentLength) && contentLength > maxBytes) {
      throw new Error('Upstream response exceeded the allowed size.');
    }

    const bodyText = response.body
      ? await readStreamWithLimit(response.body, maxBytes)
      : await response.text();

    let parsedBody = null;

    if (bodyText) {
      parsedBody = JSON.parse(bodyText);
    }

    return { response, data: parsedBody };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Upstream request timed out.');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  fetchJson
};
