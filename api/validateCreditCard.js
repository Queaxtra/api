const express = require('express');
const router = express.Router();
const cardTypes = require('../json/creditCard.json');

function getCardType(cardNumber) {
    const cardRegexes = {
        "Visa": /^4[0-9]{12}(?:[0-9]{3})?$/,
        "MasterCard": /^5[1-5][0-9]{14}$/,
        "American Express": /^3[47][0-9]{13}$/,
        "Discover": /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        "Diners Club": /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        "JCB": /^(?:2131|1800|35\d{3})\d{11}$/,
        "UnionPay": /^(62|88)\d{14,17}$/,
        "Maestro": /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d{8,15}$/

    };

    for (const type of cardTypes) {
        if (cardRegexes[type] && cardRegexes[type].test(cardNumber)) {
            return type;
        }
    }
    return "unknown";
}

function luhnCheck(cardNumber) {
    let sum = 0;
    let alt = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let n = parseInt(cardNumber.substring(i, i + 1));
        if (alt) {
            n *= 2;
            if (n > 9) {
                n = (n % 10) + 1;
            }
        }
        sum += n;
        alt = !alt;
    }
    return (sum % 10) == 0;
}

router.get('/', (req, res) => {
    const cardNumber = req.query.cardNumber;

    if (!cardNumber) {
        return res.status(400).json({ error: 'Credit card number is required. Please make a request like /api/validate/card?cardNumber=1234567890123456' });
    }

    const cleanedCardNumber = cardNumber.replace(/\D/g, '');
    const cardType = getCardType(cleanedCardNumber);
    const isValid = luhnCheck(cleanedCardNumber);

    const response = {
        card_number: cleanedCardNumber,
        card_type: cardType,
        is_valid: isValid
    };

    res.json(response);
});

module.exports = router;