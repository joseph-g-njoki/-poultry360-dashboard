'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'manager',
    registrationType: 'join', // 'create' or 'join'
    organizationName: '',
    organizationId: '',
    organizationDescription: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Prepare registration data
      const registrationData: Record<string, unknown> = { ...formData };

      // Add organization data based on registration type
      if (formData.registrationType === 'create') {
        if (!formData.organizationName.trim()) {
          throw new Error('Organization name is required when creating a new organization');
        }
        registrationData.organizationName = formData.organizationName.trim();
        if (formData.organizationDescription.trim()) {
          registrationData.organizationDescription = formData.organizationDescription.trim();
        }
      } else if (formData.registrationType === 'join') {
        if (!formData.organizationId) {
          throw new Error('Please select an organization to join');
        }
        registrationData.organizationId = parseInt(formData.organizationId);
      }

      // Remove form-specific fields
      delete registrationData.registrationType;

      await api.register(registrationData);
      // Redirect to login page after successful registration
      router.push('/login?message=Registration successful! Please log in with your credentials.');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-primary-500 text-white p-4 rounded-2xl mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Register for Poultry360 Admin Dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="johndoe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone (Optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="+256700000000"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="registrationType" className="block text-sm font-medium text-gray-700 mb-2">
              Registration Type
            </label>
            <select
              id="registrationType"
              name="registrationType"
              value={formData.registrationType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              required
            >
              <option value="join">Join Existing Organization</option>
              <option value="create">Create New Organization</option>
            </select>
          </div>

          {formData.registrationType === 'create' && (
            <>
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Enter organization name"
                  required
                />
              </div>

              <div>
                <label htmlFor="organizationDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Description (Optional)
                </label>
                <textarea
                  id="organizationDescription"
                  name="organizationDescription"
                  value={formData.organizationDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Brief description of your organization"
                  rows={3}
                />
              </div>
            </>
          )}

          {formData.registrationType === 'join' && (
            <div>
              <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Organization *
              </label>
              <select
                id="organizationId"
                name="organizationId"
                value={formData.organizationId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                required
              >
                <option value="">Select an organization...</option>
                <option value="1">Demo Poultry Farm</option>
                <option value="2">Sunrise Poultry Co.</option>
              </select>
            </div>
          )}

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              required
            >
              <option value="manager">Manager</option>
              <option value="worker">Worker</option>
              {formData.registrationType === 'create' && (
                <option value="admin">Admin/Owner</option>
              )}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}