const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    status = 400;
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(e => e.message)[0];
    status = 400;
  }
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Invalid ID format';
    status = 400;
  }

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
