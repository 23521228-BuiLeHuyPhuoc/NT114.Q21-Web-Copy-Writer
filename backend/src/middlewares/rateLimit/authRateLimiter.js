const rateLimit = require('express-rate-limit');

function limitHandler(req, res) {
  return res.status(429).json({
    success: false,
    message: 'Too many requests, please try again later',
  });
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler,
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler,
});

module.exports = {
  loginLimiter,
  otpLimiter,
};
