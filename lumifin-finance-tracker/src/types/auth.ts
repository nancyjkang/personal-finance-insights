import { DefaultSession } from 'next-auth';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      googleId: string;
    } & DefaultSession['user'];
    accessToken?: string;
  }

  interface User {
    id: string;
    googleId: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    googleId?: string;
    accessToken?: string;
  }
}

export interface AuthConfig {
  googleClientId: string;
  googleClientSecret: string;
  nextAuthSecret: string;
  nextAuthUrl: string;
}