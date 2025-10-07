'use client';

import { useEffect, useState } from 'react';
import { useFarmStore } from '@/stores/farmStore';
import { formatNumber, formatDate } from '@/lib/utils';
import { Farm, FarmFormData } from '@/types';

export default function FarmsPage() {
  const { farms, isLoading, fetchFarms, createFarm, updateFarm, deleteFarm } = useFarmStore();
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [formData, setFormData] = useState<FarmFormData>({
    name: '',
    location: '',
    capacity: 0,
    farm_type: 'layer',
  });

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFarm) {
        await updateFarm(editingFarm.id, formData);
      } else {
        await createFarm(formData);
      }
      setShowModal(false);
      setEditingFarm(null);
      setFormData({ name: '', location: '', capacity: 0, farm_type: 'layer' });
      fetchFarms();
    } catch (error) {
      console.error('Error saving farm:', error);
    }
  };

  const handleEdit = (farm: Farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      capacity: farm.capacity,
      farm_type: farm.farm_type,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this farm?')) {
      try {
        await deleteFarm(id);
        fetchFarms();
      } catch (error) {
        console.error('Error deleting farm:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFarm(null);
    setFormData({ name: '', location: '', capacity: 0, farm_type: 'layer' });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farms</h1>
          <p className="text-gray-600 mt-2">Manage your poultry farms</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Farm</span>
        </button>
      </div>

      {/* Farms Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : farms.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-500 text-lg">No farms yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first farm to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <div key={farm.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{farm.name}</h3>
                    <p className="text-gray-600 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {farm.location}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    farm.farm_type === 'layer' ? 'bg-blue-100 text-blue-800' :
                    farm.farm_type === 'broiler' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {farm.farm_type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Capacity</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(farm.capacity)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Stock</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(farm.current_stock || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Active Batches</p>
                    <p className="text-lg font-semibold text-gray-900">{farm.active_batches || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Active Birds</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(farm.active_birds || 0)}</p>
                  </div>
                </div>

                {farm.owner_name && (
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Owner</p>
                    <p className="text-sm font-medium text-gray-900">{farm.owner_name}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Created {formatDate(farm.created_at)}</p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(farm)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(farm.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingFarm ? 'Edit Farm' : 'Add New Farm'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Type</label>
                <select
                  value={formData.farm_type}
                  onChange={(e) => setFormData({ ...formData, farm_type: e.target.value as 'broiler' | 'layer' | 'mixed' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="layer">Layer</option>
                  <option value="broiler">Broiler</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600 transition"
                >
                  {editingFarm ? 'Update' : 'Create'} Farm
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