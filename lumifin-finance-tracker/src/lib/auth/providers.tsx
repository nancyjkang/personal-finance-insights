'use client';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
  session?: Session | null | undefined;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session ?? null}>{children}</SessionProvider>
  );
}

export { useSession, signIn, signOut } from 'next-auth/react';