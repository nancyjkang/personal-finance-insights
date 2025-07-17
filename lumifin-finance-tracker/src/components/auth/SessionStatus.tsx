'use client';

import { useAuthSession, useSessionMonitor } from '@/lib/auth/hooks';

export function SessionStatus() {
  const { 
    session, 
    isRefreshing, 
    sessionHealth, 
    refreshSession 
  } = useAuthSession();
  
  const { health, lastCheck } = useSessionMonitor();

  if (!session) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded p-4">
        <h3 className="font-semibold text-gray-800">Session Status</h3>
        <p className="text-gray-600">Not authenticated</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 border-green-300 text-green-800';
      case 'expiring': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'expired': return 'bg-red-100 border-red-300 text-red-800';
      case 'error': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const statusClass = getStatusColor(sessionHealth.status);

  return (
    <div className={`border rounded p-4 ${statusClass}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold">Session Status</h3>
        {sessionHealth.canRefresh && (
          <button
            onClick={refreshSession}
            disabled={isRefreshing}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Status:</strong> {sessionHealth.status}
        </div>
        <div>
          <strong>Message:</strong> {sessionHealth.message}
        </div>
        {sessionHealth.timeLeft !== undefined && (
          <div>
            <strong>Time Left:</strong> {Math.floor(sessionHealth.timeLeft / 60)}m {sessionHealth.timeLeft % 60}s
          </div>
        )}
        <div>
          <strong>Last Check:</strong> {lastCheck.toLocaleTimeString()}
        </div>
        <div>
          <strong>User:</strong> {session.user?.email}
        </div>
        <div>
          <strong>Has Access Token:</strong> {session.accessToken ? 'Yes' : 'No'}
        </div>
        {session.error && (
          <div className="text-red-600">
            <strong>Error:</strong> {session.error}
          </div>
        )}
      </div>

      {health.status === 'error' && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
          <strong>Action Required:</strong> Please sign out and sign in again to restore your session.
        </div>
      )}
    </div>
  );
}