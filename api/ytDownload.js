const express = require('express');
const router = express.Router();
const ytdl = require("@distube/ytdl-core");

router.get('/', async (req, res) => {
    try {
        const URL = req.query.url;
        const title = req.query.title;
        
        if (!URL || !title) {
            return res.status(400).send('Bad Request: URL and title are required.');
        }

        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);

        const videoInfo = await ytdl.getInfo(URL);
        const formats = ytdl.filterFormats(videoInfo.formats, 'audio');

        if (formats.length === 0) {
            return res.status(400).send('Bad Request: No suitable formats found.');
        }

        const videoStream = ytdl(URL, { format: formats[0].format });

        videoStream.on('error', (err) => {
            console.error('Stream Error:', err);
            
            if (!res.headersSent) {
                res.status(500).send('Error during video stream.');
            }

            res.end();
        });

        videoStream.pipe(res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;