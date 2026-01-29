/**
 * Charity Detail Page
 * View detailed information about a charity and create fundraisers
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import apiClient from '../api/client';
import { toast } from 'react-toastify';

interface CharityDetail {
  id: string;
  name: string;
  description: string;
  url?: string;
  is_active?: boolean;
  created_at?: string;
  image?: string;
  category?: string;
}

export const CharityDetailPage = () => {
  const { charityId } = useParams<{ charityId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [charity, setCharity] = useState<CharityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!charityId) {
      navigate('/charities');
      return;
    }
    fetchCharityDetails();
  }, [charityId, navigate]);

  const fetchCharityDetails = async () => {
    if (!charityId) return;
    try {
      setLoading(true);
      const response = await apiClient.get<CharityDetail>(
        `/charities/${charityId}`
      );
      setCharity(response.data);
    } catch (error) {
      toast.error('Failed to load charity details');
      console.error(error);
      navigate('/charities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-warmgray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green-400 mx-auto mb-4"></div>
          <p className="text-warmgray-700 text-sm">Loading charity details...</p>
        </div>
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warmgray-50">
        <div className="text-center">
          <p className="text-warmgray-800 text-lg mb-4">Charity not found</p>
          <button
            onClick={() => navigate('/charities')}
            className="text-brand-green-600 hover:text-brand-green-700 font-medium"
          >
            ← Back to Charities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmgray-50">
      {/* Hero Section - Warm and inviting */}
      <div className="relative h-80 bg-gradient-to-br from-brand-green-200 via-brand-green-300 to-brand-blue-300 overflow-hidden">
        {charity.image && (
          <img
            src={charity.image}
            alt={charity.name}
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/20 to-transparent">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <button
              onClick={() => navigate('/charities')}
              className="text-white hover:text-warmgray-100 mb-4 flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Charities
            </button>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{charity.name}</h1>
            {charity.category && (
              <p className="text-white/90 mt-2 text-lg">{charity.category}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Compassionate layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-comfort shadow-soft p-8 border border-brand-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl font-semibold text-warmgray-900">About This Charity</h2>
              </div>
              <p className="text-warmgray-700 leading-relaxed text-lg">{charity.description}</p>
            </div>

            {/* Website Link */}
            {charity.url && (
              <div className="bg-gradient-to-br from-brand-blue-50 to-white rounded-comfort shadow-gentle p-8 border border-brand-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h2 className="font-heading text-2xl font-semibold text-warmgray-900">Learn More</h2>
                </div>
                <a
                  href={charity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue-600 hover:text-brand-blue-700 font-medium break-all underline decoration-2 underline-offset-2 transition-colors"
                >
                  {charity.url}
                </a>
              </div>
            )}
          </div>

          {/* Right Column - CTA - Warm and inviting */}
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="bg-gradient-to-br from-brand-green-50 to-white rounded-comfort shadow-soft p-6 border border-brand-green-200 sticky top-4">
              <h3 className="font-heading text-lg font-semibold text-warmgray-900 mb-4 text-center">
                Honor Someone Special
              </h3>
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(`/memorials/create?charity=${charity.id}`)}
                    className="btn btn-success btn-block mb-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Memorial
                  </button>
                  {charity.url && (
                    <a
                      href={charity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-white border-2 border-brand-green-300 text-brand-green-700 py-3 rounded-soft hover:bg-brand-green-50 transition-all font-semibold text-center"
                    >
                      Donate Directly
                    </a>
                  )}
                  <p className="text-xs text-warmgray-700 mt-4 text-center italic">
                    Create a memorial and inspire others to support this cause
                  </p>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="btn btn-primary btn-block"
                  >
                    Sign in to Create Memorial
                  </button>
                  <p className="text-xs text-warmgray-700 mt-4 text-center">
                    Sign in to honor someone with a memorial linked to this charity
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityDetailPage;
