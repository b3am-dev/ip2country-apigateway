const axios = require('axios');
const rateLimiter = require('./rateLimiter');

const vendors = [
  {
    name: 'ipstack',
    url: 'http://api.ipstack.com',
    key: process.env.IPSTACK_API_KEY,
    rateLimiter: rateLimiter.create('ipstack'),
    getCountry: async function (ip) {
      const response = await axios.get(
        `${this.url}/${ip}?access_key=${this.key}`
      );
      this.rateLimiter.increment();
      if (response.status === 200) {
        if (!response.data.error) {
          return response.data.country_name;
        } else {
          throw Error(response.data.error.info);
        }
      } else {
        throw Error(response.statusText);
      }
    },
  },
  {
    name: 'ipapi',
    url: 'https://ipapi.co',
    rateLimiter: rateLimiter.create('ipapi'),
    getCountry: async function (ip) {
      const response = await axios.get(`${this.url}/${ip}/json`);
      this.rateLimiter.increment();
      if (response.status === 200) {
        if (response.data.error) {
          throw Error(response.data.reason);
        } else {
          return response.data.country_name;
        }
      } else {
        throw Error(response.statusText);
      }
    },
  },
];

async function getCountry(ip) {
  for (const vendor of vendors) {
    if (!vendor.rateLimiter.isRateLimited()) {
      try {
        const response = await vendor.getCountry(ip);
        return response;
      } catch (err) {
        console.error('Failed to get country:', vendor.name, err);
      }
    }
  }
  throw new Error('All vendors rate limit exceeded or failed.');
}

module.exports = { getCountry };
