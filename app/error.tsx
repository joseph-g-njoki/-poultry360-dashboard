'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our logging service
    logger.error('Application error occurred', error, {
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Something went wrong!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="mt-1 text-xs text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Go to homepage
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            If this problem persists, please contact support at{' '}
            <a
              href="mailto:support@poultry360.com"
              className="text-blue-600 hover:text-blue-700"
            >
              support@poultry360.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}