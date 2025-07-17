'use client';

import { useAuthSession } from '@/lib/auth/hooks';
import { SignOutButton } from './SignOutButton';
import { formatSessionExpiry } from '@/lib/auth/session';
import Image from 'next/image';

interface UserProfileProps {
  variant?: 'card' | 'dropdown' | 'inline';
  showSessionInfo?: boolean;
  showActions?: boolean;
  className?: string;
}

export function UserProfile({ 
  variant = 'card',
  showSessionInfo = true,
  showActions = true,
  className = ''
}: UserProfileProps) {
  const { session, sessionHealth, isRefreshing, refreshSession } = useAuthSession();

  if (!session?.user) {
    return null;
  }

  const { user } = session;

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-600';
      case 'expiring': return 'text-yellow-600';
      case 'expired': return 'text-red-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || 'User avatar'}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name || user.email}
          </p>
          {user.name && (
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          )}
        </div>
        {showActions && (
          <SignOutButton size="sm" variant="secondary" showConfirmation={false}>
            Sign Out
          </SignOutButton>
        )}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px] ${className}`}>
        <div className="flex items-start gap-3 mb-4">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name || 'User avatar'}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {user.name || user.email}
            </h3>
            {user.name && (
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            )}
            {showSessionInfo && (
              <div className="mt-2">
                <span className={`text-xs font-medium ${getHealthColor(sessionHealth.status)}`}>
                  {sessionHealth.status === 'valid' 
                    ? `Session valid for ${formatSessionExpiry(session)}`
                    : sessionHealth.message
                  }
                </span>
              </div>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="pt-3 border-t border-gray-100">
            <SignOutButton variant="danger" className="w-full">
              Sign Out
            </SignOutButton>
          </div>
        )}
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start gap-4 mb-6">
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || 'User avatar'}
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 truncate">
            {user.name || 'User'}
          </h2>
          <p className="text-gray-600 truncate">{user.email}</p>
          {user.googleId && (
            <p className="text-xs text-gray-500 mt-1">
              Google ID: {user.googleId}
            </p>
          )}
        </div>
      </div>

      {showSessionInfo && (
        <div className="space-y-3 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Session Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${getHealthColor(sessionHealth.status)}`}>
                  {sessionHealth.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time remaining:</span>
                <span className="text-gray-900">
                  {formatSessionExpiry(session)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Access token:</span>
                <span className="text-gray-900">
                  {session.accessToken ? 'Active' : 'Missing'}
                </span>
              </div>
            </div>
            
            {sessionHealth.canRefresh && (
              <button
                onClick={refreshSession}
                disabled={isRefreshing}
                className="mt-3 w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
              </button>
            )}
          </div>

          {session.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Session Error</h3>
                  <p className="text-sm text-red-700 mt-1">{session.error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showActions && (
        <div className="flex gap-3">
          <SignOutButton variant="danger">
            Sign Out
          </SignOutButton>
          {sessionHealth.canRefresh && (
            <button
              onClick={refreshSession}
              disabled={isRefreshing}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function UserAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const { session } = useAuthSession();
  
  if (!session?.user?.image) {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12'
    };
    
    return (
      <div className={`${sizeClasses[size]} bg-gray-300 rounded-full flex items-center justify-center`}>
        <svg className="w-1/2 h-1/2 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
    );
  }

  const sizeMap = { sm: 32, md: 40, lg: 48 };
  const sizeValue = sizeMap[size];

  return (
    <Image
      src={session.user.image}
      alt={session.user.name || 'User avatar'}
      width={sizeValue}
      height={sizeValue}
      className="rounded-full"
    />
  );
}