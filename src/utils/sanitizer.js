const INVALID_FILENAME_CHARS = /[^\w.-]+/g;

function sanitizeDownloadFilename(input, fallback = 'audio') {
  const normalized = String(input || '')
    .replace(/[\r\n"]/g, ' ')
    .trim()
    .replace(INVALID_FILENAME_CHARS, '_')
    .replace(/_+/g, '_');

  return normalized || fallback;
}

module.exports = {
  sanitizeDownloadFilename
};
