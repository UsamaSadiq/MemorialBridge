/**
 * Charity List Page
 * Browse and search registered charities
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import apiClient from '../api/client';
import { toast } from 'react-toastify';

interface Charity {
  id: string;
  name: string;
  description: string;
  url?: string;
  is_active?: boolean;
  created_at?: string;
}

interface CharitiesResponse {
  items: Charity[];
  total: number;
  page: number;
  page_size: number;
}

export const CharityListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCharities();
  }, [search, page]);

  const fetchCharities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20');
      if (search) params.append('search', search);

      const response = await apiClient.get<CharitiesResponse>(
        `/charities?${params.toString()}`
      );
      const list = response.data?.items;
      setCharities(Array.isArray(list) ? list : []);
      setTotal(response.data?.total ?? 0);
    } catch (error) {
      toast.error('Failed to load charities');
      console.error(error);
      setCharities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCharityClick = (id: string) => {
    navigate(`/charities/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Charities</h1>
            <p className="mt-2 text-gray-700">
              Support meaningful causes through memorial fundraisers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Search Charities
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && charities.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-800 font-medium">
              No charities found. Try adjusting your search filters.
            </p>
          </div>
        )}

        {/* Charities Grid */}
        {!loading && charities.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {charities.map((charity) => (
                <div
                  key={charity.id}
                  onClick={() => handleCharityClick(charity.id)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                >
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {charity.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {charity.description}
                    </p>

                    {charity.url && (
                      <a
                        href={charity.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block"
                      >
                        Visit Website →
                      </a>
                    )}

                    {/* Action Button */}
                    <button type="button" className="btn btn-primary btn-block mt-4">
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > 20 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {Math.ceil(total / 20)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * 20 >= total}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

export default CharityListPage;
