/**
 * Donation Page
 * Manage and view donation history
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import apiClient from '../api/client';
import { toast } from 'react-toastify';

interface Donation {
  id: string;
  fundraiserId: string;
  fundraiserName: string;
  charityName: string;
  amount: number;
  message?: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
  receiptUrl?: string;
}

interface DonationStats {
  totalDonated: number;
  donationCount: number;
  averageDonation: number;
  favorites: Array<{ charityName: string; count: number; total: number }>;
}

export const DonationPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'amount'>('recent');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDonations();
    fetchStats();
  }, [token, navigate, filterStatus, sortBy]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      params.append('sortBy', sortBy);

      const response = await apiClient.get<Donation[]>(
        `/donations?${params.toString()}`
      );
      setDonations(response.data);
    } catch (error) {
      toast.error('Failed to load donations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get<DonationStats>('/donations/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load donation stats', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Donations</h1>
          <p className="mt-2 text-gray-600">Track and manage your charitable donations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-2">Total Donated</p>
              <p className="text-3xl font-bold text-green-600">
                ${stats.totalDonated.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-2">Your total contribution</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-2">Donations</p>
              <p className="text-3xl font-bold text-blue-600">{stats.donationCount}</p>
              <p className="text-xs text-gray-600 mt-2">Number of donations</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-2">Average Donation</p>
              <p className="text-3xl font-bold text-purple-600">
                ${stats.averageDonation.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-2">Per donation</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-2">Favorite Cause</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.favorites[0]?.charityName || 'N/A'}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {stats.favorites[0]?.count} donations
              </p>
            </div>
          </div>
        )}

        {/* Filters & Sort */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as 'all' | 'completed' | 'pending' | 'failed'
                  )
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer text-gray-900"
              >
                <option value="all">All Donations</option>
                <option value="completed">✅ Completed</option>
                <option value="pending">⏳ Pending</option>
                <option value="failed">❌ Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'amount')}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer text-gray-900"
              >
                <option value="recent">Most Recent</option>
                <option value="amount">Highest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && donations.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-2">No donations yet</p>
            <p className="text-gray-600 mb-6">
              Start making a difference by supporting charities through memorials
            </p>
            <button
              onClick={() => navigate('/charities')}
              className="btn btn-primary"
            >
              Browse Charities
            </button>
          </div>
        )}

        {/* Donations List */}
        {!loading && donations.length > 0 && (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  {/* Left - Charity & Fundraiser Info */}
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-900">{donation.charityName}</h3>
                    <p className="text-sm text-gray-600">{donation.fundraiserName}</p>
                    {donation.message && (
                      <p className="text-sm text-gray-700 italic mt-2">"{donation.message}"</p>
                    )}
                  </div>

                  {/* Center - Date & Status */}
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold w-fit ${getStatusBadge(
                        donation.status
                      )}`}
                    >
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </div>

                  {/* Right - Amount & Actions */}
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-green-600">
                      ${donation.amount.toLocaleString()}
                    </p>
                    {donation.receiptUrl && (
                      <a
                        href={donation.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Receipt →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tax Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-2">💼 Tax Information</h3>
          <p className="text-blue-800 text-sm">
            We provide tax receipts for all donations to qualified charities. Receipts are available
            for download in your donation details. Consult your tax professional about the
            deductibility of your donations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
