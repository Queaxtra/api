const cors = require('cors');
const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const api = {
    generatePassword: require('./api/generatePassword'),
    userGenerator: require('./api/userGenerator'),
    ytDownload: require('./api/ytDownload'),
    ip: require('./api/ip'),
    weather: require('./api/weather'),
    validateCreditCard: require('./api/validateCreditCard'),
    generateQRCode: require('./api/generateQRCode'),
    aesEncryption: require('./api/aesEncryption'),
    aesDecryption: require('./api/aesDecryption'),
};

app.use(cors());
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.use('/api/generate/password', api.generatePassword);
app.use('/api/generate/user', api.userGenerator);
app.use('/api/yt/download', api.ytDownload);
app.use('/api/ip', api.ip);
app.use('/api/weather', api.weather);
app.use('/api/validate/card', api.validateCreditCard);
app.use('/api/generate/qrcode', api.generateQRCode);
app.use('/api/aes/encrypt', api.aesEncryption);
app.use('/api/aes/decrypt', api.aesDecryption);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});