# IP to Country API Gateway

This project is a simple API gateway server that provides the country name associated with a given IP address using multiple vendors. It includes caching, rate limiting, and vendor fallback capabilities.

## Features

- **Get Country by IP:** Retrieve the country name for a specific IP address.
- **Vendor Fallback:** Automatically fall back to a secondary vendor if the primary vendor's rate limit is exceeded.
- **Caching:** Naive in-memory caching for previously requested IP addresses.
- **Rate Limiting:** Configurable rate limiting per vendor.

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/b3am-dev/ip2country-apigateway.git
   cd ip2country-apigateway
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Set up your environment variables in a `.env` file, or I've included example `.env` file for your convenience and you can copy it:

   ```
   IPSTACK_API_KEY=your_ipstack_api_key
   RATE_LIMIT_PER_HOUR=1000
   ```

   Or

   ```bash
   cp .env.example .env
   ```

4. Start the server:
   ```bash
   yarn start
   ```

### Usage

Send a POST request to `/get-country` with the IP address in the request body:

```bash
curl -X POST http://localhost:3000/get-country -H "Content-Type: application/json" -d '{"ip": "134.201.250.155"}'
```

Response:

```json
{
  "country": "United States"
}
```

### Testing

Run tests using the following command:

```bash
yarn test
```
