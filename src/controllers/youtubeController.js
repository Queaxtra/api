const { youtubeService } = require('../services');
const { HTTP_STATUS } = require('../constants');
const { sanitizeDownloadFilename } = require('../utils');

async function downloadAudio(req, res) {
  try {
    const url = req.query.url;
    const title = req.query.title;
    const validation = youtubeService.validateDownloadParams(url, title);

    if (!validation.valid) {
      res.status(HTTP_STATUS.BAD_REQUEST).send(validation.error);
      return;
    }

    const result = await youtubeService.getAudioStream(url);

    if (!result.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).send(result.error);
      return;
    }

    const safeFilename = sanitizeDownloadFilename(title);
    res.header('Content-Disposition', `attachment; filename="${safeFilename}.mp3"`);
    res.type('audio/mpeg');

    result.stream.on('error', (err) => {
      console.error('Stream Error:', err);

      if (!res.headersSent) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Error during video stream.');
      }

      res.end();
    });

    result.stream.pipe(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Internal Server Error');
  }
}

module.exports = {
  downloadAudio
};
