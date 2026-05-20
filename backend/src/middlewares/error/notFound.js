const createError = require('../../utils/createError');

function notFound(req, res, next) {
  next(createError(404, 'Route not found'));
}

module.exports = notFound;
