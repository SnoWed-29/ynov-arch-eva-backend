const axios = require('axios');

const orderClient = axios.create({
  baseURL: process.env.ORDER_SERVICE_URL,
  timeout: 5000,
});

const notificationClient = axios.create({
  baseURL: process.env.NOTIFICATION_SERVICE_URL,
  timeout: 5000,
});

module.exports = { orderClient, notificationClient };