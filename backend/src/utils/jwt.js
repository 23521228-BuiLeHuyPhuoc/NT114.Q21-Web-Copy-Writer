const jwt = require('jsonwebtoken');

function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev_change_me';
}

function toRole(accountType) {
  return accountType === 'admin' ? 'admin' : 'customer';
}

function signToken(account, accountType) {
  return jwt.sign(
    {
      sub: account._id.toString(),
      accountType,
      role: toRole(accountType),
    },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );
}

function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

module.exports = {
  signToken,
  verifyToken,
  toRole,
};
