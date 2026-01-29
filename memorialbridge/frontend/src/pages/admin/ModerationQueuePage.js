import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Moderation Queue Page
 * Review and approve/reject pending memorials
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';
export const ModerationQueuePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [memorials, setMemorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMemorial, setSelectedMemorial] = useState(null);
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
            const response = await apiClient.get('/admin/memorials/pending');
            setMemorials(response.data?.items ?? []);
        }
        catch (error) {
            toast.error('Failed to load pending memorials');
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleApprove = async (memorialId, featureForHome = false) => {
        try {
            await apiClient.post(`/admin/memorials/${memorialId}/approve`, {});
            if (featureForHome) {
                await apiClient.patch(`/admin/memorials/${memorialId}/featured`, { is_featured: true });
                toast.success('Memorial approved and featured on home page');
            }
            else {
                toast.success('Memorial approved');
            }
            setMemorials(memorials.filter((m) => m.id !== memorialId));
            setSelectedMemorial(null);
        }
        catch (error) {
            toast.error(featureForHome ? 'Failed to approve and feature' : 'Failed to approve memorial');
            console.error(error);
        }
    };
    const handleReject = async (memorialId, reason) => {
        try {
            await apiClient.post(`/admin/memorials/${memorialId}/reject`, { reason });
            toast.success('Memorial rejected');
            setMemorials(memorials.filter((m) => m.id !== memorialId));
            setSelectedMemorial(null);
        }
        catch (error) {
            toast.error('Failed to reject memorial');
            console.error(error);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Moderation Queue" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Review and approve pending memorials" }), _jsxs("p", { className: "mt-1 text-sm text-gray-500", children: ["When you approve a memorial, it becomes available according to the creator's privacy setting:", _jsx("strong", { children: " Public" }), " (visible to all) or ", _jsx("strong", { children: "Link-only" }), " (only via direct link). Specific groups is a future feature."] })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-1 bg-white rounded-lg shadow-sm", children: [_jsx("div", { className: "border-b p-6", children: _jsxs("h2", { className: "text-lg font-semibold text-gray-900", children: ["Pending Reviews (", memorials.length, ")"] }) }), memorials.length === 0 ? (_jsx("div", { className: "p-6 text-center text-gray-600", children: _jsx("p", { children: "No pending memorials to review" }) })) : (_jsx("div", { className: "divide-y max-h-96 overflow-y-auto", children: memorials.map((memorial) => (_jsxs("button", { onClick: () => setSelectedMemorial(memorial), className: `w-full text-left px-6 py-4 hover:bg-gray-50 transition ${selectedMemorial?.id === memorial.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`, children: [_jsx("p", { className: "font-semibold text-gray-900", children: memorial.full_name }), _jsxs("p", { className: "text-sm text-gray-600", children: [memorial.birth_date, " - ", memorial.death_date] }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: new Date(memorial.created_at).toLocaleDateString() })] }, memorial.id))) }))] }), _jsx("div", { className: "lg:col-span-2", children: selectedMemorial ? (_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900", children: selectedMemorial.full_name }), _jsxs("p", { className: "text-gray-600 mt-1", children: [selectedMemorial.birth_date, " - ", selectedMemorial.death_date] })] }), _jsxs("div", { className: "mb-6 pb-6 border-b", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Story" }), _jsx("p", { className: "text-gray-700 whitespace-pre-wrap", children: selectedMemorial.story })] }), _jsx("div", { className: "mb-6 pb-6 border-b", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Privacy (after approval)" }), _jsx("p", { className: "font-semibold text-gray-900 mt-1", children: selectedMemorial.privacy === 'public' ? '🌍 Public — visible to all' : '🔗 Link-only — only via direct link' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Submitted" }), _jsx("p", { className: "font-semibold text-gray-900 mt-1", children: new Date(selectedMemorial.created_at).toLocaleDateString() })] })] }) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx("button", { type: "button", onClick: () => handleApprove(selectedMemorial.id), className: "flex-1 min-w-[140px] bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium", children: "\u2713 Mark as Approved" }), _jsx("button", { type: "button", onClick: () => handleApprove(selectedMemorial.id, true), className: "flex-1 min-w-[140px] bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition font-medium", title: "Approve and show on home page featured section (public memorials only)", children: "\u2605 Approve & Feature" }), _jsx("button", { type: "button", onClick: () => handleReject(selectedMemorial.id, 'Does not meet guidelines'), className: "flex-1 min-w-[140px] bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium", children: "\u2715 Reject" })] }), _jsx("p", { className: "mt-2 text-xs text-gray-500", children: "Featured memorials appear on the home page. Only approved public memorials show there." })] })) : (_jsx("div", { className: "bg-white rounded-lg shadow-sm p-6 text-center text-gray-600", children: _jsx("p", { children: "Select a memorial from the queue to review" }) })) })] }) })] }));
};
export default ModerationQueuePage;
