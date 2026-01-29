import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Profile Page
 * User profile management and account settings
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/index';
import { updateProfile, changePassword } from '../../api/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
const profileSchema = z.object({
    email: z.string().email('Invalid email'),
    first_name: z.string().min(2, 'First name required'),
    last_name: z.string().min(2, 'Last name required'),
});
const passwordSchema = z
    .object({
    currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain uppercase letter')
        .regex(/[a-z]/, 'Must contain lowercase letter')
        .regex(/[0-9]/, 'Must contain digit'),
    confirmPassword: z.string(),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
export const ProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);
    const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors }, } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            email: '',
            first_name: '',
            last_name: '',
        },
    });
    // Sync form when user loads or updates (e.g. after fetchCurrentUser or profile save)
    useEffect(() => {
        if (user) {
            resetProfile({
                email: user.email ?? '',
                first_name: user.first_name ?? '',
                last_name: user.last_name ?? '',
            });
        }
    }, [user?.id, user?.email, user?.first_name, user?.last_name, resetProfile]);
    const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors }, } = useForm({
        resolver: zodResolver(passwordSchema),
    });
    const onProfileSubmit = async (data) => {
        setIsLoading(true);
        try {
            const updated = await updateProfile(data);
            dispatch(setUser(updated));
            toast.success('Profile updated successfully');
            setIsEditingProfile(false);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update profile';
            toast.error(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const onPasswordSubmit = async (data) => {
        setIsLoading(true);
        try {
            await changePassword({
                current_password: data.currentPassword,
                new_password: data.newPassword,
            });
            toast.success('Password changed successfully');
            setIsChangingPassword(false);
            resetPassword();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to change password';
            toast.error(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!user) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Loading profile..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "My Profile" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Manage your account and security" })] }) }), _jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6", children: [_jsxs("div", { className: "bg-white rounded-comfort shadow-gentle p-8 border border-brand-blue-100", children: [_jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Account Information" }), _jsx("button", { type: "button", onClick: () => {
                                            setIsEditingProfile(!isEditingProfile);
                                            resetProfile({
                                                email: user.email ?? '',
                                                first_name: user.first_name ?? '',
                                                last_name: user.last_name ?? '',
                                            });
                                        }, className: `btn ${isEditingProfile ? 'btn-secondary' : 'btn-primary'}`, "aria-label": isEditingProfile ? 'Cancel editing profile' : 'Edit profile', children: isEditingProfile ? 'Cancel' : 'Edit profile' })] }), isEditingProfile ? (_jsxs("form", { onSubmit: handleProfileSubmit(onProfileSubmit), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "first_name", className: "block text-sm font-medium text-gray-700 mb-1", children: "First Name" }), _jsx("input", { ...registerProfile('first_name'), type: "text", id: "first_name", className: "w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white" }), profileErrors.first_name && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: profileErrors.first_name.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "last_name", className: "block text-sm font-medium text-gray-700 mb-1", children: "Last Name" }), _jsx("input", { ...registerProfile('last_name'), type: "text", id: "last_name", className: "w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white" }), profileErrors.last_name && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: profileErrors.last_name.message }))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { ...registerProfile('email'), type: "email", id: "email", className: "w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white" }), profileErrors.email && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: profileErrors.email.message }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn btn-success btn-block", children: isLoading ? 'Saving...' : 'Save Changes' })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "First Name" }), _jsx("p", { className: "text-lg text-gray-900 mt-0.5", children: user.first_name?.trim() || '—' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "Last Name" }), _jsx("p", { className: "text-lg text-gray-900 mt-0.5", children: user.last_name?.trim() || '—' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "Email" }), _jsx("p", { className: "text-lg text-gray-900 mt-0.5", children: user.email })] })] }))] }), _jsxs("div", { className: "bg-white rounded-comfort shadow-gentle p-8 border border-brand-blue-100", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Security" }), _jsx("button", { type: "button", onClick: () => {
                                            setIsChangingPassword(!isChangingPassword);
                                            resetPassword();
                                        }, className: `btn ${isChangingPassword ? 'btn-secondary' : 'btn-primary'}`, children: isChangingPassword ? 'Cancel' : 'Change Password' })] }), isChangingPassword ? (_jsxs("form", { onSubmit: handlePasswordSubmit(onPasswordSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "currentPassword", className: "block text-sm font-medium text-gray-700 mb-1", children: "Current Password" }), _jsx("input", { ...registerPassword('currentPassword'), type: "password", id: "currentPassword", className: "w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white" }), passwordErrors.currentPassword && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: passwordErrors.currentPassword.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "newPassword", className: "block text-sm font-medium text-gray-700 mb-1", children: "New Password" }), _jsx("input", { ...registerPassword('newPassword'), type: "password", id: "newPassword", className: "w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white" }), passwordErrors.newPassword && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: passwordErrors.newPassword.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirm Password" }), _jsx("input", { ...registerPassword('confirmPassword'), type: "password", id: "confirmPassword", className: "w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent text-gray-900 bg-white" }), passwordErrors.confirmPassword && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: passwordErrors.confirmPassword.message }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn btn-success btn-block", children: isLoading ? 'Updating...' : 'Update Password' })] })) : (_jsx("p", { className: "text-gray-600", children: "Click \"Change Password\" to update your password" }))] })] })] }));
};
