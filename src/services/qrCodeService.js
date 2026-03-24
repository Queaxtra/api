const QRCode = require('qrcode');

const SIZE_REGEX = /^\d+x\d+$/;
const MAX_QR_DIMENSION = 1024;
const MAX_QR_TEXT_LENGTH = 2048;

function validateQrCodeParams(text, size) {
  if (!text) {
    return { valid: false, error: 'Bad Request: Text parameter is required.' };
  }

  if (text.length > MAX_QR_TEXT_LENGTH) {
    return { valid: false, error: 'Bad Request: Text parameter is too long.' };
  }

  if (size && !SIZE_REGEX.test(size)) {
    return { valid: false, error: 'Bad Request: Size parameter must be in the format WIDTHxHEIGHT.' };
  }

  if (size) {
    const [width, height] = size.split('x').map(Number);

    if (width < 64 || height < 64 || width > MAX_QR_DIMENSION || height > MAX_QR_DIMENSION) {
      return { valid: false, error: 'Bad Request: Width and height must be between 64 and 1024.' };
    }
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
