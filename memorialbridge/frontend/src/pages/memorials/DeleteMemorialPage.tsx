/**
 * Delete Memorial Page
 * Confirmation page for deleting a memorial
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../hooks';
import { toast } from 'react-toastify';

interface Memorial {
  id: string;
  full_name?: string;
  name?: string; // API returns "name" (alias for full_name)
  user_id: string;
}

export const DeleteMemorialPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetchMemorial();
  }, [id]);

  const fetchMemorial = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Memorial>(`/memorials/${id}`);

      // Check authorization
      if (response.data.user_id !== user?.id) {
        toast.error('You do not have permission to delete this memorial');
        navigate(`/memorials/${id}`);
        return;
      }

      setMemorial(response.data);
    } catch (error) {
      toast.error('Failed to load memorial');
      console.error(error);
      navigate('/memorials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setDeleting(true);
      await apiClient.delete(`/memorials/${id}`);
      toast.success('Memorial deleted successfully');
      navigate('/memorials');
    } catch (error) {
      toast.error('Failed to delete memorial');
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Memorial not found</p>
      </div>
    );
  }

  // API may return "name" (alias) or "full_name"
  const displayName = memorial.full_name ?? memorial.name ?? 'Unknown';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Delete Memorial</h1>
          <p className="mt-2 text-gray-600">This action cannot be undone</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-bold text-red-900">⚠️ Warning</h2>
            <p className="text-red-800 mt-2">
              You are about to permanently delete the memorial for <strong>{displayName}</strong>.
            </p>
            <p className="text-red-800 mt-2">This action cannot be undone.</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Memorial Details</h3>
              <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {displayName}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Confirm Deletion</h3>
              {confirmDelete ? (
                <div className="space-y-4">
                  <p className="text-gray-600 font-medium">Are you absolutely sure?</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting ? 'Deleting...' : 'Permanently Delete'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(`/memorials/${id}`)}
                    className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Keep Memorial
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete Memorial
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteMemorialPage;
