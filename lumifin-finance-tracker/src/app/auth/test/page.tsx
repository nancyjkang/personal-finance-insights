'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { SessionStatus } from '@/components/auth/SessionStatus';

export default function AuthTestPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
      
      {session ? (
        <div className="space-y-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Signed in as:</strong> {session.user?.email}
          </div>
          
          <SessionStatus />
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Session Data:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
          
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            You are not signed in
          </div>
          
          <button
            onClick={() => signIn('google')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign In with Google
          </button>
        </div>
      )}
    </div>
  );
}