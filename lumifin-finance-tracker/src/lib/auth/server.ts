import { getServerSession } from 'next-auth/next';
import { authOptions } from './config';
import { redirect } from 'next/navigation';
import type { Session, User } from 'next-auth';
import type { ReactElement } from 'react';

/**
 * Get the current session on the server side
 */
export async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

/**
 * Alias for getSession for consistency with client-side naming
 */
export async function auth(): Promise<Session | null> {
  return await getSession();
}

/**
 * Get the current session or redirect to sign in if not authenticated
 */
export async function getRequiredSession(): Promise<Session> {
  const session = await getSession();
  
  if (!session) {
    redirect('/api/auth/signin');
  }
  
  return session;
}

/**
 * Alias for getRequiredSession
 */
export async function requireAuth(): Promise<Session> {
  return await getRequiredSession();
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Check if user is authenticated (returns boolean)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

/**
 * Get the current user's Google access token
 */
export async function getGoogleAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken || null;
}

/**
 * Alias for getGoogleAccessToken
 */
export async function getUserAccessToken(): Promise<string | null> {
  return await getGoogleAccessToken();
}

/**
 * Get user Google ID
 */
export async function getUserGoogleId(): Promise<string | null> {
  const session = await getSession();
  return (session?.user as any)?.googleId ?? null;
}

/**
 * Protect a server component by requiring authentication
 */
export async function withAuth<T extends object>(
  component: (props: T & { session: Session }) => Promise<ReactElement>,
  props: T
): Promise<ReactElement> {
  const session = await getRequiredSession();
  return component({ ...props, session });
}