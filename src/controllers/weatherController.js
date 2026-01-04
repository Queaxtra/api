const { weatherService } = require('../services');
const { sendSuccess, sendError } = require('../utils');
const { HTTP_STATUS } = require('../constants');

async function getWeather(req, res) {
  try {
    const city = req.query.city;
    const validation = weatherService.validateCity(city);

    if (!validation.valid) {
      sendError(res, validation.error);
      return;
    }

    const result = await weatherService.getWeather(city);

    if (!result.success) {
      if (result.notFound) {
        sendError(res, result.error, HTTP_STATUS.NOT_FOUND);
        return;
      }

      sendError(res, result.error, HTTP_STATUS.INTERNAL_SERVER_ERROR);
      return;
    }

    sendSuccess(res, result.data);
  } catch (error) {
    sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  getWeather
};
