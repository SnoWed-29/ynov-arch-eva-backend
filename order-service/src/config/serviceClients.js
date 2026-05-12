const axios = require('axios');

const productsClient = axios.create({
  baseURL: process.env.PRODUCTS_SERVICE_URL,
  timeout: 5000,
});

const notificationClient = axios.create({
  baseURL: process.env.NOTIFICATION_SERVICE_URL,
  timeout: 5000,
});

module.exports = { productsClient, notificationClient };