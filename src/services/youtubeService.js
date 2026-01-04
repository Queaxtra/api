const ytdl = require('@distube/ytdl-core');

function validateDownloadParams(url, title) {
  if (!url || !title) {
    return { valid: false, error: 'Bad Request: URL and title are required.' };
  }

  return { valid: true };
}

async function getAudioStream(url) {
  try {
    const videoInfo = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(videoInfo.formats, 'audio');

    if (formats.length === 0) {
      return { success: false, error: 'Bad Request: No suitable formats found.' };
    }

    const stream = ytdl(url, { format: formats[0].format });

    return { success: true, stream };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  validateDownloadParams,
  getAudioStream
};
