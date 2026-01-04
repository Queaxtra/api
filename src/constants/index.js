const CHARACTER_SETS = {
  numbers: '0123456789',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  symbols: '!@#$%^&*()_+-=~`[]{}|;:,./<>?'
};

const CARD_CONFIG = {
  Visa: { prefix: '4', length: 16 },
  Mastercard: { prefix: '5', length: 16 },
  'American Express': { prefix: '34', length: 15 },
  Discover: { prefix: '6', length: 16 },
  'Diners Club': { prefix: '36', length: 14 },
  JCB: { prefix: '35', length: 16 },
  Maestro: { prefix: '50', length: 19 },
  UnionPay: { prefix: '62', length: 19 }
};

const CARD_REGEXES = {
  Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  MasterCard: /^5[1-5][0-9]{14}$/,
  'American Express': /^3[47][0-9]{13}$/,
  Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  'Diners Club': /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  JCB: /^(?:2131|1800|35\d{3})\d{11}$/,
  UnionPay: /^(62|88)\d{14,17}$/,
  Maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d{8,15}$/
};

const WEATHER_DESCRIPTIONS = {
  0: 'Clear sky',
  1: 'Clear sky',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm: Slight or moderate',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

const EMAIL_DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com'];

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  CHARACTER_SETS,
  CARD_CONFIG,
  CARD_REGEXES,
  WEATHER_DESCRIPTIONS,
  EMAIL_DOMAINS,
  HTTP_STATUS
};
