const express = require('express');
const router = express.Router();
const randomBytes = require("randombytes");
const json = {
    firstName: require("../json/firstName.json"),
    lastName: require("../json/lastName.json"),
    country: require("../json/country.json"),
    creditCard: require("../json/creditCard.json")
};
const passRequirements = {
    numbers: "0123456789",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    symbols: "!@#$%^&*()_+-=~`[]{}|;:,./<>?"
};

function generatePassword() {
    const passwordLength = 12;
    let password = "";
    const allChars = passRequirements.numbers + passRequirements.lowercase + passRequirements.uppercase + passRequirements.symbols;
    const allCharsLength = allChars.length;

    for (let i = 0; i < passwordLength; i++) {
        password += allChars[randomBytes(1)[0] % allCharsLength];
    }

    return password;
}

function generateCardNumber(prefix) {
    return prefix + Math.floor(Math.random() * 1000000000000000);
}

router.get('/', (req, res) => {
    const firstName = json.firstName[Math.floor(Math.random() * json.firstName.length)];
    const lastName = json.lastName[Math.floor(Math.random() * json.lastName.length)];
    const mail = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${["gmail.com", "outlook.com", "yahoo.com"][Math.floor(Math.random() * 3)]}`;
    const country = json.country[Math.floor(Math.random() * json.country.length)];
    const password = generatePassword();
    const balance = Math.floor(Math.random() * 10000);
    const randomCardType = json.creditCard[Math.floor(Math.random() * json.creditCard.length)];
    const month = Math.floor(Math.random() * 12) + 1;
    const year = Math.floor(Math.random() * 20) + 2021;
    const day = Math.floor(Math.random() * 28) + 1;
    const cvv = Math.floor(Math.random() * 900) + 100;

    let cardNumberPrefix;
    switch (randomCardType) {
        case "Visa":
            cardNumberPrefix = "4";
            break;
        case "Mastercard":
            cardNumberPrefix = "5";
            break;
        case "American Express":
            cardNumberPrefix = "3";
            break;
        case "Discover":
            cardNumberPrefix = "6";
            break;
        case "Diners Club":
        case "JCB":
            cardNumberPrefix = "3";
            break;
        case "Maestro":
            cardNumberPrefix = "5";
            break;
        case "UnionPay":
            cardNumberPrefix = "6";
            break;
        default:
            cardNumberPrefix = "";
    }

    const cardNumber = generateCardNumber(cardNumberPrefix);

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
});

module.exports = router;
