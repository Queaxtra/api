const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const passRequirements = {
    numbers: "0123456789",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    symbols: "!@#$%^&*()_+-=~`[]{}|;:,./<>?"
};

function generatePassword() {
    const passwordLength = 12;
    const allChars = passRequirements.numbers + passRequirements.lowercase + passRequirements.uppercase + passRequirements.symbols;
    const allCharsLength = allChars.length;
    let password = Array.from(crypto.randomBytes(passwordLength)).map((byte) => allChars[byte % allCharsLength]).join('');
    return password;
}

router.get('/', (req, res) => {
    const password = generatePassword();
    const formattedJSON = JSON.stringify({ "Password": password }, null, 2);

    res.setHeader('Content-Type', 'application/json');
    res.send(formattedJSON);
});

module.exports = router;