const { HTTP_STATUS } = require('../constants');

function sendSuccess(res, data) {
  const formattedJSON = JSON.stringify(data, null, 2);

  res.setHeader('Content-Type', 'application/json');
  res.status(HTTP_STATUS.OK).send(formattedJSON);
}

function sendError(res, message, statusCode = HTTP_STATUS.BAD_REQUEST) {
  res.status(statusCode).json({ error: message });
}

module.exports = {
  sendSuccess,
  sendError
};
