/**
 * Admin Dashboard Page
 * Overview of system statistics and key metrics
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';

interface DashboardStats {
  totalUsers: number;
  totalMemorials: number;
  pendingMemorials: number;
  totalComments: number;
  approvedMemorials: number;
  rejectedMemorials: number;
  activeUsers: number;
  registeredToday: number;
  memorialsCreatedToday: number;
}

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<DashboardStats>('/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">System overview and key metrics</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <div
            onClick={() => navigate('/admin/users')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">{stats.registeredToday} registered today</p>
          </div>

          {/* Total Memorials */}
          <div
            onClick={() => navigate('/admin/moderation')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Memorials</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMemorials}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">{stats.memorialsCreatedToday} created today</p>
          </div>

          {/* Pending Memorials */}
          <div
            onClick={() => navigate('/admin/moderation')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer border-2 border-yellow-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingMemorials}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-4">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
            </div>
            <p className="text-xs text-yellow-600 mt-4">Requires immediate attention</p>
          </div>

          {/* Approved Memorials */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved Memorials</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.approvedMemorials}</p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Rejected Memorials */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rejected Memorials</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejectedMemorials}</p>
              </div>
              <div className="bg-red-100 rounded-full p-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Total Comments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Comments</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalComments}</p>
              </div>
              <div className="bg-indigo-100 rounded-full p-4">
                <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/moderation')}
              className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg hover:bg-yellow-100 transition border border-yellow-200 font-medium"
            >
              Review Pending ({stats.pendingMemorials})
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition border border-blue-200 font-medium"
            >
              Manage Users
            </button>
            <button
              onClick={() => navigate('/admin/reports')}
              className="bg-green-50 text-green-700 px-4 py-3 rounded-lg hover:bg-green-100 transition border border-green-200 font-medium"
            >
              View Reports
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className="bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition border border-gray-200 font-medium"
            >
              Settings
            </button>
            <button
              onClick={() => navigate('/admin/charities')}
              className="bg-teal-50 text-teal-700 px-4 py-3 rounded-lg hover:bg-teal-100 transition border border-teal-200 font-medium"
            >
              Manage Charities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
