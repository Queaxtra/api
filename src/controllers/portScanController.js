const { portScanService } = require('../services');
const { sendSuccess, sendError } = require('../utils');

// handles http requests for tcp port scanning
// validates all input parameters before initiating scan operation
// returns formatted json response with scan results or error details
async function scanPorts(req, res) {
  try {
    const { host, startPort, endPort, ports, timeout } = req.query;
    const hostValidation = portScanService.validateHost(host);

    if (!hostValidation.valid) {
      sendError(res, hostValidation.error);
      return;
    }

    const portValidation = portScanService.validatePorts(startPort, endPort, ports);

    if (!portValidation.valid) {
      sendError(res, portValidation.error);
      return;
    }

    // parse and validate timeout parameter
    // reasonable range: 500ms (fast) to 10000ms (slow networks)
    const timeoutMs = timeout ? parseInt(timeout, 10) : 2000;

    if (isNaN(timeoutMs) || timeoutMs < 500 || timeoutMs > 10000) {
      sendError(res, 'invalid timeout. must be between 500ms and 10000ms.');
      return;
    }

    const result = await portScanService.scanPorts(host, portValidation, timeoutMs);

    if (!result.success) {
      sendError(res, result.error, 500);
      return;
    }

    sendSuccess(res, result.data);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

module.exports = {
  scanPorts
};
