import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Reports Page
 * System analytics and statistics
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';
export const ReportsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('7days');
    useEffect(() => {
        if (!user?.is_admin) {
            navigate('/');
            return;
        }
        fetchReports();
    }, [user, navigate, dateRange]);
    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/admin/reports?range=${dateRange}`);
            setReports(response.data);
        }
        catch (error) {
            toast.error('Failed to load reports');
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    if (!reports) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-gray-700", children: "Failed to load reports" }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Reports & Analytics" }), _jsx("p", { className: "mt-2 text-gray-700", children: "System insights and statistics" })] }), _jsx("div", { children: _jsxs("select", { value: dateRange, onChange: (e) => setDateRange(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900", children: [_jsx("option", { value: "7days", children: "Last 7 Days" }), _jsx("option", { value: "30days", children: "Last 30 Days" }), _jsx("option", { value: "90days", children: "Last 90 Days" }), _jsx("option", { value: "all", children: "All Time" })] }) })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Memorial Status" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Approved" }), _jsx("span", { className: "text-sm font-semibold text-green-600", children: reports.statusDistribution.approved })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-green-600 h-2 rounded-full", style: {
                                                                width: `${(reports.statusDistribution.approved /
                                                                    Object.values(reports.statusDistribution).reduce((a, b) => a + b, 0)) *
                                                                    100}%`,
                                                            } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Pending" }), _jsx("span", { className: "text-sm font-semibold text-yellow-600", children: reports.statusDistribution.pending })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-yellow-600 h-2 rounded-full", style: {
                                                                width: `${(reports.statusDistribution.pending /
                                                                    Object.values(reports.statusDistribution).reduce((a, b) => a + b, 0)) *
                                                                    100}%`,
                                                            } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Rejected" }), _jsx("span", { className: "text-sm font-semibold text-red-600", children: reports.statusDistribution.rejected })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-red-600 h-2 rounded-full", style: {
                                                                width: `${(reports.statusDistribution.rejected /
                                                                    Object.values(reports.statusDistribution).reduce((a, b) => a + b, 0)) *
                                                                    100}%`,
                                                            } }) })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Privacy Settings" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "\uD83C\uDF0D Public" }), _jsx("span", { className: "text-sm font-semibold text-blue-600", children: reports.privacyDistribution.public })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full", style: {
                                                                width: `${(reports.privacyDistribution.public /
                                                                    Object.values(reports.privacyDistribution).reduce((a, b) => a + b, 0)) *
                                                                    100}%`,
                                                            } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "\uD83D\uDD17 Link-only" }), _jsx("span", { className: "text-sm font-semibold text-purple-600", children: reports.privacyDistribution.linkOnly })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-purple-600 h-2 rounded-full", style: {
                                                                width: `${(reports.privacyDistribution.linkOnly /
                                                                    Object.values(reports.privacyDistribution).reduce((a, b) => a + b, 0)) *
                                                                    100}%`,
                                                            } }) })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-8", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Top Memorials by Engagement" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Memorial" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Comments" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: reports.topMemorials.map((memorial, index) => (_jsxs("tr", { className: "hover:bg-gray-50 transition", children: [_jsxs("td", { className: "px-6 py-4 text-sm text-gray-900", children: [_jsxs("span", { className: "font-semibold mr-3", children: [index + 1, "."] }), memorial.name] }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: _jsxs("span", { className: "inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold", children: [memorial.comments, " comments"] }) })] }, memorial.id))) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Memorials Created" }), _jsx("div", { className: "space-y-3", children: reports.memorialsPerDay.slice(-7).map((data) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-sm text-gray-700", children: data.date }), _jsx("span", { className: "text-sm font-semibold text-gray-900", children: data.count })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-green-600 h-2 rounded-full", style: { width: `${Math.min((data.count / 10) * 100, 100)}%` } }) })] }, data.date))) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-6", children: "New Users" }), _jsx("div", { className: "space-y-3", children: reports.usersPerDay.slice(-7).map((data) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-sm text-gray-700", children: data.date }), _jsx("span", { className: "text-sm font-semibold text-gray-900", children: data.count })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: `${Math.min((data.count / 10) * 100, 100)}%` } }) })] }, data.date))) })] })] })] })] }));
};
export default ReportsPage;
