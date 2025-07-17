import { Session } from 'next-auth';

/**
 * Session validation utilities
 */

/**
 * Check if the session is valid and not expired
 */
export function isSessionValid(session: Session | null): boolean {
  if (!session) return false;
  
  // Check if session has an error (like RefreshAccessTokenError)
  if (session.error) {
    console.warn('Session has error:', session.error);
    return false;
  }

  // Check if access token exists
  if (!session.accessToken) {
    console.warn('Session missing access token');
    return false;
  }

  // Check if token is expired (with 5 minute buffer)
  if (session.expiresAt) {
    const now = Math.floor(Date.now() / 1000);
    const buffer = 5 * 60; // 5 minutes
    if (now >= (session.expiresAt - buffer)) {
      console.warn('Session access token is expired');
      return false;
    }
  }

  return true;
}

/**
 * Check if the session needs to be refreshed soon
 */
export function shouldRefreshSession(session: Session | null): boolean {
  if (!session || !session.expiresAt) return false;

  const now = Math.floor(Date.now() / 1000);
  const refreshBuffer = 10 * 60; // 10 minutes before expiry

  return now >= (session.expiresAt - refreshBuffer);
}

/**
 * Get the time until session expires (in seconds)
 */
export function getTimeUntilExpiry(session: Session | null): number {
  if (!session || !session.expiresAt) return 0;

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, session.expiresAt - now);
}

/**
 * Format session expiry time as human readable string
 */
export function formatSessionExpiry(session: Session | null): string {
  const timeLeft = getTimeUntilExpiry(session);
  
  if (timeLeft <= 0) return 'Expired';
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Session validation middleware for API routes
 */
export function validateSessionForApi(session: Session | null): {
  isValid: boolean;
  error?: string;
} {
  if (!session) {
    return { isValid: false, error: 'No session found' };
  }

  if (session.error === 'RefreshAccessTokenError') {
    return { 
      isValid: false, 
      error: 'Token refresh failed. Please sign in again.' 
    };
  }

  if (!isSessionValid(session)) {
    return { 
      isValid: false, 
      error: 'Session is invalid or expired' 
    };
  }

  return { isValid: true };
}

/**
 * Create authorization header for Google API calls
 */
export function createAuthHeader(session: Session | null): string | null {
  if (!isSessionValid(session)) {
    return null;
  }

  return `Bearer ${session!.accessToken}`;
}

/**
 * Session health check - returns detailed status
 */
export function getSessionHealth(session: Session | null) {
  if (!session) {
    return {
      status: 'invalid',
      message: 'No session found',
      canRefresh: false,
    };
  }

  if (session.error) {
    return {
      status: 'error',
      message: `Session error: ${session.error}`,
      canRefresh: session.error !== 'RefreshAccessTokenError',
      error: session.error,
    };
  }

  if (!session.accessToken) {
    return {
      status: 'invalid',
      message: 'Missing access token',
      canRefresh: false,
    };
  }

  const timeLeft = getTimeUntilExpiry(session);
  
  if (timeLeft <= 0) {
    return {
      status: 'expired',
      message: 'Session expired',
      canRefresh: true,
      timeLeft: 0,
    };
  }

  if (shouldRefreshSession(session)) {
    return {
      status: 'expiring',
      message: `Session expires in ${formatSessionExpiry(session)}`,
      canRefresh: true,
      timeLeft,
    };
  }

  return {
    status: 'valid',
    message: `Session valid for ${formatSessionExpiry(session)}`,
    canRefresh: false,
    timeLeft,
  };
}