import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Delete Memorial Page
 * Confirmation page for deleting a memorial
 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../hooks';
import { toast } from 'react-toastify';
export const DeleteMemorialPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [memorial, setMemorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    useEffect(() => {
        fetchMemorial();
    }, [id]);
    const fetchMemorial = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/memorials/${id}`);
            // Check authorization
            if (response.data.user_id !== user?.id) {
                toast.error('You do not have permission to delete this memorial');
                navigate(`/memorials/${id}`);
                return;
            }
            setMemorial(response.data);
        }
        catch (error) {
            toast.error('Failed to load memorial');
            console.error(error);
            navigate('/memorials');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        try {
            setDeleting(true);
            await apiClient.delete(`/memorials/${id}`);
            toast.success('Memorial deleted successfully');
            navigate('/memorials');
        }
        catch (error) {
            toast.error('Failed to delete memorial');
            console.error(error);
        }
        finally {
            setDeleting(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    if (!memorial) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-gray-600", children: "Memorial not found" }) }));
    }
    // API may return "name" (alias) or "full_name"
    const displayName = memorial.full_name ?? memorial.name ?? 'Unknown';
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Delete Memorial" }), _jsx("p", { className: "mt-2 text-gray-600", children: "This action cannot be undone" })] }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-8", children: [_jsxs("div", { className: "mb-8 p-6 bg-red-50 border border-red-200 rounded-lg", children: [_jsx("h2", { className: "text-lg font-bold text-red-900", children: "\u26A0\uFE0F Warning" }), _jsxs("p", { className: "text-red-800 mt-2", children: ["You are about to permanently delete the memorial for ", _jsx("strong", { children: displayName }), "."] }), _jsx("p", { className: "text-red-800 mt-2", children: "This action cannot be undone." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-900", children: "Memorial Details" }), _jsx("div", { className: "mt-3 bg-gray-50 p-4 rounded-lg", children: _jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-medium", children: "Name:" }), " ", displayName] }) })] }), _jsxs("div", { className: "pt-6 border-t border-gray-200", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-4", children: "Confirm Deletion" }), confirmDelete ? (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Are you absolutely sure?" }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: () => setConfirmDelete(false), className: "flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition", children: "Cancel" }), _jsx("button", { onClick: handleDelete, disabled: deleting, className: "flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed", children: deleting ? 'Deleting...' : 'Permanently Delete' })] })] })) : (_jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: () => navigate(`/memorials/${id}`), className: "flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition", children: "Keep Memorial" }), _jsx("button", { onClick: handleDelete, className: "flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition", children: "Delete Memorial" })] }))] })] })] }) })] }));
};
export default DeleteMemorialPage;
