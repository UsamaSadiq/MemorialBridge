import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Settings Page
 * System configuration and preferences
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';
export const SettingsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [settings, setSettings] = useState(null);
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
            const response = await apiClient.get('/admin/settings');
            setSettings(response.data);
        }
        catch (error) {
            toast.error('Failed to load settings');
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSettingChange = async (key, value) => {
        if (!settings)
            return;
        const updated = { ...settings, [key]: value };
        setSettings(updated);
        try {
            setSaving(true);
            await apiClient.put('/admin/settings', { [key]: value });
            toast.success('Setting updated successfully');
        }
        catch (error) {
            setSettings(settings); // Revert on error
            toast.error('Failed to update setting');
            console.error(error);
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    if (!settings) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-gray-700", children: "Failed to load settings" }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "System Settings" }), _jsx("p", { className: "mt-2 text-gray-700", children: "Manage system-wide configuration and preferences" })] }) }) }), _jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900 mb-6 flex items-center", children: [_jsx("span", { className: "text-xl mr-3", children: "\uD83D\uDEE0\uFE0F" }), "System Status"] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Maintenance Mode" }), _jsx("p", { className: "text-sm text-gray-600", children: "Temporarily disable user access while performing maintenance" })] }), _jsx("button", { onClick: () => handleSettingChange('maintenanceMode', !settings.maintenanceMode), disabled: saving, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode
                                                    ? 'bg-red-600'
                                                    : 'bg-gray-300'} disabled:opacity-50`, children: _jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}` }) })] }), _jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Email Notifications" }), _jsx("p", { className: "text-sm text-gray-600", children: "Send system notifications and alerts via email" })] }), _jsx("button", { onClick: () => handleSettingChange('emailNotifications', !settings.emailNotifications), disabled: saving, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications
                                                    ? 'bg-green-600'
                                                    : 'bg-gray-300'} disabled:opacity-50`, children: _jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}` }) })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900 mb-6 flex items-center", children: [_jsx("span", { className: "text-xl mr-3", children: "\uD83D\uDE80" }), "Features"] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Allow Public Memorials" }), _jsx("p", { className: "text-sm text-gray-600", children: "Enable users to create publicly visible memorials" })] }), _jsx("button", { onClick: () => handleSettingChange('allowPublicMemorials', !settings.allowPublicMemorials), disabled: saving, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.allowPublicMemorials
                                                    ? 'bg-green-600'
                                                    : 'bg-gray-300'} disabled:opacity-50`, children: _jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.allowPublicMemorials ? 'translate-x-6' : 'translate-x-1'}` }) })] }), _jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Charity Integration" }), _jsx("p", { className: "text-sm text-gray-600", children: "Enable fundraising and charity donation features" })] }), _jsx("button", { onClick: () => handleSettingChange('enableCharityIntegration', !settings.enableCharityIntegration), disabled: saving, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableCharityIntegration
                                                    ? 'bg-green-600'
                                                    : 'bg-gray-300'} disabled:opacity-50`, children: _jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableCharityIntegration ? 'translate-x-6' : 'translate-x-1'}` }) })] }), _jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Email Verification Required" }), _jsx("p", { className: "text-sm text-gray-600", children: "Require email verification during user registration" })] }), _jsx("button", { onClick: () => handleSettingChange('requireEmailVerification', !settings.requireEmailVerification), disabled: saving, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.requireEmailVerification
                                                    ? 'bg-green-600'
                                                    : 'bg-gray-300'} disabled:opacity-50`, children: _jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'}` }) })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900 mb-6 flex items-center", children: [_jsx("span", { className: "text-xl mr-3", children: "\uD83D\uDCCF" }), "Limits & Constraints"] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Max Memorial Size (KB)" }), _jsx("input", { type: "number", value: settings.maxMemorialSize, onChange: (e) => handleSettingChange('maxMemorialSize', parseInt(e.target.value) || 0), disabled: saving, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Maximum size for memorial content upload" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Max Comment Length (characters)" }), _jsx("input", { type: "number", value: settings.maxCommentLength, onChange: (e) => handleSettingChange('maxCommentLength', parseInt(e.target.value) || 0), disabled: saving, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Character limit for comments" })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900 mb-6 flex items-center", children: [_jsx("span", { className: "text-xl mr-3", children: "\uD83D\uDEE1\uFE0F" }), "Moderation"] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-3", children: "Automated Moderation Level" }), _jsxs("select", { value: settings.automatedModerationLevel, onChange: (e) => handleSettingChange('automatedModerationLevel', e.target.value), disabled: saving, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100", children: [_jsx("option", { value: "lenient", children: "\uD83D\uDFE2 Lenient - Few flags, more manual review needed" }), _jsx("option", { value: "moderate", children: "\uD83D\uDFE1 Moderate - Balanced approach" }), _jsx("option", { value: "strict", children: "\uD83D\uDD34 Strict - More flags, less manual review" })] }), _jsx("p", { className: "text-xs text-gray-600 mt-2", children: "Determines how aggressively the system filters potentially inappropriate content" })] })] }), _jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start", children: [_jsx("div", { className: "text-yellow-600 mr-3 text-xl", children: "\u26A0\uFE0F" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-yellow-900", children: "Settings Impact" }), _jsx("p", { className: "text-sm text-yellow-700 mt-1", children: "Changes to these settings affect all users and may impact system behavior. Please review changes carefully before applying." })] })] })] })] }));
};
export default SettingsPage;
