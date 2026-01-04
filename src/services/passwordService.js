const { generatePassword } = require('../utils');

function createPassword(length, options) {
  try {
    const password = generatePassword(length, options);

    return { success: true, data: { password } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function parsePasswordOptions(query) {
  const length = parseInt(query.length || '12', 10);

  if (isNaN(length)) {
    throw new Error('Password length must be a positive number.');
  }

  if (length <= 0) {
    throw new Error('Password length must be a positive number.');
  }

  return {
    length,
    options: {
      numbers: query.numbers !== 'false',
      lowercase: query.lowercase !== 'false',
      uppercase: query.uppercase !== 'false',
      symbols: query.symbols !== 'false',
      guaranteeInclusion: query.guaranteeInclusion === 'true'
    }
  };
}

module.exports = {
  createPassword,
  parsePasswordOptions
};
