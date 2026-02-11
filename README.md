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
  - [DNS Lookup](#dns-lookup)
  - [Port Scanner](#port-scanner)
  - [Color Converter](#color-converter)
  - [User-Agent Parser](#user-agent-parser)

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

---

### DNS Lookup

Queries DNS records for a domain using Cloudflare's DNS-over-HTTPS API.

**Supported Record Types:** A, AAAA, CNAME, MX, NS, SOA, TXT, SRV, PTR, CAA

```
GET /api/dns
```

**Query Parameters:**

| Parameter | Type   | Required | Default | Description                      |
|-----------|--------|----------|---------|----------------------------------|
| domain    | string | Yes      | -       | Domain name to query             |
| type      | string | No       | A       | DNS record type (A, MX, TXT...)  |

**Response:**

```json
{
  "domain": "google.com",
  "recordType": "A",
  "records": [
    {
      "name": "google.com",
      "type": "A",
      "typeId": 1,
      "ttl": 300,
      "data": "142.250.185.78"
    },
    {
      "name": "google.com",
      "type": "A",
      "typeId": 1,
      "ttl": 300,
      "data": "142.250.185.46"
    }
  ],
  "ttl": 300
}
```

**Example Requests:**

```bash
# Query A records (default)
curl "http://localhost:3000/api/dns?domain=google.com"

# Query MX records
curl "http://localhost:3000/api/dns?domain=google.com&type=MX"

# Query AAAA (IPv6) records
curl "http://localhost:3000/api/dns?domain=cloudflare.com&type=AAAA"

# Query TXT records (SPF/DMARC)
curl "http://localhost:3000/api/dns?domain=_dmarc.google.com&type=TXT"

# Query NS records
curl "http://localhost:3000/api/dns?domain=google.com&type=NS"
```

---

### Port Scanner

Scans TCP ports on a target host to check if they are open or closed.

**Features:**
- Scan specific port ranges (max 1000 ports per request)
- Scan comma-separated list of ports
- Service name detection for common ports
- Concurrent scanning with rate limiting

```
GET /api/scan/port
```

**Query Parameters:**

| Parameter  | Type   | Required | Default | Description                              |
|------------|--------|----------|---------|------------------------------------------|
| host       | string | Yes      | -       | Target hostname or IP address            |
| startPort  | number | No       | 1       | Starting port for range scan             |
| endPort    | number | No       | 1000    | Ending port for range scan               |
| ports      | string | No       | -       | Comma-separated port list (e.g., 80,443) |
| timeout    | number | No       | 2000    | Connection timeout in milliseconds       |

**Response:**

```json
{
  "host": "example.com",
  "totalScanned": 1000,
  "openCount": 3,
  "closedCount": 997,
  "openPorts": [
    { "port": 22, "service": "SSH" },
    { "port": 80, "service": "HTTP" },
    { "port": 443, "service": "HTTPS" }
  ],
  "scanDetails": [
    { "port": 22, "status": "open", "service": "SSH" },
    { "port": 23, "status": "closed", "service": null }
  ]
}
```

**Example Requests:**

```bash
# Scan common port range (1-1000)
curl "http://localhost:3000/api/scan/port?host=example.com"

# Scan specific range
curl "http://localhost:3000/api/scan/port?host=192.168.1.1&startPort=20&endPort=100"

# Scan specific ports
curl "http://localhost:3000/api/scan/port?host=example.com&ports=22,80,443,3306,5432"

# Custom timeout (5 seconds)
curl "http://localhost:3000/api/scan/port?host=example.com&startPort=1&endPort=100&timeout=5000"
```

**Detected Services:** FTP, SSH, TELNET, SMTP, DNS, HTTP, POP3, IMAP, HTTPS, SMB, MySQL, RDP, PostgreSQL, VNC, Redis, MongoDB

---

### Color Converter

Converts colors between HEX, RGB, HSL, and CMYK formats. Provides nearest color name matching.

**Supported Formats:** HEX (#RGB, #RRGGBB), RGB (0-255), HSL (H:0-360, S:0-100, L:0-100), CMYK (0-100)

```
GET /api/color/convert
```

**Query Parameters:**

| Parameter | Type   | Required | Description                                          |
|-----------|--------|----------|------------------------------------------------------|
| from      | string | Yes      | Source format: hex, rgb, hsl, or cmyk                |
| hex       | string | No       | HEX color (when from=hex) - e.g., #ff5733            |
| r         | number | No       | Red value (when from=rgb) - 0 to 255                |
| g         | number | No       | Green value (when from=rgb) - 0 to 255               |
| b         | number | No       | Blue value (when from=rgb) - 0 to 255                |
| h         | number | No       | Hue (when from=hsl) - 0 to 360                       |
| s         | number | No       | Saturation (when from=hsl) - 0 to 100                |
| l         | number | No       | Lightness (when from=hsl) - 0 to 100                 |
| c         | number | No       | Cyan (when from=cmyk) - 0 to 100                     |
| m         | number | No       | Magenta (when from=cmyk) - 0 to 100                  |
| y         | number | No       | Yellow (when from=cmyk) - 0 to 100                   |
| k         | number | No       | Key/Black (when from=cmyk) - 0 to 100                |

**Response:**

```json
{
  "hex": "#ff5733",
  "rgb": {
    "r": 255,
    "g": 87,
    "b": 51
  },
  "hsl": {
    "h": 11,
    "s": 100,
    "l": 60
  },
  "cmyk": {
    "c": 0,
    "m": 66,
    "y": 80,
    "k": 0
  },
  "colorName": "OrangeRed"
}
```

**Example Requests:**

```bash
# Convert HEX to all formats
curl "http://localhost:3000/api/color/convert?from=hex&hex=#ff5733"

# Convert RGB to all formats
curl "http://localhost:3000/api/color/convert?from=rgb&r=255&g=87&b=51"

# Convert HSL to all formats
curl "http://localhost:3000/api/color/convert?from=hsl&h=11&s=100&l=60"

# Convert CMYK to all formats
curl "http://localhost:3000/api/color/convert?from=cmyk&c=0&m=66&y=80&k=0"

# Shorthand HEX
curl "http://localhost:3000/api/color/convert?from=hex&hex=f0f"
```

---

### User-Agent Parser

Parses User-Agent strings to extract browser, operating system, and device information.

**Features:**
- Browser detection: Chrome, Chromium, Firefox, Safari, Edge, Opera, Samsung Internet
- OS detection: Windows, macOS, Linux, iOS, Android (with version)
- Device detection: Desktop, Mobile, Tablet, Bot
- Vendor and model detection for common devices

```
GET /api/parse/useragent
```

**Query Parameters:**

| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| ua        | string | No       | User-Agent string (optional, uses header)  |

If no `ua` query parameter is provided, the endpoint automatically parses the `User-Agent` header from the request.

**Response:**

```json
{
  "browser": {
    "name": "Chrome",
    "version": "120.0.0.0",
    "engine": "Blink"
  },
  "os": {
    "name": "macOS",
    "version": "10.15.7",
    "platform": "Desktop"
  },
  "device": {
    "type": "Desktop",
    "model": "Unknown",
    "vendor": "Apple"
  },
  "raw": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
```

**Example Requests:**

```bash
# Parse request's User-Agent header
curl "http://localhost:3000/api/parse/useragent"

# Parse custom User-Agent string
curl "http://localhost:3000/api/parse/useragent?ua=Mozilla/5.0%20(iPhone;%20CPU%20iPhone%20OS%2016_0%20like%20Mac%20OS%20X)%20AppleWebKit/605.1.15%20(KHTML,%20like%20Gecko)%20Version/16.0%20Mobile/15E148%20Safari/604.1"

# Parse Android Chrome
curl "http://localhost:3000/api/parse/useragent?ua=Mozilla/5.0%20(Linux;%20Android%2014;%20SM-G998B)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/120.0.0.0%20Mobile%20Safari/537.36"
```

---

## License

This project is licensed under the MIT License. For details, see the `LICENSE` file.
