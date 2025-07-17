'use client';

import { SignInButton } from './SignInButton';

interface AuthErrorProps {
  error?: string | null;
  className?: string;
  showRetry?: boolean;
}

export function AuthError({ 
  error,
  className = '',
  showRetry = true
}: AuthErrorProps) {
  if (!error) return null;

  const getErrorDetails = (errorCode: string) => {
    switch (errorCode) {
      case 'Configuration':
        return {
          title: 'Configuration Error',
          message: 'There is a problem with the server configuration. Please contact support.',
          canRetry: false
        };
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to sign in. Please contact an administrator.',
          canRetry: false
        };
      case 'Verification':
        return {
          title: 'Verification Error',
          message: 'The verification token is invalid or has expired. Please try signing in again.',
          canRetry: true
        };
      case 'Default':
        return {
          title: 'Authentication Error',
          message: 'An error occurred during authentication. Please try again.',
          canRetry: true
        };
      case 'RefreshAccessTokenError':
        return {
          title: 'Session Expired',
          message: 'Your session has expired. Please sign in again to continue.',
          canRetry: true
        };
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Linking Error',
          message: 'This Google account is already linked to a different user. Please use the correct account.',
          canRetry: true
        };
      case 'OAuthCreateAccount':
        return {
          title: 'Account Creation Error',
          message: 'Unable to create your account. Please try again or contact support.',
          canRetry: true
        };
      case 'EmailCreateAccount':
        return {
          title: 'Email Account Error',
          message: 'Unable to create account with this email address.',
          canRetry: true
        };
      case 'Callback':
        return {
          title: 'Callback Error',
          message: 'An error occurred during the authentication callback. Please try again.',
          canRetry: true
        };
      case 'OAuthCallback':
        return {
          title: 'OAuth Error',
          message: 'An error occurred with Google authentication. Please try again.',
          canRetry: true
        };
      case 'SessionRequired':
        return {
          title: 'Session Required',
          message: 'You must be signed in to access this page.',
          canRetry: true
        };
      default:
        return {
          title: 'Unknown Error',
          message: error || 'An unexpected error occurred. Please try again.',
          canRetry: true
        };
    }
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-red-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {errorDetails.title}
          </h3>
          <p className="mt-1 text-sm text-red-700">
            {errorDetails.message}
          </p>
          {showRetry && errorDetails.canRetry && (
            <div className="mt-4">
              <SignInButton 
                size="sm" 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SessionExpiredBanner() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-yellow-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            Your session is about to expire. Please refresh your session or sign in again to continue.
          </p>
        </div>
        <div className="ml-3 flex-shrink-0">
          <SignInButton 
            size="sm" 
            variant="outline"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
          />
        </div>
      </div>
    </div>
  );
}

export function ConnectionError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-800">
            Connection Problem
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Unable to connect to authentication services. Please check your internet connection and try again.
          </p>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}