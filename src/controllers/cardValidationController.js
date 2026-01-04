const { cardValidationService } = require('../services');
const { sendSuccess, sendError } = require('../utils');

async function validateCard(req, res) {
  try {
    const cardNumber = req.query.cardNumber;
    const validation = cardValidationService.validateCardParams(cardNumber);

    if (!validation.valid) {
      sendError(res, validation.error);
      return;
    }

    const result = cardValidationService.validateCreditCard(cardNumber);

    if (!result.success) {
      sendError(res, result.error);
      return;
    }

    sendSuccess(res, result.data);
  } catch (error) {
    sendError(res, error.message);
  }
}

module.exports = {
  validateCard
};
