const crypto = require('crypto');

function getRandomElement(array) {
  return array[crypto.randomInt(0, array.length)];
}

function getRandomInt(min, max) {
  return crypto.randomInt(min, max);
}

function generateRandomDate() {
  const month = crypto.randomInt(1, 13);
  const year = crypto.randomInt(2024, 2044);
  const day = crypto.randomInt(1, 29);

  return { month, year, day };
}

module.exports = {
  getRandomElement,
  getRandomInt,
  generateRandomDate
};
