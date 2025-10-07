'use client';

import { useEffect, useState } from 'react';
import { useBatchStore } from '@/stores/batchStore';
import api from '@/lib/api';
import { formatDate, formatNumber } from '@/lib/utils';
import { ProductionRecord, FeedRecord } from '@/types';

export default function RecordsPage() {
  const { batches, fetchBatches } = useBatchStore();
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [recordType, setRecordType] = useState<'production' | 'feed'>('production');
  const [productionRecords, setProductionRecords] = useState<ProductionRecord[]>([]);
  const [feedRecords, setFeedRecords] = useState<FeedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recordForm, setRecordForm] = useState<Record<string, string | number>>({});

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  useEffect(() => {
    if (selectedBatch) {
      loadRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatch, recordType]);

  const loadRecords = async () => {
    if (!selectedBatch) return;

    setIsLoading(true);
    try {
      if (recordType === 'production') {
        const response = await api.getProductionRecords(selectedBatch);
        setProductionRecords(response.records || []);
      } else {
        const response = await api.getFeedRecords(selectedBatch);
        setFeedRecords(response.records || []);
      }
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = () => {
    if (!selectedBatch) return;

    if (recordType === 'production') {
      setRecordForm({
        batch_id: selectedBatch,
        date_recorded: new Date().toISOString().split('T')[0],
        eggs_collected: 0,
        broken_eggs: 0,
        abnormal_eggs: 0,
        notes: '',
      });
    } else {
      setRecordForm({
        batch_id: selectedBatch,
        feed_type: '',
        quantity_kg: 0,
        date_fed: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (recordType === 'production') {
        await api.createProductionRecord(recordForm);
      } else {
        await api.createFeedRecord(recordForm);
      }
      setShowModal(false);
      loadRecords();
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  const handleDeleteProduction = async (id: number) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await api.deleteProductionRecord(id);
        loadRecords();
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const handleDeleteFeed = async (id: number) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await api.deleteFeedRecord(id);
        loadRecords();
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Records</h1>
        <p className="text-gray-600 mt-2">Track production and feed records</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Flock</label>
            <select
              value={selectedBatch || ''}
              onChange={(e) => setSelectedBatch(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Choose a flock...</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.batch_number} - {batch.farm_name || `Farm ${batch.farm_id}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value as 'production' | 'feed')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="production">Production (Eggs)</option>
              <option value="feed">Feed Records</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddRecord}
              disabled={!selectedBatch}
              className="w-full bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      {!selectedBatch ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">Select a flock to view records</p>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {recordType === 'production' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eggs Collected</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broken</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abnormal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collected By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productionRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No production records found
                      </td>
                    </tr>
                  ) : (
                    productionRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.date_recorded)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatNumber(record.eggs_collected)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.broken_eggs || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.abnormal_eggs || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {record.collected_by_name || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.notes || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteProduction(record.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feed Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity (kg)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fed By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {feedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No feed records found
                      </td>
                    </tr>
                  ) : (
                    feedRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.date_fed)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.feed_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatNumber(record.quantity_kg)} kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.cost ? `UGX ${formatNumber(record.cost)}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {record.fed_by_name || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.notes || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteFeed(record.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                Add {recordType === 'production' ? 'Production' : 'Feed'} Record
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {recordType === 'production' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={recordForm.date_recorded}
                      onChange={(e) => setRecordForm({ ...recordForm, date_recorded: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Eggs Collected</label>
                    <input
                      type="number"
                      value={recordForm.eggs_collected}
                      onChange={(e) => setRecordForm({ ...recordForm, eggs_collected: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Broken Eggs</label>
                    <input
                      type="number"
                      value={recordForm.broken_eggs}
                      onChange={(e) => setRecordForm({ ...recordForm, broken_eggs: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Abnormal Eggs</label>
                    <input
                      type="number"
                      value={recordForm.abnormal_eggs}
                      onChange={(e) => setRecordForm({ ...recordForm, abnormal_eggs: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={recordForm.date_fed}
                      onChange={(e) => setRecordForm({ ...recordForm, date_fed: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Feed Type</label>
                    <input
                      type="text"
                      value={recordForm.feed_type}
                      onChange={(e) => setRecordForm({ ...recordForm, feed_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (kg)</label>
                    <input
                      type="number"
                      value={recordForm.quantity_kg}
                      onChange={(e) => setRecordForm({ ...recordForm, quantity_kg: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                      step="0.01"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={recordForm.notes}
                  onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600 transition"
                >
                  Add Record
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}