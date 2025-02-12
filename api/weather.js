const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({ error: 'City name is required. Please make a request like /api/weather?city=Ankara.' });
    }

    try {
        const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`; // Changed language to 'en'
        const geocodingResponse = await fetch(geocodingUrl);

        if (!geocodingResponse.ok) {
            throw new Error(`Geocoding API error: ${geocodingResponse.status} - ${geocodingResponse.statusText}`);
        }

        const geocodingData = await geocodingResponse.json();

        if (!geocodingData.results || geocodingData.results.length === 0) {
            return res.status(404).json({ error: 'The specified city was not found.' });
        }

        const { latitude, longitude, name, country } = geocodingData.results[0];
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=1`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error(`Weather API error: ${weatherResponse.status} - ${weatherResponse.statusText}`);
        }

        const weatherData = await weatherResponse.json();
        const currentData = weatherData.current;
        const hourlyData = weatherData.hourly;

        const next3Hours = {
            time: hourlyData.time.slice(0, 3),
            temperature_2m: hourlyData.temperature_2m.slice(0, 3),
            precipitation_probability: hourlyData.precipitation_probability.slice(0, 3),
            weather_code: hourlyData.weather_code.slice(0, 3),
        };

        function getWeatherDescription(code) {
            const descriptions = {
                0: "Clear sky",
                1: "Clear sky",
                2: "Partly cloudy",
                3: "Overcast",
                45: "Foggy",
                48: "Depositing rime fog",
                51: "Light drizzle",
                53: "Moderate drizzle",
                55: "Dense drizzle",
                56: "Light freezing drizzle",
                57: "Dense freezing drizzle",
                61: "Slight rain",
                63: "Moderate rain",
                65: "Heavy rain",
                66: "Light freezing rain",
                67: "Heavy freezing rain",
                71: "Slight snow fall",
                73: "Moderate snow fall",
                75: "Heavy snow fall",
                77: "Snow grains",
                80: "Slight rain showers",
                81: "Moderate rain showers",
                82: "Violent rain showers",
                85: "Slight snow showers",
                86: "Heavy snow showers",
                95: "Thunderstorm: Slight or moderate",
                96: "Thunderstorm with slight hail",
                99: "Thunderstorm with heavy hail",
            };
            return descriptions[code] || "Unknown Weather";
        }

        const responseData = {
            city: name,
            country: country || 'Unknown',
            coordinates: {
            latitude: latitude,
            longitude: longitude,
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
                wind_speed: currentData.wind_speed_10m,
            },
            next_hours: next3Hours,

        };

        res.json(responseData);
    } catch (error) {
        console.error("Error fetching weather information:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An error occurred while retrieving weather information.' });
        }
    }
});

module.exports = router;