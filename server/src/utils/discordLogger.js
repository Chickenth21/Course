import { config } from '../config/index.js';

// Anti-spam debounce cache: stores hash/signature -> timestamp
const errorCooldowns = new Map();
const COOLDOWN_MS = 15000; // Do not resend the same error within 15 seconds

/**
 * Clean up old cooldown entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of errorCooldowns.entries()) {
    if (now - timestamp > COOLDOWN_MS) {
      errorCooldowns.delete(key);
    }
  }
}, 60000);

/**
 * Core function to send an Embed to Discord via Webhook (with 1 retry and timeout)
 */
async function sendEmbedToDiscord(embed) {
  const webhookUrl = config.discord?.webhookUrl;
  if (!webhookUrl) {
    return false;
  }

  const payload = {
    username: 'EngVantage Bug Hunter',
    avatar_url: 'https://cdn-icons-png.flaticon.com/512/3233/3233508.png',
    embeds: [embed]
  };

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        console.warn(`[DiscordLogger] Discord trả về status ${response.status}: ${response.statusText}`);
        return false;
      }
      return true;
    } catch (err) {
      const cause = err.cause?.code || err.cause?.message || err.message;
      if (attempt === 1) {
        // Wait 1.5s and retry once in case of DNS lag or network jitter
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      console.warn(`[DiscordLogger] Không thể gửi log tới Discord (Lý do: ${cause}):`, err.message);
      return false;
    }
  }
  return false;
}

/**
 * Truncate strings to satisfy Discord embed limits
 */
function truncate(str, maxLength = 1000) {
  if (!str) return 'N/A';
  const text = typeof str === 'string' ? str : JSON.stringify(str);
  return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
}

export const discordLogger = {
  /**
   * Log an error from Express (API) or Background tasks
   */
  async error(error, { req = null, source = 'Backend API', statusCode = 500 } = {}) {
    const errorMessage = error?.message || (typeof error === 'string' ? error : 'Unknown Error');
    const stackTrace = error?.stack || 'Không có stack trace';
    const method = req?.method || '';
    const url = req?.originalUrl || req?.url || 'N/A';
    const userId = req?.user?.id || 'Khách (Chưa đăng nhập)';

    // Duplicate check to avoid spamming Discord
    const errorSignature = `${source}:${method}:${url}:${errorMessage}`;
    const now = Date.now();
    const lastSent = errorCooldowns.get(errorSignature);

    if (lastSent && now - lastSent < COOLDOWN_MS) {
      return; // Skip duplicate
    }
    errorCooldowns.set(errorSignature, now);

    const fields = [
      { name: '📍 Nguồn lỗi', value: source, inline: true },
      { name: '🔢 HTTP Code', value: String(statusCode), inline: true },
      { name: '👤 Người dùng', value: String(userId), inline: true }
    ];

    if (req) {
      fields.push({ name: '🌐 Endpoint', value: `${method} ${url}`, inline: false });
      if (req.body && Object.keys(req.body).length > 0) {
        // Redact sensitive password fields
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password) sanitizedBody.password = '***REDACTED***';
        fields.push({
          name: '📦 Request Body',
          value: `\`\`\`json\n${truncate(JSON.stringify(sanitizedBody, null, 2), 500)}\n\`\`\``,
          inline: false
        });
      }
    }

    fields.push({
      name: '📑 Chi tiết Stack Trace',
      value: `\`\`\`javascript\n${truncate(stackTrace, 950)}\n\`\`\``,
      inline: false
    });

    const embed = {
      title: `🚨 [LỖI HỆ THỐNG] ${truncate(errorMessage, 200)}`,
      color: 0xef4444, // Red
      fields,
      timestamp: new Date().toISOString(),
      footer: {
        text: `EngVantage AI Error Reporter • Môi trường: ${config.nodeEnv}`
      }
    };

    return await sendEmbedToDiscord(embed);
  },

  /**
   * Log warning events
   */
  async warn(title, { message = '', req = null, source = 'System' } = {}) {
    const fields = [
      { name: '📍 Nguồn', value: source, inline: true },
      { name: 'ℹ️ Thông tin', value: truncate(message, 500), inline: false }
    ];

    if (req) {
      fields.push({
        name: '🌐 Route',
        value: `${req.method || ''} ${req.originalUrl || req.url || ''}`,
        inline: true
      });
    }

    const embed = {
      title: `⚠️ [CẢNH BÁO] ${truncate(title, 200)}`,
      color: 0xf59e0b, // Amber / Yellow
      fields,
      timestamp: new Date().toISOString(),
      footer: {
        text: `EngVantage AI Logger • ${config.nodeEnv}`
      }
    };

    return await sendEmbedToDiscord(embed);
  },

  /**
   * Log info / lifecycle events (e.g. server start, migrations)
   */
  async info(title, { description = '', fields = [] } = {}) {
    const embed = {
      title: `ℹ️ [THÔNG BÁO] ${truncate(title, 200)}`,
      description: truncate(description, 1000),
      color: 0x3b82f6, // Blue
      fields,
      timestamp: new Date().toISOString(),
      footer: {
        text: `EngVantage AI System • ${config.nodeEnv}`
      }
    };

    return await sendEmbedToDiscord(embed);
  },

  /**
   * Log client-side unhandled errors forwarded from Frontend
   */
  async logClientError({ message, stack, url, userAgent, userId = 'N/A' }) {
    const errorSignature = `Client:${url}:${message}`;
    const now = Date.now();
    const lastSent = errorCooldowns.get(errorSignature);

    if (lastSent && now - lastSent < COOLDOWN_MS) {
      return;
    }
    errorCooldowns.set(errorSignature, now);

    const embed = {
      title: `💻 [LỖI FRONTEND CLIENT] ${truncate(message, 200)}`,
      color: 0x8b5cf6, // Purple
      fields: [
        { name: '🌐 Trang xảy ra lỗi', value: truncate(url, 300), inline: false },
        { name: '👤 User ID', value: String(userId), inline: true },
        { name: '🖥️ Trình duyệt', value: truncate(userAgent, 250), inline: false },
        {
          name: '📑 Stack Trace',
          value: `\`\`\`javascript\n${truncate(stack || 'No client stack', 950)}\n\`\`\``,
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'EngVantage Web Client Error Reporter'
      }
    };

    return await sendEmbedToDiscord(embed);
  }
};
