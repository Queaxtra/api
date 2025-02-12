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
  "Password": "(ktDwFrk,$MsDadr{BeG"
}
```
### 👱‍♂️ Random User Generation Endpoint
- HTTP Method: **GET**
- Endpoint: **/api/generate/user**
- Description: This endpoint generates random user information.
- Output:
```json
{
  "firstName": "Netty",
  "lastName": "Salomon",
  "mail": "nettysalomon94@outlook.com",
  "country": "Costa Rica",
  "password": "MjUXtgQ,+OSq",
  "card": {
    "balance": 5504,
    "cardNumber": "110865516482223",
    "cardType": "MasterCard",
    "month": 1,
    "year": 2029,
    "day": 25,
    "cvv": 643
  }
}
```

### 🎗️ Youtube Downloader
- HTTP Method: **GET**
- Endpoint: **/api/yt/download?url=&title=**
- Description: You can download any Youtube link you want for free.
