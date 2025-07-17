import { getServerSession } from 'next-auth/next';
import { authOptions } from './config';
import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';

/**
 * Get session from API route
 */
export async function getApiSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

/**
 * API route authentication guard
 * Returns the session if authenticated, or sends 401 response
 */
export async function requireApiAuth(): Promise<Session | NextResponse> {
  const session = await getApiSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  return session;
}

/**
 * Higher-order function to protect API routes
 */
export function withApiAuth<T = any>(
  handler: (req: NextRequest, session: Session) => Promise<NextResponse<T>>
) {
  return async function protectedHandler(req: NextRequest): Promise<NextResponse<T>> {
    const sessionOrResponse = await requireApiAuth();

    // If it's a NextResponse (error), return it
    if (sessionOrResponse instanceof NextResponse) {
      return sessionOrResponse as NextResponse<T>;
    }

    // Otherwise, it's a session, so call the handler
    return handler(req, sessionOrResponse);
  };
}

/**
 * Get user access token from API session
 */
export async function getApiUserAccessToken(): Promise<string | null> {
  const session = await getApiSession();
  return (session as any)?.accessToken ?? null;
}

/**
 * Get user Google ID from API session
 */
export async function getApiUserGoogleId(): Promise<string | null> {
  const session = await getApiSession();
  return (session?.user as any)?.googleId ?? null;
}

/**
 * Check if API request is authenticated
 */
export async function isApiAuthenticated(): Promise<boolean> {
  const session = await getApiSession();
  return !!session;
}