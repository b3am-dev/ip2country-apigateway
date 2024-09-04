# IP to Country API Gateway

This project is a simple API gateway server that provides the country name associated with a given IP address using multiple vendors. It includes caching, rate limiting, and vendor fallback capabilities.

## Features

- **Get Country by IP:** Retrieve the country name for a specific IP address.
- **Vendor Fallback:** Automatically fall back to a secondary vendor if the primary vendor's rate limit is exceeded.
- **Caching:** Naive in-memory caching for previously requested IP addresses.
- **Rate Limiting:** Configurable rate limiting per vendor.
