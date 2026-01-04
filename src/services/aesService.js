const CryptoJS = require('crypto-js');

function validateAesParams(text, key) {
  if (!text || !key) {
    return { valid: false, error: 'Bad Request: Text and key are required.' };
  }

  return { valid: true };
}

function encryptAes(text, key) {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, key).toString();

    return { success: true, data: { encrypted } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function decryptAes(text, key) {
  try {
    const decrypted = CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);

    return { success: true, data: { decrypted } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  validateAesParams,
  encryptAes,
  decryptAes
};
