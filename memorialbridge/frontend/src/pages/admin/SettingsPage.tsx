/**
 * Settings Page
 * System configuration and preferences
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';

interface SystemSettings {
  maintenanceMode: boolean;
  maxMemorialSize: number;
  maxCommentLength: number;
  requireEmailVerification: boolean;
  enableCharityIntegration: boolean;
  allowPublicMemorials: boolean;
  automatedModerationLevel: 'strict' | 'moderate' | 'lenient';
  emailNotifications: boolean;
}

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    fetchSettings();
  }, [user, navigate]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<SystemSettings>('/admin/settings');
      setSettings(response.data);
    } catch (error) {
      toast.error('Failed to load settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key: keyof SystemSettings, value: boolean | string | number) => {
    if (!settings) return;

    const updated = { ...settings, [key]: value };
    setSettings(updated);

    try {
      setSaving(true);
      await apiClient.put('/admin/settings', { [key]: value });
      toast.success('Setting updated successfully');
    } catch (error) {
      setSettings(settings); // Revert on error
      toast.error('Failed to update setting');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="mt-2 text-gray-700">Manage system-wide configuration and preferences</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <span className="text-xl mr-3">🛠️</span>
            System Status
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div>
                <p className="font-medium text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Temporarily disable user access while performing maintenance</p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange('maintenanceMode', !settings.maintenanceMode)
                }
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode
                    ? 'bg-red-600'
                    : 'bg-gray-300'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Send system notifications and alerts via email</p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange('emailNotifications', !settings.emailNotifications)
                }
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Flags Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <span className="text-xl mr-3">🚀</span>
            Features
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div>
                <p className="font-medium text-gray-900">Allow Public Memorials</p>
                <p className="text-sm text-gray-600">Enable users to create publicly visible memorials</p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange('allowPublicMemorials', !settings.allowPublicMemorials)
                }
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.allowPublicMemorials
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.allowPublicMemorials ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div>
                <p className="font-medium text-gray-900">Charity Integration</p>
                <p className="text-sm text-gray-600">Enable fundraising and charity donation features</p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange(
                    'enableCharityIntegration',
                    !settings.enableCharityIntegration
                  )
                }
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableCharityIntegration
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableCharityIntegration ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div>
                <p className="font-medium text-gray-900">Email Verification Required</p>
                <p className="text-sm text-gray-600">Require email verification during user registration</p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange(
                    'requireEmailVerification',
                    !settings.requireEmailVerification
                  )
                }
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.requireEmailVerification
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Limits Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <span className="text-xl mr-3">📏</span>
            Limits & Constraints
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Max Memorial Size (KB)
              </label>
              <input
                type="number"
                value={settings.maxMemorialSize}
                onChange={(e) =>
                  handleSettingChange('maxMemorialSize', parseInt(e.target.value) || 0)
                }
                disabled={saving}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-600 mt-1">Maximum size for memorial content upload</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Max Comment Length (characters)
              </label>
              <input
                type="number"
                value={settings.maxCommentLength}
                onChange={(e) =>
                  handleSettingChange('maxCommentLength', parseInt(e.target.value) || 0)
                }
                disabled={saving}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-600 mt-1">Character limit for comments</p>
            </div>
          </div>
        </div>

        {/* Moderation Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <span className="text-xl mr-3">🛡️</span>
            Moderation
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Automated Moderation Level
            </label>
            <select
              value={settings.automatedModerationLevel}
              onChange={(e) =>
                handleSettingChange(
                  'automatedModerationLevel',
                  e.target.value as 'strict' | 'moderate' | 'lenient'
                )
              }
              disabled={saving}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="lenient">🟢 Lenient - Few flags, more manual review needed</option>
              <option value="moderate">🟡 Moderate - Balanced approach</option>
              <option value="strict">🔴 Strict - More flags, less manual review</option>
            </select>
            <p className="text-xs text-gray-600 mt-2">
              Determines how aggressively the system filters potentially inappropriate content
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
          <div className="text-yellow-600 mr-3 text-xl">⚠️</div>
          <div>
            <p className="font-medium text-yellow-900">Settings Impact</p>
            <p className="text-sm text-yellow-700 mt-1">
              Changes to these settings affect all users and may impact system behavior. Please review
              changes carefully before applying.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
