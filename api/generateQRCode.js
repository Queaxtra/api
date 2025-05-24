const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

router.get('/', async (req, res) => {
    try {
        const text = req.query.text;
        const size = req.query.size || '200x200';

        if (!text) {
            return res.status(400).send('Bad Request: Text parameter is required.');
        }

        if (size && !/^\d+x\d+$/.test(size)) {
            return res.status(400).send('Bad Request: Size parameter must be in the format WIDTHxHEIGHT.');
        }

        const [width, height] = size.split('x').map(Number);
        const qrCodeImage = await QRCode.toDataURL(text, { width, height });
        res.json({ qrCode: qrCodeImage });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;