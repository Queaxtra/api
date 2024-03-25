const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const jsonResponse = {
        "message": "Welcome to the API",
        "endpoints": {
            "userGenerator": "/api/userGenerator",
            "generatePassword": "/api/generatePassword",
            "ytDownload": "/api/download?url=&title=",
        }
    };

    const formattedJSON = JSON.stringify(jsonResponse, null, 2);
    
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedJSON);
});

module.exports = router;
