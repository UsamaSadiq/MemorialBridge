import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Donation Page
 * Manage and view donation history
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import apiClient from '../api/client';
import { toast } from 'react-toastify';
export const DonationPage = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [donations, setDonations] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchDonations();
        fetchStats();
    }, [token, navigate, filterStatus, sortBy]);
    const fetchDonations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filterStatus !== 'all')
                params.append('status', filterStatus);
            params.append('sortBy', sortBy);
            const response = await apiClient.get(`/donations?${params.toString()}`);
            setDonations(response.data);
        }
        catch (error) {
            toast.error('Failed to load donations');
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    const fetchStats = async () => {
        try {
            const response = await apiClient.get('/donations/stats');
            setStats(response.data);
        }
        catch (error) {
            console.error('Failed to load donation stats', error);
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "My Donations" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Track and manage your charitable donations" })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [stats && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Total Donated" }), _jsxs("p", { className: "text-3xl font-bold text-green-600", children: ["$", stats.totalDonated.toLocaleString()] }), _jsx("p", { className: "text-xs text-gray-600 mt-2", children: "Your total contribution" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Donations" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: stats.donationCount }), _jsx("p", { className: "text-xs text-gray-600 mt-2", children: "Number of donations" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Average Donation" }), _jsxs("p", { className: "text-3xl font-bold text-purple-600", children: ["$", stats.averageDonation.toLocaleString()] }), _jsx("p", { className: "text-xs text-gray-600 mt-2", children: "Per donation" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Favorite Cause" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.favorites[0]?.charityName || 'N/A' }), _jsxs("p", { className: "text-xs text-gray-600 mt-2", children: [stats.favorites[0]?.count, " donations"] })] })] })), _jsx("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Filter by Status" }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer text-gray-900", children: [_jsx("option", { value: "all", children: "All Donations" }), _jsx("option", { value: "completed", children: "\u2705 Completed" }), _jsx("option", { value: "pending", children: "\u23F3 Pending" }), _jsx("option", { value: "failed", children: "\u274C Failed" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Sort By" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer text-gray-900", children: [_jsx("option", { value: "recent", children: "Most Recent" }), _jsx("option", { value: "amount", children: "Highest Amount" })] })] })] }) }), loading && (_jsx("div", { className: "flex justify-center items-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) })), !loading && donations.length === 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-12 text-center", children: [_jsx("p", { className: "text-2xl font-bold text-gray-900 mb-2", children: "No donations yet" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Start making a difference by supporting charities through memorials" }), _jsx("button", { onClick: () => navigate('/charities'), className: "btn btn-primary", children: "Browse Charities" })] })), !loading && donations.length > 0 && (_jsx("div", { className: "space-y-4", children: donations.map((donation) => (_jsx("div", { className: "bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-center", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: donation.charityName }), _jsx("p", { className: "text-sm text-gray-600", children: donation.fundraiserName }), donation.message && (_jsxs("p", { className: "text-sm text-gray-700 italic mt-2", children: ["\"", donation.message, "\""] }))] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("p", { className: "text-sm text-gray-600", children: new Date(donation.createdAt).toLocaleDateString() }), _jsx("span", { className: `inline-block px-3 py-1 rounded-full text-sm font-semibold w-fit ${getStatusBadge(donation.status)}`, children: donation.status.charAt(0).toUpperCase() + donation.status.slice(1) })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("p", { className: "text-2xl font-bold text-green-600", children: ["$", donation.amount.toLocaleString()] }), donation.receiptUrl && (_jsx("a", { href: donation.receiptUrl, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:text-blue-700 font-medium text-sm", children: "View Receipt \u2192" }))] })] }) }, donation.id))) })), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8", children: [_jsx("h3", { className: "font-semibold text-blue-900 mb-2", children: "\uD83D\uDCBC Tax Information" }), _jsx("p", { className: "text-blue-800 text-sm", children: "We provide tax receipts for all donations to qualified charities. Receipts are available for download in your donation details. Consult your tax professional about the deductibility of your donations." })] })] })] }));
};
export default DonationPage;
