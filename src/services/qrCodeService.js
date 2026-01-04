const QRCode = require('qrcode');

const SIZE_REGEX = /^\d+x\d+$/;

function validateQrCodeParams(text, size) {
  if (!text) {
    return { valid: false, error: 'Bad Request: Text parameter is required.' };
  }

  if (size && !SIZE_REGEX.test(size)) {
    return { valid: false, error: 'Bad Request: Size parameter must be in the format WIDTHxHEIGHT.' };
  }

  return { valid: true };
}

async function generateQrCode(text, size = '200x200') {
  try {
    const [width, height] = size.split('x').map(Number);
    const qrCodeImage = await QRCode.toDataURL(text, { width, height });

    return { success: true, data: { qrCode: qrCodeImage } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  validateQrCodeParams,
  generateQrCode
};
