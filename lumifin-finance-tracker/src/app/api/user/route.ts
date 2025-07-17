import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/auth/api';

async function handler(_req: NextRequest, session: any) {
  // This handler only runs if the user is authenticated
  return NextResponse.json({
    message: 'Protected API route accessed successfully',
    user: {
      id: session.user?.id,
      email: session.user?.email,
      name: session.user?.name,
      googleId: session.user?.googleId,
    },
    hasAccessToken: !!session.accessToken,
  });
}

// Protect this route with authentication
export const GET = withApiAuth(handler);