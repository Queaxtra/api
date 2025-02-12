const express = require('express');
const router = express.Router();
const ipapi = require('ipapi.co');

router.get('/', (req, res) => {
    const ipAddress = req.query.ip;

    if (!ipAddress) {
        return res.status(400).json({ error: 'IP address is required. Please make a request like /api/ip?ip=8.8.8.8' });
    }

    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
        return res.status(400).json({ error: 'Invalid IP address format.' });
    }

    ipapi.location((data) => {
        const responseData = {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country_name,
            country_code: data.country_code,
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.timezone,
            organization: data.org,
            postal_code: data.postal,
            currency: data.currency,
            currency_name: data.currency_name,
            language: data.languages,
            country_population: data.country_population.toLocaleString()
        };

        res.json(responseData);
    }, ipAddress);
});

module.exports = router;