const express = require('express');
const app = express();
const api = {
    home: require('./api/home'),
    userGenerator: require('./api/userGenerator'),
    generatePassword: require('./api/generatePassword'),
    ytDownload: require('./api/ytDownload')
};

app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.get('/', api.home);
app.use('/api/userGenerator', api.userGenerator);
app.use('/api/generatePassword', api.generatePassword);
app.use('/api/download', api.ytDownload);

app.listen(3000, () => {
    console.log('Server is running!');
});