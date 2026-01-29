/**
 * Moderation Queue Page
 * Review and approve/reject pending memorials
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';

interface PendingMemorial {
  id: string;
  full_name: string;
  birth_date: string;
  death_date: string;
  story: string;
  privacy: string;
  status: string;
  created_at: string;
  user_id: string;
}

export const ModerationQueuePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [memorials, setMemorials] = useState<PendingMemorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemorial, setSelectedMemorial] = useState<PendingMemorial | null>(null);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    fetchPendingMemorials();
  }, [user, navigate]);

  const fetchPendingMemorials = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ items: PendingMemorial[]; total: number; page: number; limit: number; pages: number }>(
        '/admin/memorials/pending'
      );
      setMemorials(response.data?.items ?? []);
    } catch (error) {
      toast.error('Failed to load pending memorials');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (memorialId: string, featureForHome = false) => {
    try {
      await apiClient.post(`/admin/memorials/${memorialId}/approve`, {});
      if (featureForHome) {
        await apiClient.patch(`/admin/memorials/${memorialId}/featured`, { is_featured: true });
        toast.success('Memorial approved and featured on home page');
      } else {
        toast.success('Memorial approved');
      }
      setMemorials(memorials.filter((m) => m.id !== memorialId));
      setSelectedMemorial(null);
    } catch (error) {
      toast.error(featureForHome ? 'Failed to approve and feature' : 'Failed to approve memorial');
      console.error(error);
    }
  };

  const handleReject = async (memorialId: string, reason: string) => {
    try {
      await apiClient.post(`/admin/memorials/${memorialId}/reject`, { reason });
      toast.success('Memorial rejected');
      setMemorials(memorials.filter((m) => m.id !== memorialId));
      setSelectedMemorial(null);
    } catch (error) {
      toast.error('Failed to reject memorial');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Moderation Queue</h1>
          <p className="mt-2 text-gray-600">Review and approve pending memorials</p>
          <p className="mt-1 text-sm text-gray-500">
            When you approve a memorial, it becomes available according to the creator&apos;s privacy setting:
            <strong> Public</strong> (visible to all) or <strong>Link-only</strong> (only via direct link). Specific groups is a future feature.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Reviews ({memorials.length})
              </h2>
            </div>
            {memorials.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                <p>No pending memorials to review</p>
              </div>
            ) : (
              <div className="divide-y max-h-96 overflow-y-auto">
                {memorials.map((memorial) => (
                  <button
                    key={memorial.id}
                    onClick={() => setSelectedMemorial(memorial)}
                    className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition ${
                      selectedMemorial?.id === memorial.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{memorial.full_name}</p>
                    <p className="text-sm text-gray-600">
                      {memorial.birth_date} - {memorial.death_date}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(memorial.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selectedMemorial ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedMemorial.full_name}</h3>
                  <p className="text-gray-600 mt-1">
                    {selectedMemorial.birth_date} - {selectedMemorial.death_date}
                  </p>
                </div>

                <div className="mb-6 pb-6 border-b">
                  <h4 className="font-semibold text-gray-900 mb-2">Story</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMemorial.story}</p>
                </div>

                <div className="mb-6 pb-6 border-b">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Privacy (after approval)</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {selectedMemorial.privacy === 'public' ? '🌍 Public — visible to all' : '🔗 Link-only — only via direct link'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submitted</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {new Date(selectedMemorial.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedMemorial.id)}
                    className="flex-1 min-w-[140px] bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    ✓ Mark as Approved
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedMemorial.id, true)}
                    className="flex-1 min-w-[140px] bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition font-medium"
                    title="Approve and show on home page featured section (public memorials only)"
                  >
                    ★ Approve & Feature
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(selectedMemorial.id, 'Does not meet guidelines')}
                    className="flex-1 min-w-[140px] bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    ✕ Reject
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Featured memorials appear on the home page. Only approved public memorials show there.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-600">
                <p>Select a memorial from the queue to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationQueuePage;
