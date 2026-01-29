import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Admin Charities Page
 * Add and manage charities (admin only)
 */
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { adminAPI } from '../../api/admin';
import { toast } from 'react-toastify';
export const AdminCharitiesPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [charities, setCharities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    useEffect(() => {
        if (!user?.is_admin) {
            navigate('/');
            return;
        }
        fetchCharities();
    }, [user, navigate]);
    const fetchCharities = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.listCharities(1, 200);
            setCharities(data.items ?? []);
        }
        catch (error) {
            toast.error('Failed to load charities');
            console.error(error);
            setCharities([]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedUrl = url.trim();
        if (!trimmedName || !trimmedUrl) {
            toast.error('Name and URL are required');
            return;
        }
        try {
            setSubmitting(true);
            await adminAPI.createCharity({
                name: trimmedName,
                description: description.trim() || undefined,
                url: trimmedUrl,
            });
            toast.success('Charity added successfully');
            setName('');
            setDescription('');
            setUrl('');
            fetchCharities();
        }
        catch (error) {
            const message = error && typeof error === 'object' && 'response' in error
                ? error.response?.data?.detail
                : null;
            toast.error(message || 'Failed to add charity');
            console.error(error);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Manage Charities" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Add and manage charities available for memorial fundraisers" })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-8", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Add Charity" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 max-w-xl", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "charity-name", className: "block text-sm font-medium text-gray-700 mb-1", children: "Name *" }), _jsx("input", { id: "charity-name", type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Charity name", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "charity-description", className: "block text-sm font-medium text-gray-700 mb-1", children: "Description (optional)" }), _jsx("textarea", { id: "charity-description", rows: 3, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Brief description of the charity", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "charity-url", className: "block text-sm font-medium text-gray-700 mb-1", children: "Website URL *" }), _jsx("input", { id: "charity-url", type: "url", value: url, onChange: (e) => setUrl(e.target.value), placeholder: "https://...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900", required: true })] }), _jsx("button", { type: "submit", disabled: submitting, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium", children: submitting ? 'Adding…' : 'Add Charity' })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Existing Charities" }), _jsx(Link, { to: "/charities", className: "text-sm text-blue-600 hover:text-blue-700 font-medium", children: "View public list \u2192" })] }), loading ? (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" }) })) : charities.length === 0 ? (_jsx("p", { className: "text-gray-500 py-8", children: "No charities yet. Add one above." })) : (_jsx("ul", { className: "divide-y divide-gray-200", children: charities.map((c) => (_jsxs("li", { className: "py-4 flex flex-wrap items-center justify-between gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: c.name }), c.description && (_jsx("p", { className: "text-sm text-gray-600 mt-0.5 line-clamp-2", children: c.description })), _jsx("a", { href: c.url, target: "_blank", rel: "noopener noreferrer", className: "text-sm text-blue-600 hover:underline mt-1 inline-block", children: c.url })] }), _jsx("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-medium ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`, children: c.is_active ? 'Active' : 'Inactive' })] }, c.id))) }))] })] })] }));
};
export default AdminCharitiesPage;
