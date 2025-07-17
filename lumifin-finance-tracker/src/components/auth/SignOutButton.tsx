'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface SignOutButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger';
  showConfirmation?: boolean;
  callbackUrl?: string;
  children?: React.ReactNode;
}

export function SignOutButton({ 
  className = '',
  size = 'md',
  variant = 'secondary',
  showConfirmation = true,
  callbackUrl = '/',
  children
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSignOut = async () => {
    if (showConfirmation && !showDialog) {
      setShowDialog(true);
      return;
    }

    setIsLoading(true);
    setShowDialog(false);
    
    try {
      await signOut({ callbackUrl });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-2.5 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium rounded-lg
    transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 
    focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const focusClasses = {
    primary: 'focus:ring-blue-500',
    secondary: 'focus:ring-gray-500',
    danger: 'focus:ring-red-500'
  };

  return (
    <>
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${focusClasses[variant]} ${className}`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Signing out...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {children || 'Sign Out'}
          </>
        )}
      </button>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Sign Out</h3>
                <p className="text-sm text-gray-500">Are you sure you want to sign out?</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function QuickSignOutButton() {
  return (
    <SignOutButton 
      size="sm" 
      variant="secondary" 
      showConfirmation={false}
    >
      Sign Out
    </SignOutButton>
  );
}