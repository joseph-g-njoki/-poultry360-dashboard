'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import api from '@/lib/api';
import { formatNumber, formatDate } from '@/lib/utils';
import { DashboardOverview, Activity, ProductionPerformance } from '@/types';

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [performance, setPerformance] = useState<ProductionPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Move useMemo before conditional returns to fix React Hooks rule
  const stats = useMemo(() => [
    {
      name: 'Total Farms',
      value: overview?.farms || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      name: 'Active Flocks',
      value: overview?.flocks || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      name: 'Total Birds',
      value: formatNumber(overview?.totalBirds || 0),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      name: 'Today\'s Eggs',
      value: formatNumber(overview?.todayEggs || 0),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500',
    },
  ], [overview]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch data with timeout handling
      const [overviewData, activitiesData, performanceData] = await Promise.allSettled([
        api.getDashboardOverview(),
        api.getRecentActivities(10),
        api.getProductionPerformance(),
      ]);

      // Handle overview data
      if (overviewData.status === 'fulfilled') {
        setOverview(overviewData.value);
      } else {
        console.error('Overview fetch failed:', overviewData.reason);
      }

      // Handle activities data
      if (activitiesData.status === 'fulfilled') {
        setActivities(activitiesData.value?.activities || []);
      } else {
        console.error('Activities fetch failed:', activitiesData.reason);
      }

      // Handle performance data
      if (performanceData.status === 'fulfilled') {
        setPerformance(performanceData.value?.performance || []);
      } else {
        console.error('Performance fetch failed:', performanceData.reason);
      }

      // Check if all requests failed
      if (overviewData.status === 'rejected' &&
          activitiesData.status === 'rejected' &&
          performanceData.status === 'rejected') {
        setError('Failed to load dashboard data. Please check your connection and try again.');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('An unexpected error occurred. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error && !overview) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Dashboard</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Poultry360 Farm Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mortality Alert */}
      {(overview?.mortalityToday || 0) > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-red-900 font-semibold">Mortality Alert</h3>
              <p className="text-red-700 text-sm">
                {overview?.mortalityToday} bird(s) lost today. Total mortality: {overview?.totalMortality}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activities</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'feed' ? 'bg-green-100 text-green-600' :
                      activity.type === 'production' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                        {activity.farm_name && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <p className="text-xs text-gray-500">{activity.farm_name}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Production Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Top Performers (30 Days)</h2>
          </div>
          <div className="p-6">
            {performance.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No production data available</p>
            ) : (
              <div className="space-y-4">
                {performance.slice(0, 5).map((perf, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{perf.batch_number}</p>
                        <p className="text-xs text-gray-500">{perf.farm_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary-600">
                          {perf.laying_rate_percent?.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">Laying Rate</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-xs text-gray-500">Avg Daily</p>
                        <p className="text-sm font-medium">{perf.avg_daily_eggs?.toFixed(0)} eggs</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total (30d)</p>
                        <p className="text-sm font-medium">{formatNumber(perf.total_eggs_30days || 0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}