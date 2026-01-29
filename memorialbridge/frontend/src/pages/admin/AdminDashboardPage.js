import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Admin Dashboard Page
 * Overview of system statistics and key metrics
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';
export const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!user?.is_admin) {
            navigate('/');
            return;
        }
        fetchStats();
    }, [user, navigate]);
    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/admin/stats');
            setStats(response.data);
        }
        catch (error) {
            toast.error('Failed to load dashboard statistics');
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    if (!stats) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-gray-600", children: "Failed to load dashboard" }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Admin Dashboard" }), _jsx("p", { className: "mt-2 text-gray-600", children: "System overview and key metrics" })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { onClick: () => navigate('/admin/users'), className: "bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Total Users" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.totalUsers })] }), _jsx("div", { className: "bg-blue-100 rounded-full p-4", children: _jsx("svg", { className: "w-8 h-8 text-blue-600", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" }) }) })] }), _jsxs("p", { className: "text-xs text-gray-600 mt-4", children: [stats.registeredToday, " registered today"] })] }), _jsxs("div", { onClick: () => navigate('/admin/moderation'), className: "bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Total Memorials" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.totalMemorials })] }), _jsx("div", { className: "bg-purple-100 rounded-full p-4", children: _jsx("svg", { className: "w-8 h-8 text-purple-600", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" }) }) })] }), _jsxs("p", { className: "text-xs text-gray-600 mt-4", children: [stats.memorialsCreatedToday, " created today"] })] }), _jsxs("div", { onClick: () => navigate('/admin/moderation'), className: "bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer border-2 border-yellow-200", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Pending Approval" }), _jsx("p", { className: "text-3xl font-bold text-yellow-600 mt-2", children: stats.pendingMemorials })] }), _jsx("div", { className: "bg-yellow-100 rounded-full p-4", children: _jsx("svg", { className: "w-8 h-8 text-yellow-600", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" }) }) })] }), _jsx("p", { className: "text-xs text-yellow-600 mt-4", children: "Requires immediate attention" })] }), _jsx("div", { className: "bg-white rounded-lg shadow-sm p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Approved Memorials" }), _jsx("p", { className: "text-3xl font-bold text-green-600 mt-2", children: stats.approvedMemorials })] }), _jsx("div", { className: "bg-green-100 rounded-full p-4", children: _jsx("svg", { className: "w-8 h-8 text-green-600", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }) })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Rejected Memorials" }), _jsx("p", { className: "text-3xl font-bold text-red-600 mt-2", children: stats.rejectedMemorials })] }), _jsx("div", { className: "bg-red-100 rounded-full p-4", children: _jsx("svg", { className: "w-8 h-8 text-red-600", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Total Comments" }), _jsx("p", { className: "text-3xl font-bold text-indigo-600 mt-2", children: stats.totalComments })] }), _jsx("div", { className: "bg-indigo-100 rounded-full p-4", children: _jsx("svg", { className: "w-8 h-8 text-indigo-600", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" }) }) })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("button", { onClick: () => navigate('/admin/moderation'), className: "bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg hover:bg-yellow-100 transition border border-yellow-200 font-medium", children: ["Review Pending (", stats.pendingMemorials, ")"] }), _jsx("button", { onClick: () => navigate('/admin/users'), className: "bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition border border-blue-200 font-medium", children: "Manage Users" }), _jsx("button", { onClick: () => navigate('/admin/reports'), className: "bg-green-50 text-green-700 px-4 py-3 rounded-lg hover:bg-green-100 transition border border-green-200 font-medium", children: "View Reports" }), _jsx("button", { onClick: () => navigate('/admin/settings'), className: "bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition border border-gray-200 font-medium", children: "Settings" }), _jsx("button", { onClick: () => navigate('/admin/charities'), className: "bg-teal-50 text-teal-700 px-4 py-3 rounded-lg hover:bg-teal-100 transition border border-teal-200 font-medium", children: "Manage Charities" })] })] })] })] }));
};
export default AdminDashboardPage;
