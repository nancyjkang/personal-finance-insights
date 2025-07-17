import Link from 'next/link';
import { ClientAuthHeader } from '@/components/auth/ClientAuthHeader';

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Lumifin Finance Tracker</h1>
            </div>
            <ClientAuthHeader />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Personal Finance Management
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect your Google Sheets to track expenses, categorize transactions, and generate monthly reports with intelligent insights.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h3 className="text-xl font-semibold mb-4">🚧 Development Progress</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>Task 1: Next.js Project Setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>Task 2: Google OAuth Authentication & UI Components</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">⭕</span>
              <span>Task 3: Google Sheets Integration</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/auth/test"
            className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Test Authentication</h4>
            <p className="text-gray-600 mb-4">Test the complete authentication flow with session management and token handling.</p>
            <span className="text-blue-600 font-medium">Try it out →</span>
          </Link>
          
          <Link
            href="/dashboard"
            className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Dashboard (Protected)</h4>
            <p className="text-gray-600 mb-4">Access the protected dashboard that requires authentication.</p>
            <span className="text-blue-600 font-medium">Go to dashboard →</span>
          </Link>
        </div>
      </main>
      
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <Link href="/GOOGLE_SETUP.md" className="hover:text-gray-700">
              Setup Guide
            </Link>
            <span>•</span>
            <Link href="/auth/test" className="hover:text-gray-700">
              Test Auth
            </Link>
            <span>•</span>
            <a 
              href="https://github.com/anthropics/claude-code" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              Built with Claude Code
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
