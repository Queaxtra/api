const CryptoJS = require('crypto-js');

function validateAesParams(text, key) {
  if (!text || !key) {
    return { valid: false, error: 'Bad Request: Text and key are required.' };
  }

  if (String(text).length > 8192) {
    return { valid: false, error: 'Bad Request: Text is too long.' };
  }

  if (String(key).length < 16 || String(key).length > 128) {
    return { valid: false, error: 'Bad Request: Key length must be between 16 and 128 characters.' };
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
