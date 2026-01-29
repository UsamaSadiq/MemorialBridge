import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * User Management Page
 * View and manage system users
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';
export const UserManagementPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAdmin, setFilterAdmin] = useState('all');
    useEffect(() => {
        if (!user?.is_admin) {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [user, navigate]);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/admin/users');
            setUsers(response.data.users);
        }
        catch (error) {
            toast.error('Failed to load users');
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    const toggleAdminStatus = async (userId, isAdmin) => {
        try {
            await apiClient.put(`/admin/users/${userId}/admin`, {
                is_admin: !isAdmin,
            });
            setUsers(users.map((u) => (u.id === userId ? { ...u, is_admin: !isAdmin } : u)));
            toast.success(isAdmin ? 'Admin privileges removed' : 'Admin privileges granted');
        }
        catch (error) {
            toast.error('Failed to update user');
            console.error(error);
        }
    };
    const toggleUserStatus = async (userId, isActive) => {
        try {
            await apiClient.put(`/admin/users/${userId}/status`, {
                is_active: !isActive,
            });
            setUsers(users.map((u) => (u.id === userId ? { ...u, is_active: !isActive } : u)));
            toast.success(isActive ? 'User deactivated' : 'User activated');
        }
        catch (error) {
            toast.error('Failed to update user status');
            console.error(error);
        }
    };
    const filteredUsers = users.filter((u) => {
        const matchesSearch = u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterAdmin === 'all' ||
            (filterAdmin === 'admin' && u.is_admin) ||
            (filterAdmin === 'user' && !u.is_admin);
        return matchesSearch && matchesFilter;
    });
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "User Management" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Manage users and their permissions" })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: [_jsx("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Search Users" }), _jsx("input", { type: "text", placeholder: "Name or email...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Filter by Role" }), _jsxs("select", { value: filterAdmin, onChange: (e) => setFilterAdmin(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900", children: [_jsx("option", { value: "all", children: "All Users" }), _jsx("option", { value: "admin", children: "Admins Only" }), _jsx("option", { value: "user", children: "Regular Users" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Results" }), _jsxs("div", { className: "px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium", children: [filteredUsers.length, " user", filteredUsers.length !== 1 ? 's' : ''] })] })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm overflow-hidden", children: [_jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Email" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Role" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Joined" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Last Login" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: filteredUsers.map((u) => (_jsxs("tr", { className: "hover:bg-gray-50 transition", children: [_jsxs("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: [u.first_name, " ", u.last_name] }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: u.email }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-semibold ${u.is_admin
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-gray-100 text-gray-800'}`, children: u.is_admin ? 'Admin' : 'User' }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: new Date(u.created_at).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never' }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-semibold ${u.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'}`, children: u.is_active ? 'Active' : 'Inactive' }) }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => toggleAdminStatus(u.id, u.is_admin), className: `px-3 py-1 rounded text-xs font-medium transition ${u.is_admin
                                                                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: [u.is_admin ? 'Revoke' : 'Grant', " Admin"] }), _jsx("button", { onClick: () => toggleUserStatus(u.id, u.is_active), className: `px-3 py-1 rounded text-xs font-medium transition ${u.is_active
                                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'}`, children: u.is_active ? 'Deactivate' : 'Activate' })] }) })] }, u.id))) })] }), filteredUsers.length === 0 && (_jsx("div", { className: "px-6 py-8 text-center text-gray-700", children: _jsx("p", { children: "No users found matching your search" }) }))] })] })] }));
};
export default UserManagementPage;
