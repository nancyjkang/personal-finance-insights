import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    // Additional middleware logic can be added here
    // For now, just continue with the request
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Check if user has a valid token
        if (!token) {
          return false;
        }

        // Additional authorization logic can be added here
        // For example, role-based access control
        return true;
      },
    },
  },
);

// Configure which routes to protect
export const config = {
  matcher: [
    // Protect dashboard and app routes
    '/dashboard/:path*',
    '/app/:path*',
    '/api/sheets/:path*',
    '/api/user/:path*',
  ],
};