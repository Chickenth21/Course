import { discordLogger } from './discordLogger.js';

/**
 * Standard API response helper
 */
export const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

export const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  // Automatically alert Discord on all 5xx server errors or errors handled by controllers
  if (statusCode >= 500) {
    const errorObj = message instanceof Error ? message : new Error(typeof message === 'string' ? message : JSON.stringify(message));
    discordLogger.error(errorObj, {
      req: res.req,
      statusCode,
      source: 'Backend API Controller'
    }).catch(() => {});
  }

  const responseMessage = message instanceof Error ? message.message : message;

  return res.status(statusCode).json({
    status: 'error',
    message: responseMessage,
    ...(errors && { errors })
  });
};
