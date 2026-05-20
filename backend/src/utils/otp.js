const bcrypt = require('bcrypt');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpExpiresAt() {
  const minutes = Number(process.env.OTP_EXPIRES_MINUTES || 5);
  return new Date(Date.now() + minutes * 60 * 1000);
}

function hashOtp(otp) {
  return bcrypt.hash(otp, 12);
}

function compareOtp(otp, hash) {
  return bcrypt.compare(otp, hash);
}

module.exports = {
  generateOtp,
  getOtpExpiresAt,
  hashOtp,
  compareOtp,
};
