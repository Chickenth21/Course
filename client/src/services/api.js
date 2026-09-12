const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Universal fetch wrapper with automatic Authorization header.
 * Handles 401 token expiry by clearing local storage and reloading.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = localStorage.getItem('auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Handle token expiry globally — clear session and redirect to login
    if (response.status === 401) {
      const message = data?.message || '';
      const isExpired = message.includes('hết hạn') || message.includes('TokenExpired') || message.includes('Thiếu Token');
      if (isExpired || !token) {
        localStorage.removeItem('auth_token');
        // Soft redirect — don't hard reload if already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    const error = new Error(data.message || `HTTP Error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
