const axios = require('axios');

const vendors = [
  {
    name: 'ipstack',
    url: 'http://api.ipstack.com',
    key: process.env.IPSTACK_API_KEY,
    getCountry: async function (ip) {
      const response = await axios.get(
        `${this.url}/${ip}?access_key=${this.key}`
      );
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
    getCountry: async function (ip) {
      const response = await axios.get(`${this.url}/${ip}/json`);
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
    try {
      const response = await vendor.getCountry(ip);
      return response;
    } catch (err) {
      console.error('Failed to get country:', vendor.name, err);
    }
  }
  throw new Error('All vendors failed.');
}

module.exports = { getCountry };
