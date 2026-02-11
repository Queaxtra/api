const { colorService } = require('../services');
const { sendSuccess, sendError } = require('../utils');

async function convertColor(req, res) {
  try {
    const { from } = req.query;

    if (!from) {
      sendError(res, 'from parameter is required. use hex, rgb, hsl, or cmyk');
      return;
    }

    const validFormats = ['hex', 'rgb', 'hsl', 'cmyk'];

    if (!validFormats.includes(from.toLowerCase())) {
      sendError(res, 'invalid from parameter. use hex, rgb, hsl, or cmyk');
      return;
    }

    const input = { from: from.toLowerCase() };

    if (input.from === 'hex') {
      input.hex = req.query.hex;
    }

    if (input.from === 'rgb') {
      input.r = req.query.r;
      input.g = req.query.g;
      input.b = req.query.b;
    }

    if (input.from === 'hsl') {
      input.h = req.query.h;
      input.s = req.query.s;
      input.l = req.query.l;
    }

    if (input.from === 'cmyk') {
      input.c = req.query.c;
      input.m = req.query.m;
      input.y = req.query.y;
      input.k = req.query.k;
    }

    const result = colorService.convertColor(input);

    if (!result.success) {
      sendError(res, result.error);
      return;
    }

    sendSuccess(res, result.data);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

module.exports = {
  convertColor
};
