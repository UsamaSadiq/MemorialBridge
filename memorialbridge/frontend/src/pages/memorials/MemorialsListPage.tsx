/**
 * Memorials List Page
 * Browse all memorials with pagination, search, and filtering
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../hooks';
import { toast } from 'react-toastify';
import { FeaturedMemorialCard } from '../../components/home/FeaturedMemorialCard';

interface Memorial {
  id: string;
  full_name?: string;
  name?: string; // API may return "name" (alias for full_name)
  birth_date: string;
  death_date: string;
  story: string;
  privacy: 'public' | 'link-only';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user_id: string;
  images?: Array<{ id: string; url: string; order?: number }>;
}

/** Backend returns items + total + pages; support both items and memorials for compatibility */
interface ListResponse {
  items?: Memorial[];
  memorials?: Memorial[];
  total: number;
  page: number;
  limit?: number;
  pages?: number;
}

export const MemorialsListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('approved');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchMemorials();
  }, [currentPage, filterStatus]);

  // Default to "All Memorials" for admin so they see every memorial on first load
  useEffect(() => {
    if (user?.is_admin) {
      setFilterStatus((prev) => (prev === 'approved' ? 'all' : prev));
    }
  }, [user?.is_admin]);

  const fetchMemorials = async (override?: { page?: number }) => {
    try {
      setLoading(true);
      const page = override?.page ?? currentPage;
      const params: Record<string, string> = {
        page: page.toString(),
        page_size: itemsPerPage.toString(),
        status: filterStatus,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      const response = await apiClient.get<ListResponse>('/memorials', { params });
      const list = response.data?.items ?? response.data?.memorials ?? [];
      const total = response.data?.total ?? 0;
      const pages = response.data?.pages ?? Math.max(1, Math.ceil(total / itemsPerPage));
      setMemorials(Array.isArray(list) ? list : []);
      setTotalPages(pages);
      if (override?.page !== undefined) setCurrentPage(override.page);
    } catch (error) {
      toast.error('Failed to load memorials');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMemorials({ page: 1 });
  };

  const handleCreateMemorial = () => {
    navigate('/memorials/create');
  };

  const handleViewMemorial = (id: string) => {
    navigate(`/memorials/${id}`);
  };

  const handleEditMemorial = (id: string) => {
    navigate(`/memorials/${id}/edit`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - matches Charities / Donations page pattern */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Memorials</h1>
              <p className="mt-2 text-gray-600">Browse and honor cherished memories. Filter by status or search by name.</p>
            </div>
            <button
              onClick={handleCreateMemorial}
              type="button"
              className="btn btn-success whitespace-nowrap"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Memorial
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter - matches CharityListPage and form styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4 flex-col md:flex-row">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
              <button
                type="submit"
                className="btn btn-primary whitespace-nowrap"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>

            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  value="all"
                  checked={filterStatus === 'all'}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as 'all' | 'approved' | 'pending');
                    setCurrentPage(1);
                  }}
                  className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors font-medium">All Memorials</span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  value="approved"
                  checked={filterStatus === 'approved'}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as 'all' | 'approved' | 'pending');
                    setCurrentPage(1);
                  }}
                  className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors font-medium">Approved</span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={filterStatus === 'pending'}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as 'all' | 'approved' | 'pending');
                    setCurrentPage(1);
                  }}
                  className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors font-medium">Pending Review</span>
              </label>
            </div>
          </form>
        </div>

        {/* Single memorials list, filterable by status and search */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-700">Loading memorials...</p>
            </div>
          </div>
        ) : memorials.length === 0 ? (
          <div className="bg-white rounded-comfort shadow-gentle p-12 text-center border border-brand-blue-100">
            <div className="w-16 h-16 bg-brand-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-800 text-lg font-medium">No memorials found</p>
            {user && (
              <p className="mt-2 text-gray-600">
                <button
                  type="button"
                  onClick={handleCreateMemorial}
                  className="text-brand-blue-600 hover:text-brand-blue-700 font-medium underline"
                >
                  Create a memorial
                </button>
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memorials.map((memorial) => (
                <FeaturedMemorialCard
                  key={memorial.id}
                  memorial={{
                    ...memorial,
                    full_name: memorial.full_name ?? memorial.name,
                    name: memorial.name ?? memorial.full_name,
                  }}
                  variant="list"
                  currentUserId={user?.id}
                  onView={handleViewMemorial}
                  onEdit={handleEditMemorial}
                />
              ))}
            </div>

            {/* Pagination - Gentle styling */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-brand-blue-200 rounded-soft hover:bg-brand-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-warmgray-700"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-soft font-medium transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-brand-blue-300 to-brand-blue-400 text-white shadow-gentle'
                        : 'border border-brand-blue-200 text-warmgray-700 hover:bg-brand-blue-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-brand-blue-200 rounded-soft hover:bg-brand-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-warmgray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MemorialsListPage;
