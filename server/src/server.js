import app from './app.js';
import { config } from './config/index.js';
import { discordLogger } from './utils/discordLogger.js';

const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
  console.log(`📡 Health endpoint: http://localhost:${config.port}/api/health`);

  // Notify Discord of server boot
  discordLogger.info('🚀 Backend Server Đã Khởi Động', {
    description: `EngVantage AI API đang chạy tại cổng ${config.port}`,
    fields: [
      { name: 'Môi trường', value: config.nodeEnv, inline: true },
      { name: 'Port', value: String(config.port), inline: true }
    ]
  }).catch(() => {});
});

// Handle uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err);
  discordLogger.error(err, { source: 'Server Uncaught Exception', statusCode: 500 }).catch(() => {});
});

process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]:', reason);
  const err = reason instanceof Error ? reason : new Error(String(reason));
  discordLogger.error(err, { source: 'Server Unhandled Rejection', statusCode: 500 }).catch(() => {});
});

const handleShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('🏁 Server closed successfully.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
