const crypto = require('crypto');
const { CHARACTER_SETS } = require('../constants');

function generatePassword(length, options = {}) {
  const {
    numbers = true,
    lowercase = true,
    uppercase = true,
    symbols = true,
    guaranteeInclusion = false
  } = options;

  if (typeof length !== 'number') {
    throw new Error('Password length must be a positive number.');
  }

  if (length <= 0) {
    throw new Error('Password length must be a positive number.');
  }

  let allowedChars = '';
  const includedSets = [];

  if (numbers) {
    allowedChars += CHARACTER_SETS.numbers;
    includedSets.push(CHARACTER_SETS.numbers);
  }

  if (lowercase) {
    allowedChars += CHARACTER_SETS.lowercase;
    includedSets.push(CHARACTER_SETS.lowercase);
  }

  if (uppercase) {
    allowedChars += CHARACTER_SETS.uppercase;
    includedSets.push(CHARACTER_SETS.uppercase);
  }

  if (symbols) {
    allowedChars += CHARACTER_SETS.symbols;
    includedSets.push(CHARACTER_SETS.symbols);
  }

  if (allowedChars.length === 0) {
    throw new Error('At least one character set must be selected.');
  }

  let password = '';

  if (guaranteeInclusion) {
    for (const set of includedSets) {
      const randomIndex = crypto.randomInt(0, set.length);
      password += set[randomIndex];
    }

    for (let i = password.length; i < length; i++) {
      const randomIndex = crypto.randomInt(0, allowedChars.length);
      password += allowedChars[randomIndex];
    }

    password = password
      .split('')
      .sort(() => 0.5 - crypto.randomInt(0, 2))
      .join('');

    return password;
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, allowedChars.length);
    password += allowedChars[randomIndex];
  }

  return password;
}

module.exports = { generatePassword };
