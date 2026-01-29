import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Fundraiser Page
 * View and manage fundraisers linked to memorials
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import apiClient from '../api/client';
import { toast } from 'react-toastify';
export const FundraiserPage = () => {
    const { fundraiserId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [fundraiser, setFundraiser] = useState(null);
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
        if (!fundraiserId)
            return;
        try {
            setLoading(true);
            const response = await apiClient.get(`/fundraisers/${fundraiserId}`);
            setFundraiser(response.data);
        }
        catch (error) {
            toast.error('Failed to load fundraiser');
            console.error(error);
            navigate('/');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDonate = async (e) => {
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
        }
        catch (error) {
            toast.error('Failed to process donation');
            console.error(error);
        }
        finally {
            setProcessing(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    if (!fundraiser) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-gray-600", children: "Fundraiser not found" }) }));
    }
    const progressPercentage = Math.min((fundraiser.raisedAmount / fundraiser.goalAmount) * 100, 100);
    const daysRemaining = Math.ceil((new Date(fundraiser.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("button", { onClick: () => navigate(-1), className: "text-blue-600 hover:text-blue-700 mb-4 flex items-center", children: "\u2190 Back" }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: fundraiser.memorialName }), _jsxs("p", { className: "text-gray-600", children: ["Fundraiser for", ' ', _jsx("button", { onClick: () => navigate(`/charities/${fundraiser.charityId}`), className: "text-blue-600 hover:underline font-medium", children: fundraiser.charityName })] })] }) }), _jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-8 mb-6", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between items-end mb-3", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-5xl font-bold text-green-600", children: ["$", fundraiser.raisedAmount.toLocaleString()] }), _jsx("p", { className: "text-gray-600", children: "raised" })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-xl font-semibold text-gray-900", children: ["$", fundraiser.goalAmount.toLocaleString()] }), _jsx("p", { className: "text-gray-600", children: "goal" })] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-4", children: _jsx("div", { className: "bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-300", style: { width: `${progressPercentage}%` } }) }), _jsxs("p", { className: "text-center text-sm font-semibold text-gray-700 mt-2", children: [progressPercentage.toFixed(0), "% of goal"] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 pt-6 border-t border-gray-200", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-blue-600", children: fundraiser.donorCount }), _jsx("p", { className: "text-sm text-gray-600", children: "Donors" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-purple-600", children: daysRemaining }), _jsx("p", { className: "text-sm text-gray-600", children: "Days Left" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-gray-600", children: fundraiser.status === 'active' ? '🟢' : '⏸️' }), _jsx("p", { className: "text-sm text-gray-600 capitalize", children: fundraiser.status })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "About This Fundraiser" }), _jsx("p", { className: "text-gray-700 leading-relaxed", children: fundraiser.description })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Recent Donations" }), fundraiser.recentDonations.length === 0 ? (_jsx("p", { className: "text-gray-600", children: "No donations yet. Be the first to donate!" })) : (_jsx("div", { className: "space-y-4", children: fundraiser.recentDonations.map((donation) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: donation.donorName }), _jsx("p", { className: "text-sm text-gray-600", children: new Date(donation.createdAt).toLocaleDateString() })] }), _jsxs("p", { className: "text-lg font-bold text-green-600", children: ["$", donation.amount.toLocaleString()] })] }), donation.message && (_jsxs("p", { className: "text-gray-700 italic", children: ["\"", donation.message, "\""] }))] }, donation.id))) }))] })] }), _jsxs("div", { children: [fundraiser.status === 'active' && (_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 sticky top-24", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: "Make a Donation" }), !showDonateForm ? (_jsxs(_Fragment, { children: [_jsxs("p", { className: "text-gray-600 mb-6", children: ["Support this cause by making a donation to ", fundraiser.charityName, "."] }), _jsx("button", { onClick: () => setShowDonateForm(true), className: "btn btn-primary btn-block", children: "Donate Now" })] })) : (_jsxs("form", { onSubmit: handleDonate, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Donation Amount" }), _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "text-gray-600 mr-2", children: "$" }), _jsx("input", { type: "number", step: "0.01", min: "0", value: donationAmount, onChange: (e) => setDonationAmount(e.target.value), placeholder: "50.00", className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Message (Optional)" }), _jsx("textarea", { value: donationMessage, onChange: (e) => setDonationMessage(e.target.value), placeholder: "Share your thoughts or memories...", rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-600" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => {
                                                                setShowDonateForm(false);
                                                                setDonationAmount('');
                                                                setDonationMessage('');
                                                            }, className: "btn btn-secondary flex-1", children: "Cancel" }), _jsx("button", { type: "submit", disabled: processing, className: "btn btn-primary flex-1", children: processing ? 'Processing...' : 'Donate' })] })] }))] })), fundraiser.status !== 'active' && (_jsx("div", { className: "bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200", children: _jsx("p", { className: "text-gray-600 text-center", children: "This fundraiser is no longer accepting donations." }) })), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6", children: _jsxs("p", { className: "text-sm text-blue-900", children: [_jsx("strong", { children: "Donation Safety:" }), " All donations are securely processed through our payment partner."] }) })] })] }) })] }));
};
export default FundraiserPage;
