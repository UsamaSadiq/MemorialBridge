/**
 * Fundraiser Page
 * View and manage fundraisers linked to memorials
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import apiClient from '../api/client';
import { toast } from 'react-toastify';

interface Fundraiser {
  id: string;
  memorialName: string;
  charityName: string;
  charityId: string;
  memorialId: string;
  goalAmount: number;
  raisedAmount: number;
  startDate: string;
  endDate: string;
  description: string;
  status: 'active' | 'ended' | 'cancelled';
  donorCount: number;
  recentDonations: Array<{
    id: string;
    donorName: string;
    amount: number;
    message?: string;
    createdAt: string;
  }>;
}

export const FundraiserPage = () => {
  const { fundraiserId } = useParams<{ fundraiserId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!fundraiserId) {
      navigate('/');
      return;
    }
    fetchFundraiser();
  }, [fundraiserId, navigate]);

  const fetchFundraiser = async () => {
    if (!fundraiserId) return;
    try {
      setLoading(true);
      const response = await apiClient.get<Fundraiser>(
        `/fundraisers/${fundraiserId}`
      );
      setFundraiser(response.data);
    } catch (error) {
      toast.error('Failed to load fundraiser');
      console.error(error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fundraiserId || !donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    try {
      setProcessing(true);
      await apiClient.post(`/fundraisers/${fundraiserId}/donations`, {
        amount: parseFloat(donationAmount),
        message: donationMessage,
      });

      toast.success('Thank you for your donation!');
      setDonationAmount('');
      setDonationMessage('');
      setShowDonateForm(false);
      fetchFundraiser(); // Refresh fundraiser data
    } catch (error) {
      toast.error('Failed to process donation');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!fundraiser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Fundraiser not found</p>
      </div>
    );
  }

  const progressPercentage = Math.min((fundraiser.raisedAmount / fundraiser.goalAmount) * 100, 100);
  const daysRemaining = Math.ceil(
    (new Date(fundraiser.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{fundraiser.memorialName}</h1>
          <p className="text-gray-600">
            Fundraiser for{' '}
            <button
              onClick={() => navigate(`/charities/${fundraiser.charityId}`)}
              className="text-blue-600 hover:underline font-medium"
            >
              {fundraiser.charityName}
            </button>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            {/* Progress Card */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
              <div className="mb-6">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-5xl font-bold text-green-600">
                      ${fundraiser.raisedAmount.toLocaleString()}
                    </p>
                    <p className="text-gray-600">raised</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-gray-900">
                      ${fundraiser.goalAmount.toLocaleString()}
                    </p>
                    <p className="text-gray-600">goal</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm font-semibold text-gray-700 mt-2">
                  {progressPercentage.toFixed(0)}% of goal
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{fundraiser.donorCount}</p>
                  <p className="text-sm text-gray-600">Donors</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{daysRemaining}</p>
                  <p className="text-sm text-gray-600">Days Left</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">
                    {fundraiser.status === 'active' ? '🟢' : '⏸️'}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">{fundraiser.status}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About This Fundraiser</h2>
              <p className="text-gray-700 leading-relaxed">{fundraiser.description}</p>
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Donations</h2>

              {fundraiser.recentDonations.length === 0 ? (
                <p className="text-gray-600">No donations yet. Be the first to donate!</p>
              ) : (
                <div className="space-y-4">
                  {fundraiser.recentDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{donation.donorName}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          ${donation.amount.toLocaleString()}
                        </p>
                      </div>
                      {donation.message && (
                        <p className="text-gray-700 italic">"{donation.message}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Donation CTA */}
          <div>
            {fundraiser.status === 'active' && (
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Make a Donation</h3>

                {!showDonateForm ? (
                  <>
                    <p className="text-gray-600 mb-6">
                      Support this cause by making a donation to {fundraiser.charityName}.
                    </p>
                    <button
                      onClick={() => setShowDonateForm(true)}
                      className="btn btn-primary btn-block"
                    >
                      Donate Now
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleDonate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Donation Amount
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          placeholder="50.00"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        value={donationMessage}
                        onChange={(e) => setDonationMessage(e.target.value)}
                        placeholder="Share your thoughts or memories..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-600"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDonateForm(false);
                          setDonationAmount('');
                          setDonationMessage('');
                        }}
                        className="btn btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary flex-1"
                      >
                        {processing ? 'Processing...' : 'Donate'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {fundraiser.status !== 'active' && (
              <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
                <p className="text-gray-600 text-center">
                  This fundraiser is no longer accepting donations.
                </p>
              </div>
            )}

            {/* Fundraiser Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-900">
                <strong>Donation Safety:</strong> All donations are securely processed through our
                payment partner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundraiserPage;
