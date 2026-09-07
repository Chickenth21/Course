import { Router } from 'express';
import { discordLogger } from '../utils/discordLogger.js';
import { successResponse } from '../utils/response.js';

const router = Router();

/**
 * Route to receive errors occurring on the web client
 */
router.post('/client', async (req, res) => {
  try {
    const { message, stack, url, userAgent, userId } = req.body || {};
    if (message) {
      discordLogger.logClientError({
        message,
        stack,
        url,
        userAgent: userAgent || req.headers['user-agent'] || 'Unknown Browser',
        userId: userId || req.user?.id || 'Anonymous'
      }).catch(() => {});
    }
    return successResponse(res, { logged: true }, 'Client error logged successfully');
  } catch (_error) {
    // Fail-safe: Always return 200 so reporting doesn't cascade errors
    return res.status(200).json({ status: 'ignored' });
  }
});

export default router;
