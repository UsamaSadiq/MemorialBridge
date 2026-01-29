import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Charity List Page
 * Browse and search registered charities
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import apiClient from '../api/client';
import { toast } from 'react-toastify';
export const CharityListPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [charities, setCharities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        fetchCharities();
    }, [search, page]);
    const fetchCharities = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', '20');
            if (search)
                params.append('search', search);
            const response = await apiClient.get(`/charities?${params.toString()}`);
            const list = response.data?.items;
            setCharities(Array.isArray(list) ? list : []);
            setTotal(response.data?.total ?? 0);
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
    const handleCharityClick = (id) => {
        navigate(`/charities/${id}`);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Charities" }), _jsx("p", { className: "mt-2 text-gray-700", children: "Support meaningful causes through memorial fundraisers" })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-8", children: _jsxs("div", { className: "max-w-md", children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Search Charities" }), _jsx("input", { type: "text", value: search, onChange: (e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }, placeholder: "Search by name...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900" })] }) }), loading && (_jsx("div", { className: "flex justify-center items-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) })), !loading && charities.length === 0 && (_jsx("div", { className: "bg-white rounded-lg shadow-sm p-12 text-center", children: _jsx("p", { className: "text-gray-800 font-medium", children: "No charities found. Try adjusting your search filters." }) })), !loading && charities.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: charities.map((charity) => (_jsx("div", { onClick: () => handleCharityClick(charity.id), className: "bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: charity.name }), _jsx("p", { className: "text-sm text-gray-600 mb-4 line-clamp-3", children: charity.description }), charity.url && (_jsx("a", { href: charity.url, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), className: "text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block", children: "Visit Website \u2192" })), _jsx("button", { type: "button", className: "btn btn-primary btn-block mt-4", children: "Learn More" })] }) }, charity.id))) }), total > 20 && (_jsxs("div", { className: "flex justify-center items-center gap-4", children: [_jsx("button", { onClick: () => setPage(Math.max(1, page - 1)), disabled: page === 1, className: "px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), _jsxs("span", { className: "text-gray-600", children: ["Page ", page, " of ", Math.ceil(total / 20)] }), _jsx("button", { onClick: () => setPage(page + 1), disabled: page * 20 >= total, className: "px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed", children: "Next" })] }))] }))] })] }));
};
export default CharityListPage;
