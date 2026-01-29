import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Login Page
 * User authentication with email and password
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/index';
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional(),
});
export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const success = await login(data.email, data.password);
            if (success) {
                toast.success('Login successful!');
                navigate('/');
            }
            else {
                toast.error('Invalid email or password');
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            toast.error(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4", children: _jsxs("div", { className: "max-w-md mx-auto bg-white rounded-lg shadow-lg p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-center text-gray-900 mb-8", children: "Login" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }), _jsx("input", { ...register('email'), type: "email", id: "email", placeholder: "you@example.com", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" }), errors.email && _jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.email.message })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }), _jsx("input", { ...register('password'), type: "password", id: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600" }), errors.password && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.password.message }))] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { ...register('rememberMe'), type: "checkbox", id: "rememberMe", className: "w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" }), _jsx("label", { htmlFor: "rememberMe", className: "ml-2 text-sm text-gray-700", children: "Remember me" })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn btn-primary btn-block", children: isLoading ? 'Logging in...' : 'Login' })] }), _jsxs("div", { className: "mt-6 space-y-2 text-center", children: [_jsx("p", { children: _jsx(Link, { to: "/forgot-password", className: "text-blue-600 hover:text-blue-700", children: "Forgot password?" }) }), _jsxs("p", { className: "text-gray-600", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "text-blue-600 hover:text-blue-700 font-medium", children: "Sign up" })] })] })] }) }));
};
