'use client';

import { useAuthSession } from '@/lib/auth/hooks';
import { SignInButton } from './SignInButton';
import { UserProfile, UserAvatar } from './UserProfile';
import { SignOutButton } from './SignOutButton';
import { useState } from 'react';

interface AuthenticationHeaderProps {
  className?: string;
  showFullProfile?: boolean;
}

export function AuthenticationHeader({ 
  className = '',
  showFullProfile = false 
}: AuthenticationHeaderProps) {
  const { session, status, sessionHealth } = useAuthSession();
  const [showDropdown, setShowDropdown] = useState(false);

  // Loading state
  if (status === 'loading') {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className={`flex items-center ${className}`}>
        <SignInButton size="sm" />
      </div>
    );
  }

  // Show full profile variant
  if (showFullProfile) {
    return (
      <div className={className}>
        <UserProfile variant="card" />
      </div>
    );
  }

  // Compact header variant with dropdown
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="flex items-center gap-3">
        {/* User info */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <UserAvatar size="sm" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {session.user?.name || session.user?.email}
            </p>
            <p className={`text-xs ${sessionHealth.status === 'valid' ? 'text-green-600' : 'text-yellow-600'}`}>
              {sessionHealth.status === 'valid' ? 'Active' : 'Expiring soon'}
            </p>
          </div>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Quick sign out button */}
        <SignOutButton 
          size="sm" 
          variant="secondary" 
          showConfirmation={false}
          className="ml-2"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-20">
            <UserProfile 
              variant="dropdown" 
              showSessionInfo={true}
              showActions={true}
            />
          </div>
        </>
      )}
    </div>
  );
}

export function AuthenticationStatus() {
  const { session, status, sessionHealth, isRefreshing } = useAuthSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full">
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <span className="text-sm text-red-700">Not authenticated</span>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
      case 'expiring': return { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' };
      case 'expired': return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
      case 'error': return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
    }
  };

  const colors = getStatusColor(sessionHealth.status);

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg}`}>
      <div className={`w-2 h-2 rounded-full ${colors.dot} ${isRefreshing ? 'animate-pulse' : ''}`} />
      <span className={`text-sm ${colors.text}`}>
        {isRefreshing ? 'Refreshing...' : sessionHealth.message}
      </span>
    </div>
  );
}