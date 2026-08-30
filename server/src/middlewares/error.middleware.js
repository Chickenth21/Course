import { config } from '../config/index.js';

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[API Error] ${statusCode} - ${message}`);
  if (config.nodeEnv === 'development' && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
};
