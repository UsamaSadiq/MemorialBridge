import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Password Reset Page
 * Reset password after requesting password reset
 */
import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { forgotPassword, resetPassword as resetPasswordApi } from '../../api/auth';
const forgotSchema = z.object({
    email: z.string().email('Invalid email address'),
});
const resetSchema = z
    .object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain uppercase letter')
        .regex(/[a-z]/, 'Must contain lowercase letter')
        .regex(/[0-9]/, 'Must contain digit'),
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
export const PasswordResetPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [isLoading, setIsLoading] = useState(false);
    const [resetRequested, setResetRequested] = useState(false);
    const { register: registerForgot, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors }, } = useForm({
        resolver: zodResolver(forgotSchema),
    });
    const { register: registerReset, handleSubmit: handleResetSubmit, watch, formState: { errors: resetErrors }, } = useForm({
        resolver: zodResolver(resetSchema),
    });
    const password = watch('password');
    const onForgotSubmit = async (data) => {
        setIsLoading(true);
        try {
            await forgotPassword(data.email);
            toast.success('Password reset link sent to your email');
            setResetRequested(true);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to send reset email';
            toast.error(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const onResetSubmit = async (data) => {
        if (!token) {
            toast.error('Invalid reset link');
            return;
        }
        setIsLoading(true);
        try {
            await resetPasswordApi(token, data.password);
            toast.success('Password reset successful! Please login.');
            navigate('/login');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to reset password';
            toast.error(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8)
            strength++;
        if (/[A-Z]/.test(pass))
            strength++;
        if (/[a-z]/.test(pass))
            strength++;
        if (/[0-9]/.test(pass))
            strength++;
        if (/[!@#$%^&*]/.test(pass))
            strength++;
        return strength;
    };
    const passwordStrength = getPasswordStrength(password || '');
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4", children: _jsx("div", { className: "max-w-md mx-auto bg-white rounded-lg shadow-lg p-8", children: token ? (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-3xl font-bold text-center text-gray-900 mb-8", children: "Reset Password" }), _jsxs("form", { onSubmit: handleResetSubmit(onResetSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: "New Password" }), _jsx("input", { ...registerReset('password'), type: "password", id: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" }), resetErrors.password && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: resetErrors.password.message })), password && (_jsxs("div", { className: "mt-2", children: [_jsx("div", { className: "text-xs font-medium text-gray-600 mb-1", children: "Password strength:" }), _jsx("div", { className: "flex gap-1", children: [0, 1, 2, 3, 4].map((i) => (_jsx("div", { className: `h-2 w-8 rounded ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'}` }, i))) })] }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirm Password" }), _jsx("input", { ...registerReset('confirmPassword'), type: "password", id: "confirmPassword", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" }), resetErrors.confirmPassword && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: resetErrors.confirmPassword.message }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn btn-primary btn-block", children: isLoading ? 'Resetting...' : 'Reset Password' })] }), _jsx("p", { className: "text-center text-gray-600 mt-6", children: _jsx(Link, { to: "/login", className: "text-blue-600 hover:text-blue-700 font-medium", children: "Back to Login" }) })] })) : resetRequested ? (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-2xl font-bold text-center text-gray-900 mb-4", children: "Check Your Email" }), _jsx("p", { className: "text-gray-600 text-center mb-6", children: "We've sent a password reset link to your email. Click the link to reset your password." }), _jsx(Link, { to: "/forgot-password", className: "btn btn-primary btn-block", children: "Try Another Email" })] })) : (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-3xl font-bold text-center text-gray-900 mb-2", children: "Forgot Password" }), _jsx("p", { className: "text-gray-600 text-center mb-8", children: "Enter your email and we'll send you a link to reset your password." }), _jsxs("form", { onSubmit: handleForgotSubmit(onForgotSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), _jsx("input", { ...registerForgot('email'), type: "email", id: "email", placeholder: "you@example.com", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" }), forgotErrors.email && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: forgotErrors.email.message }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn btn-primary btn-block", children: isLoading ? 'Sending...' : 'Send Reset Link' })] }), _jsxs("p", { className: "text-center text-gray-600 mt-6", children: ["Remember your password?", ' ', _jsx(Link, { to: "/login", className: "text-blue-600 hover:text-blue-700 font-medium", children: "Login" })] })] })) }) }));
};
