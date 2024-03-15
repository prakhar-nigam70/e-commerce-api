const globalErrorHandler = (err, req, res, next) => {
  const { message, stack, statusCode } = err;
  const errStatusCode = statusCode ? statusCode : 500;

  res.status(errStatusCode).json({
    message,
    stack,
  });
};

const routeNotFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = { globalErrorHandler, routeNotFound };
