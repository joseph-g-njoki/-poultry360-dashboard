'use client';

import { useEffect, useState } from 'react';
import { useBatchStore } from '@/stores/batchStore';
import { useFarmStore } from '@/stores/farmStore';
import { formatNumber, formatDate, getStatusColor, calculateAge } from '@/lib/utils';
import { PoultryBatch, BatchFormData } from '@/types';

export default function FlocksPage() {
  const { batches, isLoading, fetchBatches, createBatch, updateBatch, deleteBatch } = useBatchStore();
  const { farms, fetchFarms } = useFarmStore();
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<PoultryBatch | null>(null);
  const [formData, setFormData] = useState<BatchFormData>({
    batch_number: '',
    farm_id: 0,
    poultry_type: 'layer',
    breed: '',
    initial_count: 0,
    current_count: 0,
    arrival_date: new Date().toISOString().split('T')[0],
    age_weeks: 0,
    notes: '',
  });

  useEffect(() => {
    fetchBatches();
    fetchFarms();
  }, [fetchBatches, fetchFarms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBatch) {
        await updateBatch(editingBatch.id, formData);
      } else {
        await createBatch(formData);
      }
      setShowModal(false);
      setEditingBatch(null);
      resetForm();
      fetchBatches();
    } catch (error) {
      console.error('Error saving batch:', error);
    }
  };

  const handleEdit = (batch: PoultryBatch) => {
    setEditingBatch(batch);
    setFormData({
      batch_number: batch.batch_number,
      farm_id: batch.farm_id,
      poultry_type: batch.poultry_type,
      breed: batch.breed,
      initial_count: batch.initial_count,
      current_count: batch.current_count,
      arrival_date: batch.arrival_date.split('T')[0],
      age_weeks: batch.age_weeks,
      notes: batch.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this flock?')) {
      try {
        await deleteBatch(id);
        fetchBatches();
      } catch (error) {
        console.error('Error deleting batch:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      batch_number: '',
      farm_id: 0,
      poultry_type: 'layer',
      breed: '',
      initial_count: 0,
      current_count: 0,
      arrival_date: new Date().toISOString().split('T')[0],
      age_weeks: 0,
      notes: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBatch(null);
    resetForm();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Flocks / Batches</h1>
          <p className="text-gray-600 mt-2">Manage your poultry batches</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Flock</span>
        </button>
      </div>

      {/* Batches Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : batches.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500 text-lg">No flocks yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first flock to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => {
            const survivalRate = ((batch.current_count / batch.initial_count) * 100).toFixed(1);
            const mortality = batch.initial_count - batch.current_count;
            const currentAge = calculateAge(batch.arrival_date);

            return (
              <div key={batch.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{batch.batch_number}</h3>
                      <p className="text-gray-600 text-sm mt-1">{batch.farm_name || `Farm ${batch.farm_id}`}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                      {batch.status}
                    </span>
                  </div>

                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        batch.poultry_type === 'layer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {batch.poultry_type}
                      </span>
                      <p className="text-sm text-gray-600">{batch.breed}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Current Count</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(batch.current_count)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Initial Count</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(batch.initial_count)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Survival Rate</p>
                      <p className={`text-lg font-semibold ${
                        parseFloat(survivalRate) >= 95 ? 'text-green-600' :
                        parseFloat(survivalRate) >= 90 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {survivalRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mortality</p>
                      <p className={`text-lg font-semibold ${mortality > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatNumber(mortality)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Age</p>
                        <p className="text-sm font-medium text-gray-900">{currentAge} weeks</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Arrival Date</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(batch.arrival_date)}</p>
                      </div>
                    </div>
                  </div>

                  {batch.notes && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{batch.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(batch)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(batch.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBatch ? 'Edit Flock' : 'Add New Flock'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number</label>
                  <input
                    type="text"
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Farm</label>
                  <select
                    value={formData.farm_id}
                    onChange={(e) => setFormData({ ...formData, farm_id: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Farm</option>
                    {farms.map((farm) => (
                      <option key={farm.id} value={farm.id}>{farm.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poultry Type</label>
                  <select
                    value={formData.poultry_type}
                    onChange={(e) => setFormData({ ...formData, poultry_type: e.target.value as 'broiler' | 'layer' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="layer">Layer</option>
                    <option value="broiler">Broiler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Count</label>
                  <input
                    type="number"
                    value={formData.initial_count}
                    onChange={(e) => setFormData({ ...formData, initial_count: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Count</label>
                  <input
                    type="number"
                    value={formData.current_count}
                    onChange={(e) => setFormData({ ...formData, current_count: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Date</label>
                  <input
                    type="date"
                    value={formData.arrival_date}
                    onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age (weeks)</label>
                  <input
                    type="number"
                    value={formData.age_weeks}
                    onChange={(e) => setFormData({ ...formData, age_weeks: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600 transition"
                >
                  {editingBatch ? 'Update' : 'Create'} Flock
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
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