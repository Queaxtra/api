const { getCardType, luhnCheck } = require('../utils');

const cardTypes = require('../../json/creditCard.json');

function validateCardParams(cardNumber) {
  if (!cardNumber) {
    return {
      valid: false,
      error: 'Credit card number is required. Please make a request like /api/validate/card?cardNumber=1234567890123456'
    };
  }

  return { valid: true };
}

function validateCreditCard(cardNumber) {
  try {
    const cleanedCardNumber = cardNumber.replace(/\D/g, '');
    const cardType = getCardType(cleanedCardNumber, cardTypes);
    const isValid = luhnCheck(cleanedCardNumber);

    const response = {
      card_number: cleanedCardNumber,
      card_type: cardType,
      is_valid: isValid
    };

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  validateCardParams,
  validateCreditCard
};
