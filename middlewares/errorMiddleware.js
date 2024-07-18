const ApiError = require('../utils/apiError');

const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJwtInvalidSignature = () =>
  new ApiError(401, 'Invalid token, please login again');

const handleJwtExpiredSignature = () =>
  new ApiError(401, 'Your token has expired, please login again');

const globalError = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
    else if (err.name === 'TokenExpiredError')
      err = handleJwtExpiredSignature();
    sendErrorProd(err, res);
  }
};

module.exports = globalError;
