export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block">
          <div className="relative">
            {/* Animated spinner */}
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

            {/* Optional pulsing circle behind spinner */}
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-100 rounded-full animate-pulse"></div>
          </div>
        </div>

        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading...
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Please wait while we prepare your dashboard
        </p>
      </div>
    </div>
  );
}