const { dnsService } = require('../services');
const { sendSuccess, sendError } = require('../utils');

async function lookupDns(req, res) {
  try {
    const { domain, type } = req.query;

    const domainValidation = dnsService.validateDomain(domain);

    if (!domainValidation.valid) {
      sendError(res, domainValidation.error);
      return;
    }

    const typeValidation = dnsService.validateRecordType(type);

    if (!typeValidation.valid) {
      sendError(res, typeValidation.error);
      return;
    }

    const result = await dnsService.lookupDns(domainValidation.cleanDomain, typeValidation.type);

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
  lookupDns
};
