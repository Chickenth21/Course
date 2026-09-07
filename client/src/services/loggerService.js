const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let isListening = false;

/**
 * Initializes global error listeners to forward unhandled client exceptions to backend -> Discord
 */
export function initGlobalClientLogging() {
  if (isListening || typeof window === 'undefined') return;
  isListening = true;

  const sendErrorToBackend = (payload) => {
    try {
      const token = localStorage.getItem('auth_token');
      fetch(`${API_BASE_URL}/api/logs/client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          ...payload,
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(() => {});
    } catch {
      // Fail-safe: Never break client
    }
  };

  // Window error event
  window.addEventListener('error', (event) => {
    // Ignore harmless cross-origin script error or browser extension errors
    if (!event.message || event.message.includes('ResizeObserver')) return;

    sendErrorToBackend({
      message: event.message,
      stack: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`
    });
  });

  // Unhandled promise rejection
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = reason?.message || (typeof reason === 'string' ? reason : 'Unhandled Promise Rejection');
    const stack = reason?.stack || '';

    // Ignore aborted fetch requests or expected cancellation
    if (message.includes('AbortError') || message.includes('cancelled')) return;

    sendErrorToBackend({ message, stack });
  });
}
