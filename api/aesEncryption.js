const express = require('express');
const router = express.Router();
const crypto = require('crypto-js');

router.get('/', (req, res) => {
    const text = req.query.text;
    const key = req.query.key;

    if (!text || !key) {
        return res.status(400).send('Bad Request: Text and key are required.');
    }

    const encrypted = crypto.AES.encrypt(text, key).toString();
    res.json({ encrypted });
});

module.exports = router;