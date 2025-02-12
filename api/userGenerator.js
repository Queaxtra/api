const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const json = {
    firstName: require("../json/firstName.json"),
    lastName: require("../json/lastName.json"),
    country: require("../json/country.json"),
    creditCard: require("../json/creditCard.json")
};

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

function generateCardNumber(prefix, length) {
    const remainingLength = length - prefix.length;
    if (remainingLength <= 0) {
        return prefix.slice(0, length);
    }
    let randomNumber = '';
    for (let i = 0; i < remainingLength; i++) {
        randomNumber += crypto.randomInt(0, 10);
    }
    return prefix + randomNumber;
}

function generateEmail(firstName, lastName) {
    const domains = ["gmail.com", "outlook.com", "yahoo.com"];
    const domain = domains[crypto.randomInt(0, domains.length)];
    const randomNumber = crypto.randomInt(0, 100);
    return `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber}@${domain}`;
}

function generateCVV() {
    return `${crypto.randomInt(100, 1000)}`;
}

function generateDate() {
    const month = crypto.randomInt(1, 13);
    const year = crypto.randomInt(2024, 2044);
    const day = crypto.randomInt(1, 29);
    return { month, year, day };
}
router.get('/', (req, res) => {
    try {
        const passwordLength = parseInt(req.query.length || "12", 10);
        if (isNaN(passwordLength) || passwordLength <= 0) {
            throw new Error("Password length must be a positive number.");
        }
        const numbers = req.query.numbers !== 'false';
        const lowercase = req.query.lowercase !== 'false';
        const uppercase = req.query.uppercase !== 'false';
        const symbols = req.query.symbols !== 'false';
        const guaranteeInclusion = req.query.guaranteeInclusion === 'true';

        const passwordOptions = { numbers, lowercase, uppercase, symbols, guaranteeInclusion };

        const firstName = json.firstName[crypto.randomInt(0, json.firstName.length)];
        const lastName = json.lastName[crypto.randomInt(0, json.lastName.length)];
        const mail = generateEmail(firstName, lastName);
        const country = json.country[crypto.randomInt(0, json.country.length)];
        const password = generatePassword(passwordLength, passwordOptions);
        const balance = crypto.randomInt(0, 10000);
        const randomCardType = json.creditCard[crypto.randomInt(0, json.creditCard.length)];
        const { month, year, day } = generateDate();
        const cvv = generateCVV();

        let cardNumberPrefix;
        let cardNumberLength;

        switch (randomCardType) {
            case "Visa":
                cardNumberPrefix = "4";
                cardNumberLength = 16;
                break;
            case "Mastercard":
                cardNumberPrefix = "5";
                cardNumberLength = 16;
                break;
            case "American Express":
                cardNumberPrefix = "34";
                cardNumberLength = 15;
                break;
            case "Discover":
                cardNumberPrefix = "6";
                cardNumberLength = 16;
                break;
            case "Diners Club":
                cardNumberPrefix = "36";
                cardNumberLength = 14;
                break;
            case "JCB":
                cardNumberPrefix = "35";
                cardNumberLength = 16;
                break;
            case "Maestro":
                cardNumberPrefix = "50";
                cardNumberLength = 19;
                break;
            case "UnionPay":
                cardNumberPrefix = "62";
                cardNumberLength = 19;
                break;
            default:
                cardNumberPrefix = "";
                cardNumberLength = 16;
        }
        const cardNumber = generateCardNumber(cardNumberPrefix, cardNumberLength);

        const response = {
            firstName,
            lastName,
            mail,
            country,
            password,
            card: {
                balance,
                cardNumber,
                cardType: randomCardType,
                month,
                year,
                day,
                cvv
            }
        };
        const formattedJSON = JSON.stringify(response, null, 2);

        res.setHeader('Content-Type', 'application/json');
        res.send(formattedJSON);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;