'use client';

import dynamic from 'next/dynamic';

// Client-side wrapper for authentication header
const AuthenticationHeader = dynamic(
  () => import('./AuthenticationHeader').then(mod => ({ default: mod.AuthenticationHeader })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
    )
  }
);

export function ClientAuthHeader() {
  return <AuthenticationHeader />;
}