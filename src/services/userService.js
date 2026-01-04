const { EMAIL_DOMAINS } = require('../constants');
const {
  generatePassword,
  generateCardNumber,
  generateCVV,
  getCardConfig,
  getRandomElement,
  getRandomInt,
  generateRandomDate
} = require('../utils');

const firstNames = require('../../json/firstName.json');
const lastNames = require('../../json/lastName.json');
const countries = require('../../json/country.json');
const cardTypes = require('../../json/creditCard.json');

function generateEmail(firstName, lastName) {
  const domain = getRandomElement(EMAIL_DOMAINS);
  const randomNumber = getRandomInt(0, 100);

  return `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber}@${domain}`;
}

function generateUser(passwordLength, passwordOptions) {
  try {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const mail = generateEmail(firstName, lastName);
    const country = getRandomElement(countries);
    const password = generatePassword(passwordLength, passwordOptions);
    const balance = getRandomInt(0, 10000);
    const randomCardType = getRandomElement(cardTypes);
    const { month, year, day } = generateRandomDate();
    const cvv = generateCVV();
    const cardConfig = getCardConfig(randomCardType);
    const cardNumber = generateCardNumber(cardConfig.prefix, cardConfig.length);

    const userData = {
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

    return { success: true, data: userData };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function parseUserOptions(query) {
  const length = parseInt(query.length || '12', 10);

  if (isNaN(length)) {
    throw new Error('Password length must be a positive number.');
  }

  if (length <= 0) {
    throw new Error('Password length must be a positive number.');
  }

  return {
    length,
    options: {
      numbers: query.numbers !== 'false',
      lowercase: query.lowercase !== 'false',
      uppercase: query.uppercase !== 'false',
      symbols: query.symbols !== 'false',
      guaranteeInclusion: query.guaranteeInclusion === 'true'
    }
  };
}

module.exports = {
  generateUser,
  parseUserOptions
};
