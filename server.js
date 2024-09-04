require('dotenv').config();
const express = require('express');
const cache = require('./utils/cache');
const vendors = require('./utils/vendors');
const app = express();

app.use(express.json());

app.post('/get-country', async (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    return res.status(400).json({ error: 'IP address is required' });
  }

  // Check cache first
  const cachedCountry = cache.get(ip);
  if (cachedCountry) {
    return res.json({ country: cachedCountry });
  }

  // Check vendors
  try {
    const country = await vendors.getCountry(ip);
    cache.set(ip, country);
    res.json({ country });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
