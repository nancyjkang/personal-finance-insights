import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Environment variable validation will be handled at runtime

/**
 * Refresh the Google access token using the refresh token
 */
async function refreshAccessToken(refreshToken: string) {
  try {
    const url = 'https://oauth2.googleapis.com/token';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      access_token: refreshedTokens.access_token,
      expires_in: refreshedTokens.expires_in,
      refresh_token: refreshedTokens.refresh_token,
      token_type: refreshedTokens.token_type,
    };
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dev-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dev-client-secret',
      authorization: {
        params: {
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/spreadsheets.readonly',
          ].join(' '),
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account?.access_token) {
        token.accessToken = account.access_token;
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token;
        }
        token.googleId = account.providerAccountId;
        if (account.expires_at) {
          token.expiresAt = account.expires_at;
        }
        token.tokenType = account.token_type || 'Bearer';
      }
      
      if (user?.id) {
        token.googleId = user.id;
      }

      // Return previous token if the access token has not expired yet
      if (token.expiresAt && Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // Access token has expired, try to update it
      if (token.refreshToken) {
        try {
          const refreshedTokens = await refreshAccessToken(token.refreshToken as string);
          
          return {
            ...token,
            accessToken: refreshedTokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + (refreshedTokens.expires_in || 3600)),
            refreshToken: refreshedTokens.refresh_token || token.refreshToken || undefined,
          };
        } catch (error) {
          console.error('Error refreshing access token:', error);
          // Return the old token and error will be handled by the client
          return { ...token, error: 'RefreshAccessTokenError' };
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Handle token refresh errors
      if (token.error) {
        session.error = token.error as string;
      }

      // Send properties to the client, like an access_token and user id from a provider
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.googleId) {
        session.user.googleId = token.googleId as string;
      }
      if (token.expiresAt) {
        session.expiresAt = token.expiresAt as number;
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key-not-for-production',
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};