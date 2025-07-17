'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Client-side authentication guard component
 * Redirects to sign-in if user is not authenticated
 */
export function AuthGuard({ 
  children, 
  fallback = <div>Loading...</div>,
  redirectTo = '/api/auth/signin'
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  if (status === 'loading') {
    return <>{fallback}</>;
  }

  if (!session) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Higher-order component for protecting pages
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    redirectTo?: string;
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <AuthGuard 
        fallback={options?.fallback} 
        redirectTo={options?.redirectTo || '/api/auth/signin'}
      >
        <Component {...props} />
      </AuthGuard>
    );
  };
}

/**
 * Hook to check if user is authenticated
 */
export function useAuthGuard() {
  const { data: session, status } = useSession();
  
  return {
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    session,
    user: session?.user,
  };
}

/**
 * Hook that redirects to sign-in if not authenticated
 */
export function useRequireAuth(redirectTo = '/api/auth/signin') {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  return {
    session,
    isLoading: status === 'loading',
    user: session?.user,
  };
}