import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Memorials List Page
 * Browse all memorials with pagination, search, and filtering
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../hooks';
import { toast } from 'react-toastify';
import { FeaturedMemorialCard } from '../../components/home/FeaturedMemorialCard';
export const MemorialsListPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [memorials, setMemorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('approved');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 12;
    useEffect(() => {
        fetchMemorials();
    }, [currentPage, filterStatus]);
    // Default to "All Memorials" for admin so they see every memorial on first load
    useEffect(() => {
        if (user?.is_admin) {
            setFilterStatus((prev) => (prev === 'approved' ? 'all' : prev));
        }
    }, [user?.is_admin]);
    const fetchMemorials = async (override) => {
        try {
            setLoading(true);
            const page = override?.page ?? currentPage;
            const params = {
                page: page.toString(),
                page_size: itemsPerPage.toString(),
                status: filterStatus,
            };
            if (searchTerm.trim())
                params.search = searchTerm.trim();
            const response = await apiClient.get('/memorials', { params });
            const list = response.data?.items ?? response.data?.memorials ?? [];
            const total = response.data?.total ?? 0;
            const pages = response.data?.pages ?? Math.max(1, Math.ceil(total / itemsPerPage));
            setMemorials(Array.isArray(list) ? list : []);
            setTotalPages(pages);
            if (override?.page !== undefined)
                setCurrentPage(override.page);
        }
        catch (error) {
            toast.error('Failed to load memorials');
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchMemorials({ page: 1 });
    };
    const handleCreateMemorial = () => {
        navigate('/memorials/create');
    };
    const handleViewMemorial = (id) => {
        navigate(`/memorials/${id}`);
    };
    const handleEditMemorial = (id) => {
        navigate(`/memorials/${id}/edit`);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "flex justify-between items-start md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Memorials" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Browse and honor cherished memories. Filter by status or search by name." })] }), _jsxs("button", { onClick: handleCreateMemorial, type: "button", className: "btn btn-success whitespace-nowrap", children: [_jsx("svg", { className: "w-5 h-5 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), "Create Memorial"] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-8", children: _jsxs("form", { onSubmit: handleSearch, className: "space-y-4", children: [_jsxs("div", { className: "flex gap-4 flex-col md:flex-row", children: [_jsx("input", { type: "text", placeholder: "Search by name...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900" }), _jsxs("button", { type: "submit", className: "btn btn-primary whitespace-nowrap", children: [_jsx("svg", { className: "w-5 h-5 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), "Search"] })] }), _jsxs("div", { className: "flex gap-6 flex-wrap", children: [_jsxs("label", { className: "flex items-center cursor-pointer group", children: [_jsx("input", { type: "radio", name: "status", value: "all", checked: filterStatus === 'all', onChange: (e) => {
                                                        setFilterStatus(e.target.value);
                                                        setCurrentPage(1);
                                                    }, className: "mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500" }), _jsx("span", { className: "text-gray-700 group-hover:text-gray-900 transition-colors font-medium", children: "All Memorials" })] }), _jsxs("label", { className: "flex items-center cursor-pointer group", children: [_jsx("input", { type: "radio", name: "status", value: "approved", checked: filterStatus === 'approved', onChange: (e) => {
                                                        setFilterStatus(e.target.value);
                                                        setCurrentPage(1);
                                                    }, className: "mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500" }), _jsx("span", { className: "text-gray-700 group-hover:text-gray-900 transition-colors font-medium", children: "Approved" })] }), _jsxs("label", { className: "flex items-center cursor-pointer group", children: [_jsx("input", { type: "radio", name: "status", value: "pending", checked: filterStatus === 'pending', onChange: (e) => {
                                                        setFilterStatus(e.target.value);
                                                        setCurrentPage(1);
                                                    }, className: "mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500" }), _jsx("span", { className: "text-gray-700 group-hover:text-gray-900 transition-colors font-medium", children: "Pending Review" })] })] })] }) }), loading ? (_jsx("div", { className: "flex justify-center items-center min-h-96", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-700", children: "Loading memorials..." })] }) })) : memorials.length === 0 ? (_jsxs("div", { className: "bg-white rounded-comfort shadow-gentle p-12 text-center border border-brand-blue-100", children: [_jsx("div", { className: "w-16 h-16 bg-brand-blue-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx("svg", { className: "w-8 h-8 text-brand-blue-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" }) }) }), _jsx("p", { className: "text-gray-800 text-lg font-medium", children: "No memorials found" }), user && (_jsx("p", { className: "mt-2 text-gray-600", children: _jsx("button", { type: "button", onClick: handleCreateMemorial, className: "text-brand-blue-600 hover:text-brand-blue-700 font-medium underline", children: "Create a memorial" }) }))] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: memorials.map((memorial) => (_jsx(FeaturedMemorialCard, { memorial: {
                                        ...memorial,
                                        full_name: memorial.full_name ?? memorial.name,
                                        name: memorial.name ?? memorial.full_name,
                                    }, variant: "list", currentUserId: user?.id, onView: handleViewMemorial, onEdit: handleEditMemorial }, memorial.id))) }), totalPages > 1 && (_jsxs("div", { className: "flex justify-center gap-2 mt-8", children: [_jsx("button", { onClick: () => setCurrentPage(Math.max(1, currentPage - 1)), disabled: currentPage === 1, className: "px-4 py-2 border border-brand-blue-200 rounded-soft hover:bg-brand-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-warmgray-700", children: "Previous" }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { onClick: () => setCurrentPage(page), className: `px-4 py-2 rounded-soft font-medium transition-all ${currentPage === page
                                            ? 'bg-gradient-to-r from-brand-blue-300 to-brand-blue-400 text-white shadow-gentle'
                                            : 'border border-brand-blue-200 text-warmgray-700 hover:bg-brand-blue-50'}`, children: page }, page))), _jsx("button", { onClick: () => setCurrentPage(Math.min(totalPages, currentPage + 1)), disabled: currentPage === totalPages, className: "px-4 py-2 border border-brand-blue-200 rounded-soft hover:bg-brand-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-warmgray-700", children: "Next" })] }))] }))] })] }));
};
export default MemorialsListPage;
