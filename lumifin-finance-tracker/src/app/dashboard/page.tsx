import { requireAuth } from '@/lib/auth/server';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        <strong>Protected Route:</strong> You are successfully authenticated!
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">User Information:</h3>
        <div className="space-y-2">
          <p><strong>Email:</strong> {session.user?.email}</p>
          <p><strong>Name:</strong> {session.user?.name}</p>
          <p><strong>User ID:</strong> {session.user?.id}</p>
          {session.user?.googleId && (
            <p><strong>Google ID:</strong> {session.user.googleId}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Next Steps:</h3>
        <p className="text-gray-600">
          This dashboard will soon display your financial data from Google Sheets.
        </p>
      </div>
    </div>
  );
}