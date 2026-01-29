/**
 * Reports Page
 * System analytics and statistics
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';

interface ReportData {
  memorialsPerDay: Array<{ date: string; count: number }>;
  usersPerDay: Array<{ date: string; count: number }>;
  statusDistribution: { approved: number; pending: number; rejected: number };
  privacyDistribution: { public: number; linkOnly: number };
  topMemorials: Array<{ id: string; name: string; comments: number }>;
}

export const ReportsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    fetchReports();
  }, [user, navigate, dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<ReportData>(
        `/admin/reports?range=${dateRange}`
      );
      setReports(response.data);
    } catch (error) {
      toast.error('Failed to load reports');
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

  if (!reports) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Failed to load reports</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="mt-2 text-gray-700">System insights and statistics</p>
            </div>
            <div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Distribution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Memorial Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Approved</span>
                  <span className="text-sm font-semibold text-green-600">
                    {reports.statusDistribution.approved}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (reports.statusDistribution.approved /
                          Object.values(reports.statusDistribution).reduce((a, b) => a + b, 0)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    {reports.statusDistribution.pending}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (reports.statusDistribution.pending /
                          Object.values(reports.statusDistribution).reduce((a, b) => a + b, 0)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Rejected</span>
                  <span className="text-sm font-semibold text-red-600">
                    {reports.statusDistribution.rejected}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (reports.statusDistribution.rejected /
                          Object.values(reports.statusDistribution).reduce((a, b) => a + b, 0)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">🌍 Public</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {reports.privacyDistribution.public}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (reports.privacyDistribution.public /
                          Object.values(reports.privacyDistribution).reduce((a, b) => a + b, 0)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">🔗 Link-only</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {reports.privacyDistribution.linkOnly}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (reports.privacyDistribution.linkOnly /
                          Object.values(reports.privacyDistribution).reduce((a, b) => a + b, 0)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Memorials */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Memorials by Engagement</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Memorial
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Comments
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.topMemorials.map((memorial, index) => (
                  <tr key={memorial.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="font-semibold mr-3">{index + 1}.</span>
                      {memorial.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {memorial.comments} comments
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Time Series Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Memorials Per Day */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Memorials Created</h2>
            <div className="space-y-3">
              {reports.memorialsPerDay.slice(-7).map((data) => (
                <div key={data.date}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{data.date}</span>
                    <span className="text-sm font-semibold text-gray-900">{data.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min((data.count / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Users Per Day */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">New Users</h2>
            <div className="space-y-3">
              {reports.usersPerDay.slice(-7).map((data) => (
                <div key={data.date}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{data.date}</span>
                    <span className="text-sm font-semibold text-gray-900">{data.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((data.count / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
