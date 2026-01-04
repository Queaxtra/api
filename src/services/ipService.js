const ipapi = require('ipapi.co');

const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

function validateIpAddress(ipAddress) {
  if (!ipAddress) {
    return {
      valid: false,
      error: 'IP address is required. Please make a request like /api/ip?ip=8.8.8.8'
    };
  }

  if (!IP_REGEX.test(ipAddress)) {
    return { valid: false, error: 'Invalid IP address format.' };
  }

  return { valid: true };
}

function getIpInfo(ipAddress) {
  return new Promise((resolve) => {
    ipapi.location((data) => {
      const responseData = {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        country_code: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        organization: data.org,
        postal_code: data.postal,
        currency: data.currency,
        currency_name: data.currency_name,
        language: data.languages,
        country_population: data.country_population ? data.country_population.toLocaleString() : 'N/A'
      };

      resolve({ success: true, data: responseData });
    }, ipAddress);
  });
}

module.exports = {
  validateIpAddress,
  getIpInfo
};
