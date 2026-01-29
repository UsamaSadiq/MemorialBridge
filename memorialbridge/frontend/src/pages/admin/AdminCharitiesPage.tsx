/**
 * Admin Charities Page
 * Add and manage charities (admin only)
 */

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { adminAPI, AdminCharityResponse } from '../../api/admin';
import { toast } from 'react-toastify';

export const AdminCharitiesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [charities, setCharities] = useState<AdminCharityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    fetchCharities();
  }, [user, navigate]);

  const fetchCharities = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.listCharities(1, 200);
      setCharities(data.items ?? []);
    } catch (error) {
      toast.error('Failed to load charities');
      console.error(error);
      setCharities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    if (!trimmedName || !trimmedUrl) {
      toast.error('Name and URL are required');
      return;
    }
    try {
      setSubmitting(true);
      await adminAPI.createCharity({
        name: trimmedName,
        description: description.trim() || undefined,
        url: trimmedUrl,
      });
      toast.success('Charity added successfully');
      setName('');
      setDescription('');
      setUrl('');
      fetchCharities();
    } catch (error: unknown) {
      const message = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : null;
      toast.error(message || 'Failed to add charity');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Charities</h1>
          <p className="mt-2 text-gray-600">Add and manage charities available for memorial fundraisers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add charity form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Charity</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div>
              <label htmlFor="charity-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                id="charity-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Charity name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="charity-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="charity-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the charity"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="charity-url" className="block text-sm font-medium text-gray-700 mb-1">
                Website URL *
              </label>
              <input
                id="charity-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {submitting ? 'Adding…' : 'Add Charity'}
            </button>
          </form>
        </div>

        {/* List of charities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Existing Charities</h2>
            <Link
              to="/charities"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View public list →
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          ) : charities.length === 0 ? (
            <p className="text-gray-500 py-8">No charities yet. Add one above.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {charities.map((c) => (
                <li key={c.id} className="py-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{c.name}</p>
                    {c.description && (
                      <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{c.description}</p>
                    )}
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                    >
                      {c.url}
                    </a>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      c.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCharitiesPage;
