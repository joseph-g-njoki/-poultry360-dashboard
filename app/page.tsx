'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // If authenticated, show loading
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const languages = {
    en: { flag: '🇬🇧', name: 'English', nativeName: 'English' },
    sw: { flag: '🇹🇿', name: 'Swahili', nativeName: 'Kiswahili' },
    lg: { flag: '🇺🇬', name: 'Luganda', nativeName: 'Oluganda' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">🐔</div>
          <h1 className="text-5xl font-bold text-green-600 mb-3">Poultry360</h1>
          <p className="text-xl text-gray-600">Poultry Farm Management System</p>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-2">
            Choose Language / Olulimi / Lugha
          </h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            Select your preferred language to continue
          </p>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
          >
            {Object.entries(languages).map(([code, lang]) => (
              <option key={code} value={code}>
                {lang.flag} {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Welcome to Poultry360
          </h2>
          <p className="text-gray-600 text-center leading-relaxed">
            The complete solution for managing your poultry farm operations. Track production, monitor health, manage feed schedules, and analyze performance - all in one place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-6">
          <Link
            href="/login"
            className="block bg-green-600 text-white text-center py-5 px-6 rounded-xl hover:bg-green-700 transition shadow-md"
          >
            <div className="text-lg font-bold mb-1">Sign In</div>
            <div className="text-sm opacity-90">Already have an account?</div>
          </Link>

          <Link
            href="/register"
            className="block bg-white border-2 border-green-600 text-green-600 text-center py-5 px-6 rounded-xl hover:bg-green-50 transition shadow-md"
          >
            <div className="text-lg font-bold mb-1">Create Account</div>
            <div className="text-sm opacity-80">New to Poultry360?</div>
          </Link>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-6">
            Key Features
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm text-gray-600 font-medium">Dashboard</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-2">🐔</div>
              <p className="text-sm text-gray-600 font-medium">Flock Management</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-sm text-gray-600 font-medium">Production Records</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-2">💊</div>
              <p className="text-sm text-gray-600 font-medium">Health Monitoring</p>
            </div>
          </div>
        </div>

        {/* Demo Access */}
        <div className="bg-gray-100 border border-gray-300 rounded-xl p-5 mb-6">
          <h3 className="text-base font-bold text-gray-700 text-center mb-2">
            Try Demo Mode
          </h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            Explore the app with sample data - no registration required
          </p>
          <Link
            href="/login"
            className="block bg-green-600 text-white text-center py-3 px-5 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            🚀 Quick Demo Access
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Powered by Poultry360 © 2024
          </p>
        </div>
      </div>
    </div>
  );
}
