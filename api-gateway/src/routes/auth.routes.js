const router = require('express').Router();
const proxy = require('express-http-proxy');

const AUTH_URL = process.env.AUTH_SERVICE_URL;

// All /auth/* requests are forwarded to the auth-service (no JWT needed here)
router.use('/', proxy(AUTH_URL, {
  proxyReqPathResolver: (req) => `/api/auth${req.url}`,
}));

module.exports = router;