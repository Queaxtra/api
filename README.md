# API

✨ This API was created to provide different help to users. The API has the following features:

⚠️ All of these created users and credit cards are invalid cards and you cannot make transactions with any of them. I do not accept any responsibility if any illegal activity is detected.

### 🚀 Password Generation Endpoint
- HTTP Method: **GET**
- Endpoint: **/api/generate/password?length=20**
- Description: This endpoint allows users to create strong passwords.
- Output:
```json
{
  "password": "(ktDwFrk,$MsDadr{BeG"
}
```
### 👱‍♂️ Random User Generation Endpoint
- HTTP Method: **GET**
- Endpoint: **/api/generate/user**
- Description: This endpoint generates random user information.
- Output:
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

### 🎗️ Youtube Downloader
- HTTP Method: **GET**
- Endpoint: **/api/yt/download?url=&title=**
- Description: You can download any Youtube link you want for free.

### 🌍 IP Address Information Endpoint
- HTTP Method: **GET**
- Endpoint: **/api/ip?ip={ip_address}**
- Description: This endpoint retrieves information about a given IP address.
- Parameters:
  - `ip` (required): The IP address to look up. Must be a valid IPv4 address.
- Output:
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

### ☀️ Weather Information Endpoint
- HTTP Method: **GET**
- Endpoint: **/api/weather?city={city_name}**
- Description: This endpoint retrieves current weather information and a short-term forecast for a given city.
- Parameters:
  - `city` (required): The name of the city.
- Output:
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
    "time": [
      "2025-02-12T00:00",
      "2025-02-12T01:00",
      "2025-02-12T02:00"
    ],
    "temperature_2m": [-0.9, -1.1, -1.1],
    "precipitation_probability": [47, 59, 58],
    "weather_code": [73, 73, 73]
  }
}
```

### ✅ Credit Card Validation Endpoint
- HTTP Method: **GET**
- Endpoint: **/api/validate/card?cardNumber={card_number}**
- Description: This endpoint validates a credit card number using the Luhn algorithm and determines the card type. It supports the following card types: Visa, MasterCard, American Express, Discover, Diners Club, JCB, UnionPay, and Maestro.
- Parameters:
  - `cardNumber` (required): The credit card number to validate.
- Output:
```json
{
  "card_number": "5451638889576641",
  "card_type": "MasterCard",
  "is_valid": true
}
```

### 🔒 AES Encryption Endpoint
- HTTP Method: **GET**
- Endpoint: **/api/aes/encrypt?text={text_to_encrypt}&key={encryption_key}**
- Description: This endpoint encrypts the provided text using AES.
- Parameters:
  - `text` (required): The text to be encrypted.
  - `key` (required): The secret key for encryption.
- Output:
```json
{
  "encrypted": "U2FsdGVkX1... (example encrypted string)"
}
```

### 🔓 AES Decryption Endpoint
- HTTP Method: **GET**
- Endpoint: **/api/aes/decrypt?text={encrypted_text}&key={decryption_key}**
- Description: This endpoint decrypts the provided AES encrypted text.
- Parameters:
  - `text` (required): The AES encrypted text.
  - `key` (required): The secret key used for encryption.
- Output:
```json
{
  "decrypted": "your original text"
}
```

### 🔳 QR Code Generation Endpoint
- HTTP Method: **GET**
- Endpoint: **/api/generate/qrcode?text={text_for_qr}&size={WIDTHxHEIGHT}**
- Description: This endpoint generates a QR code image from the provided text.
- Parameters:
  - `text` (required): The text or data to encode in the QR code.
  - `size` (optional): The desired size of the QR code image in pixels, formatted as WIDTHxHEIGHT (e.g., 300x300). Defaults to 200x200.
- Output:
```json
{
  "qrCode": "data:image/png;base64,..."
}
```