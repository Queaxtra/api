const crypto = require('crypto');
const { CARD_CONFIG, CARD_REGEXES } = require('../constants');

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

function generateCVV() {
  return `${crypto.randomInt(100, 1000)}`;
}

function getCardConfig(cardType) {
  const config = CARD_CONFIG[cardType];

  if (!config) {
    return { prefix: '', length: 16 };
  }

  return config;
}

function getCardType(cardNumber, cardTypes) {
  for (const type of cardTypes) {
    if (CARD_REGEXES[type] && CARD_REGEXES[type].test(cardNumber)) {
      return type;
    }
  }

  return 'unknown';
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

  return sum % 10 === 0;
}

module.exports = {
  generateCardNumber,
  generateCVV,
  getCardConfig,
  getCardType,
  luhnCheck
};
