function createError(statusCode = 500, message = 'Internal Server Error', errors, data) {
  const error = new Error(message);
  error.statusCode = statusCode;

  if (errors) {
    error.errors = errors;
  }

  if (data) {
    error.data = data;
  }

  return error;
}

module.exports = createError;
