const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const characterSets = {
    numbers: "0123456789",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    symbols: "!@#$%^&*()_+-=~`[]{}|;:,./<>?"
};

function generatePassword(length, options) {
    const { numbers = true, lowercase = true, uppercase = true, symbols = true, guaranteeInclusion = false } = options;

    if (typeof length !== 'number' || length <= 0) {
        throw new Error("Password length must be a positive number.");
    }

    let allowedChars = "";
    const includedSets = [];

    if (numbers) {
        allowedChars += characterSets.numbers;
        includedSets.push(characterSets.numbers);
    }
    if (lowercase) {
        allowedChars += characterSets.lowercase;
        includedSets.push(characterSets.lowercase);
    }
    if (uppercase) {
        allowedChars += characterSets.uppercase;
        includedSets.push(characterSets.uppercase);
    }
    if (symbols) {
        allowedChars += characterSets.symbols;
        includedSets.push(characterSets.symbols);
    }

    if (allowedChars.length === 0) {
        throw new Error("At least one character set must be selected.");
    }

    let password = "";

    if (guaranteeInclusion) {
        for (const set of includedSets) {
            const randomIndex = crypto.randomInt(0, set.length);
            password += set[randomIndex];
        }

        for (let i = password.length; i < length; i++) {
            const randomIndex = crypto.randomInt(0, allowedChars.length);
            password += allowedChars[randomIndex];
        }

        password = password.split('').sort(() => 0.5 - crypto.randomInt(0, 2)).join('');

    } else {
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, allowedChars.length);
            password += allowedChars[randomIndex];
        }
    }

    return password;
}

router.get('/', (req, res) => {
    try {
        const length = parseInt(req.query.length || "12", 10);
        if (isNaN(length) || length <= 0) {
            throw new Error("Password length must be a positive number.");
        }
        const numbers = req.query.numbers !== 'false';
        const lowercase = req.query.lowercase !== 'false';
        const uppercase = req.query.uppercase !== 'false';
        const symbols = req.query.symbols !== 'false';
        const guaranteeInclusion = req.query.guaranteeInclusion === 'true';

        const options = { numbers, lowercase, uppercase, symbols, guaranteeInclusion };
        const password = generatePassword(length, options);

        const formattedJSON = JSON.stringify({ "password": password }, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.send(formattedJSON);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;