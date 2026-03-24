const fetch = require('cross-fetch');
const { WEATHER_DESCRIPTIONS } = require('../constants');
const { createMemoryCache, fetchJson } = require('../utils');

const LOCATION_CACHE = createMemoryCache({ ttlMs: 10 * 60 * 1000, maxEntries: 200 });
const WEATHER_CACHE = createMemoryCache({ ttlMs: 2 * 60 * 1000, maxEntries: 200 });

function getWeatherDescription(code) {
  return WEATHER_DESCRIPTIONS[code] || 'Unknown Weather';
}

function validateCity(city) {
  if (!city) {
    return {
      valid: false,
      error: 'City name is required. Please make a request like /api/weather?city=Ankara.'
    };
  }

  return { valid: true };
}

async function getCoordinates(city) {
  const cacheKey = city.trim().toLowerCase();
  const cachedLocation = LOCATION_CACHE.get(cacheKey);

  if (cachedLocation) {
    return cachedLocation;
  }

  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const { response, data } = await fetchJson(fetch, geocodingUrl, { timeoutMs: 4000, maxBytes: 256 * 1024 });

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status} - ${response.statusText}`);
  }

  if (!data.results || data.results.length === 0) {
    return { found: false };
  }

  const location = {
    found: true,
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
    name: data.results[0].name,
    country: data.results[0].country
  };

  LOCATION_CACHE.set(cacheKey, location);
  return location;
}

async function fetchWeatherData(latitude, longitude) {
  const cacheKey = `${latitude},${longitude}`;
  const cachedWeather = WEATHER_CACHE.get(cacheKey);

  if (cachedWeather) {
    return cachedWeather;
  }

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=1`;
  const { response, data } = await fetchJson(fetch, weatherUrl, { timeoutMs: 4000, maxBytes: 512 * 1024 });

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} - ${response.statusText}`);
  }

  WEATHER_CACHE.set(cacheKey, data);
  return data;
}

function formatWeatherResponse(location, weatherData) {
  const currentData = weatherData.current;
  const hourlyData = weatherData.hourly;

  const next3Hours = {
    time: hourlyData.time.slice(0, 3),
    temperature_2m: hourlyData.temperature_2m.slice(0, 3),
    precipitation_probability: hourlyData.precipitation_probability.slice(0, 3),
    weather_code: hourlyData.weather_code.slice(0, 3)
  };

  return {
    city: location.name,
    country: location.country || 'Unknown',
    coordinates: {
      latitude: location.latitude,
      longitude: location.longitude
    },
    current_condition: {
      temperature: currentData.temperature_2m,
      feels_like: currentData.apparent_temperature,
      humidity: currentData.relative_humidity_2m,
      precipitation: currentData.precipitation,
      rain: currentData.rain,
      snowfall: currentData.snowfall,
      weather_code: currentData.weather_code,
      weather_description: getWeatherDescription(currentData.weather_code),
      cloud_cover: currentData.cloud_cover,
      wind_speed: currentData.wind_speed_10m
    },
    next_hours: next3Hours
  };
}

async function getWeather(city) {
  try {
    const location = await getCoordinates(city);

    if (!location.found) {
      return { success: false, notFound: true, error: 'The specified city was not found.' };
    }

    const weatherData = await fetchWeatherData(location.latitude, location.longitude);
    const formattedData = formatWeatherResponse(location, weatherData);

    return { success: true, data: formattedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  validateCity,
  getWeather
};
