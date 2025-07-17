'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { isSessionValid, shouldRefreshSession, getSessionHealth } from './session';

/**
 * Enhanced useSession hook with validation and refresh logic
 */
export function useAuthSession() {
  const { data: session, status, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Validate session on mount and when session changes
  const sessionHealth = getSessionHealth(session);

  // Auto-refresh session if needed
  useEffect(() => {
    if (session && shouldRefreshSession(session) && !isRefreshing) {
      setIsRefreshing(true);
      update()
        .then(() => {
          console.log('Session refreshed successfully');
        })
        .catch((error) => {
          console.error('Failed to refresh session:', error);
        })
        .finally(() => {
          setIsRefreshing(false);
        });
    }
  }, [session, update, isRefreshing]);

  const refreshSession = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await update();
      return true;
    } catch (error) {
      console.error('Manual session refresh failed:', error);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [update, isRefreshing]);

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated' && isSessionValid(session),
    isRefreshing,
    sessionHealth,
    refreshSession,
    user: session?.user,
    accessToken: session?.accessToken,
    error: session?.error,
  };
}

/**
 * Hook for token validation with automatic refresh
 */
export function useAccessToken() {
  const { session, isRefreshing, refreshSession } = useAuthSession();

  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (!session) return null;

    // If session is valid, return token
    if (isSessionValid(session)) {
      return session.accessToken || null;
    }

    // If session needs refresh and we're not already refreshing
    if (shouldRefreshSession(session) && !isRefreshing) {
      const refreshed = await refreshSession();
      if (refreshed) {
        // Note: We would need to get the updated session here
        // For now, return the current token and let the component handle retry
        return session.accessToken || null;
      }
    }

    return null;
  }, [session, isRefreshing, refreshSession]);

  return {
    token: session?.accessToken || null,
    isValid: isSessionValid(session),
    getValidToken,
    needsRefresh: shouldRefreshSession(session),
  };
}

/**
 * Hook for monitoring session health
 */
export function useSessionMonitor() {
  const { data: session, status } = useSession();
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  // Update last check timestamp
  useEffect(() => {
    setLastCheck(new Date());
  }, [session]);

  // Set up periodic health checks
  useEffect(() => {
    if (status !== 'authenticated') return;

    const interval = setInterval(() => {
      setLastCheck(new Date());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [status]);

  const health = getSessionHealth(session);

  return {
    health,
    lastCheck,
    isHealthy: health.status === 'valid',
    needsAttention: health.status === 'expiring' || health.status === 'error',
  };
}

/**
 * Hook for Google API requests with automatic token management
 */
export function useGoogleApi() {
  const { getValidToken } = useAccessToken();

  const makeRequest = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = await getValidToken();
    
    if (!token) {
      throw new Error('No valid access token available');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }, [getValidToken]);

  return {
    makeRequest,
  };
}