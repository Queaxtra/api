const express = require('express');
const router = express.Router();
const { youtubeController } = require('../controllers');

router.get('/', youtubeController.downloadAudio);

module.exports = router;
