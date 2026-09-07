import { config } from '../config/index.js';
import { discordLogger } from '../utils/discordLogger.js';

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[API Error] ${statusCode} - ${message}`);
  if (config.nodeEnv === 'development' && err.stack) {
    console.error(err.stack);
  }

  // Asynchronously dispatch error notification to Discord
  discordLogger.error(err, { req, statusCode, source: 'Backend API' }).catch(() => {});

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
};
