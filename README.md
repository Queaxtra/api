# API

A modular REST API providing various utility endpoints for developers.

> **Disclaimer:** All generated users and credit cards are fictional and invalid. They cannot be used for any real transactions. No responsibility is accepted for any misuse.

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
  - [Password Generation](#password-generation)
  - [User Generation](#user-generation)
  - [YouTube Downloader](#youtube-downloader)
  - [IP Information](#ip-information)
  - [Weather Information](#weather-information)
  - [Credit Card Validation](#credit-card-validation)
  - [AES Encryption](#aes-encryption)
  - [AES Decryption](#aes-decryption)
  - [QR Code Generation](#qr-code-generation)

## Installation

```bash
# Clone the repository
git clone https://github.com/Queaxtra/api.git
cd api

# Install dependencies
npm install

# Create .env file
echo "PORT=3000" > .env

# Start the server
npm start
```

## API Endpoints

### Password Generation

Generates a secure random password.

```
GET /api/generate/password
```

**Query Parameters:**

| Parameter          | Type    | Default | Description                              |
|--------------------|---------|---------|------------------------------------------|
| length             | number  | 12      | Password length                          |
| numbers            | boolean | true    | Include numbers                          |
| lowercase          | boolean | true    | Include lowercase letters                |
| uppercase          | boolean | true    | Include uppercase letters                |
| symbols            | boolean | true    | Include symbols                          |
| guaranteeInclusion | boolean | false   | Guarantee at least one of each char type |

**Response:**

```json
{
  "password": "(ktDwFrk,$MsDadr{BeG"
}
```

---

### User Generation

Generates random user information including credit card details.

```
GET /api/generate/user
```

**Query Parameters:**

Same as [Password Generation](#password-generation) (applies to user password).

**Response:**

```json
{
  "firstName": "Selene",
  "lastName": "Byram",
  "mail": "selenebyram97@gmail.com",
  "country": "Japan",
  "password": "Z-WPH%|Wu{K;",
  "card": {
    "balance": 9496,
    "cardNumber": "9964609699005209",
    "cardType": "MasterCard",
    "month": 7,
    "year": 2024,
    "day": 28,
    "cvv": "723"
  }
}
```

---

### YouTube Downloader

Downloads audio from a YouTube video.

```
GET /api/yt/download
```

**Query Parameters:**

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| url       | string | Yes      | YouTube video URL    |
| title     | string | Yes      | Output filename      |

**Response:** Audio file stream (MP3)

---

### IP Information

Retrieves geolocation and network information for an IP address.

```
GET /api/ip
```

**Query Parameters:**

| Parameter | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| ip        | string | Yes      | Valid IPv4 address         |

**Response:**

```json
{
  "ip": "8.8.8.8",
  "city": "Mountain View",
  "region": "California",
  "country": "United States",
  "country_code": "US",
  "latitude": 37.42301,
  "longitude": -122.083352,
  "timezone": "America/Los_Angeles",
  "organization": "GOOGLE",
  "postal_code": "94043",
  "currency": "USD",
  "currency_name": "Dollar",
  "language": "en-US,es-US,haw,fr",
  "country_population": "327,167,434"
}
```

---

### Weather Information

Retrieves current weather and short-term forecast for a city.

```
GET /api/weather
```

**Query Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| city      | string | Yes      | City name   |

**Response:**

```json
{
  "city": "New York",
  "country": "United States",
  "coordinates": {
    "latitude": 40.71427,
    "longitude": -74.00597
  },
  "current_condition": {
    "temperature": 1.1,
    "feels_like": -3.7,
    "humidity": 67,
    "precipitation": 0,
    "rain": 0,
    "snowfall": 0,
    "weather_code": 3,
    "weather_description": "Overcast",
    "cloud_cover": 100,
    "wind_speed": 14
  },
  "next_hours": {
    "time": ["2025-02-12T00:00", "2025-02-12T01:00", "2025-02-12T02:00"],
    "temperature_2m": [-0.9, -1.1, -1.1],
    "precipitation_probability": [47, 59, 58],
    "weather_code": [73, 73, 73]
  }
}
```

---

### Credit Card Validation

Validates a credit card number using the Luhn algorithm and determines the card type.

**Supported Card Types:** Visa, MasterCard, American Express, Discover, Diners Club, JCB, UnionPay, Maestro

```
GET /api/validate/card
```

**Query Parameters:**

| Parameter  | Type   | Required | Description        |
|------------|--------|----------|--------------------|
| cardNumber | string | Yes      | Credit card number |

**Response:**

```json
{
  "card_number": "5451638889576641",
  "card_type": "MasterCard",
  "is_valid": true
}
```

---

### AES Encryption

Encrypts text using AES encryption.

```
GET /api/aes/encrypt
```

**Query Parameters:**

| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| text      | string | Yes      | Text to encrypt          |
| key       | string | Yes      | Secret encryption key    |

**Response:**

```json
{
  "encrypted": "U2FsdGVkX1..."
}
```

---

### AES Decryption

Decrypts AES encrypted text.

```
GET /api/aes/decrypt
```

**Query Parameters:**

| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| text      | string | Yes      | Encrypted text           |
| key       | string | Yes      | Secret decryption key    |

**Response:**

```json
{
  "decrypted": "your original text"
}
```

---

### QR Code Generation

Generates a QR code image from text.

```
GET /api/generate/qrcode
```

**Query Parameters:**

| Parameter | Type   | Required | Default | Description                        |
|-----------|--------|----------|---------|------------------------------------|
| text      | string | Yes      | -       | Text or data to encode             |
| size      | string | No       | 200x200 | QR code size (WIDTHxHEIGHT format) |

**Response:**

```json
{
  "qrCode": "data:image/png;base64,..."
}
```

## License

This project is licensed under the MIT License. For details, see the `LICENSE` file.
