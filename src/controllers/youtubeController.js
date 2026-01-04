const { youtubeService } = require('../services');
const { HTTP_STATUS } = require('../constants');

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

    res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);

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
